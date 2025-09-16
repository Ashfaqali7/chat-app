const ChatHeader = ({ activeChat, users, me }) => {
  if (!activeChat) {
    return (
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="text-gray-500">Select a user to start chatting</div>
      </div>
    );
  }

  const otherUser = users.find(
    u => u._id !== me?._id && activeChat?.users?.some(user => user._id === u._id)
  );

  return (
    <div className="p-4 border-b border-gray-200 bg-white flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
        {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="font-semibold">
        {otherUser?.name || "User"}
      </div>
    </div>
  );
};

export default ChatHeader;