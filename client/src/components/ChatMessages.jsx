const ChatMessages = ({ activeChat, messages, me }) => {
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
        <div className="text-center max-w-md">
          <div className="bg-teal-100 rounded-full p-4 inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chat App</h3>
          <p className="text-gray-600">Select a user from the sidebar to start chatting. Your conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-cyan-50 to-teal-100">
      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs sm:max-w-md md:max-w-lg rounded-2xl p-4 relative shadow-sm ${
              m.sender._id === me?._id
                ? 'ml-auto bg-teal-500 text-white rounded-br-none'
                : 'mr-auto bg-white text-gray-800 rounded-bl-none'
            }`}
          >
            <div className="text-xs opacity-75 mb-1">
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="break-words">{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;