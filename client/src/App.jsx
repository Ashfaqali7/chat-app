import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const ws = useRef(null);

  async function login(email, password) {
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return alert("Login failed");
    const data = await res.json();
    setToken(data.token);
    setMe(data);
  }

  async function register(name, email, password) {
    const res = await fetch(`${apiBase}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) return alert("Register failed");
    const data = await res.json();
    setToken(data.token);
    setMe(data);
  }

  async function loadUsers() {
    const res = await fetch(`${apiBase}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  }

  async function ensureChatWith(userId) {
    const res = await fetch(`${apiBase}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId })
    });
    const chat = await res.json();
    setActiveChat(chat);
    const msgs = await fetch(`${apiBase}/api/message/${chat._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    setMessages(msgs);
    ws.current?.emit?.("join_room", chat._id);
  }

  async function sendMessage() {
    if (!messageText.trim() || !activeChat) return;
    const res = await fetch(`${apiBase}/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: messageText, chatId: activeChat._id })
    });
    const msg = await res.json();
    setMessages(prev => [...prev, msg]);
    ws.current?.emit?.("send_message", { chatId: activeChat._id, message: msg });
    setMessageText("");
  }

  async function addUserByEmail() {
    if (!newUserEmail.trim()) return;
    
    try {
      const res = await fetch(`${apiBase}/api/auth/add-user`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email: newUserEmail })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add user");
      }
      
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setNewUserEmail("");
      setShowAddUser(false);
      alert("User added successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    let socket;
    import("socket.io-client").then(({ io }) => {
      socket = io(apiBase, { withCredentials: true });
      ws.current = socket;
      if (me?._id) socket.emit("user_connected", me._id);
      socket.on("receive_message", (data) => {
        if (data?.message?.chat === activeChat?._id) {
          setMessages(prev => [...prev, data.message]);
        }
      });
    });
    return () => socket?.disconnect?.();
  }, [apiBase, me?._id, activeChat?._id]);

  useEffect(() => { if (token) loadUsers(); }, [token]);

  return (
    <div>
      {!token ? (
        <Auth onLogin={login} onRegister={register} />
      ) : (
        <div className="chat-container">
          <aside className="chat-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Chat App</h2>
              <div className="sidebar-user">
                <div className="user-avatar">
                  {me?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="user-info">
                  <div className="user-name">{me?.name}</div>
                  <div className="user-email">{me?.email}</div>
                </div>
              </div>
            </div>
            <div className="sidebar-users">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Users</h3>
                <button 
                  onClick={() => setShowAddUser(!showAddUser)}
                  style={{ 
                    background: "rgba(255,255,255,0.2)", 
                    border: "none", 
                    color: "white", 
                    borderRadius: "50%", 
                    width: "30px", 
                    height: "30px",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Add User"
                >
                  +
                </button>
              </div>
              
              {showAddUser && (
                <div style={{ marginBottom: "1rem", background: "rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "8px" }}>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email to add user"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "none",
                      marginBottom: "0.5rem"
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={addUserByEmail}
                      style={{
                        flex: 1,
                        padding: "0.4rem",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserEmail("");
                      }}
                      style={{
                        flex: 1,
                        padding: "0.4rem",
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <ul style={{ listStyle: "none" }}>
                {users
                  .filter(u => u._id !== me?._id)
                  .map(u => (
                    <li key={u._id}>
                      <button 
                        className={`user-list-item ${activeChat?.users?.some(user => user._id === u._id) ? 'active' : ''}`}
                        onClick={() => ensureChatWith(u._id)}
                      >
                        <div className="user-item-content">
                          <div className="user-item-avatar">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-item-info">
                            <div className="user-item-name">{u.name}</div>
                            <div className="user-item-email">{u.email}</div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
          <main className="chat-main">
            <div className="chat-header">
              {activeChat ? (
                <>
                  <div className="chat-avatar">
                    {users
                      .find(u => u._id !== me?._id && activeChat?.users?.some(user => user._id === u._id))
                      ?.name?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>
                  <div>
                    {users.find(u => u._id !== me?._id && activeChat?.users?.some(user => user._id === u._id))?.name || "User"}
                  </div>
                </>
              ) : (
                "Select a user to start chatting"
              )}
            </div>
            <div className="chat-messages">
              {activeChat ? (
                messages.map(m => (
                  <div 
                    key={m._id} 
                    className={`message ${m.sender._id === me?._id ? "own" : "other"}`}
                  >
                    <div className="message-time">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>{m.content}</div>
                  </div>
                ))
              ) : (
                <div className="chat-placeholder">
                  Select a user from the sidebar to start chatting
                </div>
              )}
            </div>
            {activeChat && (
              <div className="chat-input-container">
                <input 
                  value={messageText} 
                  onChange={(e) => setMessageText(e.target.value)} 
                  placeholder="Type a message..." 
                  className="chat-input"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button 
                  onClick={sendMessage} 
                  className="chat-send-button"
                  disabled={!messageText.trim()}
                >
                  Send
                </button>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function Auth({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <div className="auth-container">
      <h1 className="auth-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
      {mode === "register" && (
        <div className="auth-form-group">
          <label className="auth-form-label">Name</label>
          <input 
            className="auth-form-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
          />
        </div>
      )}
      <div className="auth-form-group">
        <label className="auth-form-label">Email</label>
        <input 
          className="auth-form-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email"
          type="email"
        />
      </div>
      <div className="auth-form-group">
        <label className="auth-form-label">Password</label>
        <input 
          type="password" 
          className="auth-form-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password"
        />
      </div>
      <button 
        className="auth-form-button" 
        onClick={() => mode === "login" ? onLogin(email, password) : onRegister(name, email, password)}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
      <button 
        className="auth-form-toggle" 
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setName("");
          setEmail("");
          setPassword("");
        }}
      >
        {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default App;