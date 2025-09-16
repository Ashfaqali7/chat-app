import { useState } from "react";

const Auth = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {mode === "login" 
              ? "Sign in to continue to your account" 
              : "Join us today to start chatting"}
          </p>
        </div>
        
        {mode === "register" && (
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}
        
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        
        <button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 mb-4 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          onClick={() => mode === "login" ? onLogin(email, password) : onRegister(name, email, password)}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
        
        <div className="text-center">
          <button
            className="text-teal-600 hover:text-teal-800 font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
      </div>
    </div>
  );
};

export default Auth;