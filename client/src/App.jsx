import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const [token, setToken] = useState("");
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

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
    <div className="mx-auto max-w-6xl p-4 grid grid-cols-12 gap-4">
      {!token ? (
        <Auth onLogin={login} onRegister={register} />
      ) : (
        <>
          <aside className="col-span-4 bg-white rounded-lg border p-3">
            <h2 className="font-semibold mb-3">Users</h2>
            <ul className="space-y-1">
              {users.map(u => (
                <li key={u._id}>
                  <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100" onClick={() => ensureChatWith(u._id)}>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-gray-200" />
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <main className="col-span-8 bg-white rounded-lg border flex flex-col">
            <div className="border-b p-3 font-semibold">{activeChat ? "Chat" : "Select a user to start chatting"}</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map(m => (
                <div key={m._id} className={`max-w-[70%] px-3 py-2 rounded ${m.sender._id === me?._id ? "ml-auto bg-blue-500 text-white" : "bg-gray-100"}`}>
                  <div className="text-xs opacity-75">{new Date(m.createdAt).toLocaleTimeString()}</div>
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
            {activeChat && (
              <div className="p-3 border-t flex gap-2">
                <input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type a message" className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
              </div>
            )}
          </main>
        </>
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
    <div className="max-w-sm mx-auto bg-white border rounded-lg p-6 w-full">
      <h1 className="text-xl font-semibold mb-4">{mode === "login" ? "Login" : "Register"}</h1>
      {mode === "register" && (
        <div className="mb-3">
          <label className="text-sm">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}
      <div className="mb-3">
        <label className="text-sm">Email</label>
        <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="text-sm">Password</label>
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex gap-2">
        {mode === "login" ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => onLogin(email, password)}>Login</button>
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => onRegister(name, email, password)}>Register</button>
        )}
        <button className="px-4 py-2" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create account" : "Have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default App
