const UserItem = ({ user, isActive, onClick }) => {
  return (
    <li>
      <button
        className={`w-full text-left p-3 rounded-xl transition duration-300 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${isActive
            ? 'bg-indigo-700 shadow-md'
            : 'hover:bg-indigo-800'
          }`}
        onClick={onClick}
      >
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate text-base">{user.name}</div>
          <div className="text-indigo-200 text-sm truncate">{user.email}</div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
      </button>
    </li>
  );
};

export default UserItem;