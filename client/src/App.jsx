import { useEffect, useRef, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
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
    localStorage.setItem("token", data.token);
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
    localStorage.setItem("token", data.token);
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

  useEffect(() => { 
    if (token) {
      loadUsers(); 
    }
  }, [token]);

  // Add a logout function to clear token
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMe(null);
  };

  return (
    <div className="container mx-auto h-screen flex flex-col p-2 sm:p-4 md:p-8">
      {!token ? (
        <Auth onLogin={login} onRegister={register} />
      ) : (
        <div className="flex flex-1 overflow-hidden rounded-2xl shadow-xl">
          <div className="w-64 sm:w-80 flex-shrink-0  md:block">
            <Sidebar
              me={me}
              users={users}
              activeChat={activeChat}
              onUserSelect={ensureChatWith}
              onAddUser={addUserByEmail}
              onNewUserEmailChange={setNewUserEmail}
              newUserEmail={newUserEmail}
              showAddUser={showAddUser}
              setShowAddUser={setShowAddUser}
              onLogout={logout}
            />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <ChatHeader activeChat={activeChat} users={users} me={me} />
            <ChatMessages activeChat={activeChat} messages={messages} me={me} />
            {activeChat && (
              <ChatInput
                messageText={messageText}
                onMessageChange={setMessageText}
                onSendMessage={sendMessage}
                disabled={!activeChat}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;