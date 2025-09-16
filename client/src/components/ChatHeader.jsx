const ChatHeader = ({ activeChat, users, me }) => {
  if (!activeChat) {
    return (
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="text-gray-500 text-center py-2">Select a user to start chatting</div>
      </div>
    );
  }

  const otherUser = users.find(
    u => u._id !== me?._id && activeChat?.users?.some(user => user._id === u._id)
  );

  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex items-center space-x-4 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-lg truncate">{otherUser?.name || "User"}</div>
        <div className="text-gray-500 text-sm">Online</div>
      </div>
    </div>
  );
};

export default ChatHeader;