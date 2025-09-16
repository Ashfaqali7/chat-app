import { useState } from "react";
import UserItem from "./UserItem";

const Sidebar = ({ me, users, activeChat, onUserSelect, onAddUser, onNewUserEmailChange, newUserEmail, showAddUser, setShowAddUser }) => {
  return (
    <aside className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white h-full flex flex-col shadow-xl">
      <div className="p-4 border-b border-indigo-700">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Chat App</h2>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            {me?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{me?.name}</div>
            <div className="text-indigo-200 text-xs sm:text-sm truncate">{me?.email}</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-indigo-700 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Add User"
            aria-label="Add User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {showAddUser && (
          <div className="mb-4 bg-indigo-800 p-3 rounded-lg transition-all duration-300">
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => onNewUserEmailChange(e.target.value)}
              placeholder="Enter email to add user"
              className="w-full px-3 py-2 rounded mb-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={onAddUser}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddUser(false);
                  onNewUserEmailChange("");
                }}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          <ul className="space-y-2">
            {users
              .filter(u => u._id !== me?._id)
              .map(u => (
                <UserItem
                  key={u._id}
                  user={u}
                  isActive={activeChat?.users?.some(user => user._id === u._id)}
                  onClick={() => onUserSelect(u._id)}
                />
              ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;