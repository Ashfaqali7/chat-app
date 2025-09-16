const ChatMessages = ({ activeChat, messages, me }) => {
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="text-gray-500 text-center">
          <div className="text-xl mb-2">Welcome to Chat App</div>
          <div>Select a user from the sidebar to start chatting</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 relative ${
              m.sender._id === me?._id
                ? 'ml-auto bg-indigo-500 text-white rounded-br-none'
                : 'mr-auto bg-white text-gray-800 rounded-bl-none shadow'
            }`}
          >
            <div className="text-xs opacity-75 mb-1">
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;