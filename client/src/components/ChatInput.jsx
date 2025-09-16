const ChatInput = ({ messageText, onMessageChange, onSendMessage, disabled }) => {
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex space-x-2">
        <input
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
        />
        <button
          onClick={onSendMessage}
          disabled={!messageText.trim() || disabled}
          className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
            messageText.trim() && !disabled
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;