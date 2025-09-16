const ChatInput = ({ messageText, onMessageChange, onSendMessage, disabled }) => {
  return (
    <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex space-x-2">
        <input
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
        />
        <button
          onClick={onSendMessage}
          disabled={!messageText.trim() || disabled}
          className={`w-14 h-14 rounded-full font-medium transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
            messageText.trim() && !disabled
              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md transform hover:scale-105"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;