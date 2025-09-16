const UserItem = ({ user, isActive, onClick }) => {
  return (
    <li>
      <button 
        className={`w-full text-left p-3 rounded-lg transition duration-300 flex items-center space-x-3 ${
          isActive 
            ? 'bg-indigo-700' 
            : 'hover:bg-indigo-800'
        }`}
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{user.name}</div>
          <div className="text-indigo-200 text-sm truncate">{user.email}</div>
        </div>
      </button>
    </li>
  );
};

export default UserItem;