import { useState } from "react";
import UserItem from "./UserItem";

const Sidebar = ({ me, users, activeChat, onUserSelect, onAddUser, onNewUserEmailChange, newUserEmail, showAddUser, setShowAddUser }) => {
  return (
    <aside className="bg-indigo-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-indigo-800">
        <h2 className="text-2xl font-bold mb-6">Chat App</h2>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
            {me?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-semibold">{me?.name}</div>
            <div className="text-indigo-200 text-sm">{me?.email}</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Users</h3>
          <button 
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-indigo-700 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition duration-300"
            title="Add User"
          >
            +
          </button>
        </div>
        
        {showAddUser && (
          <div className="mb-4 bg-indigo-800 p-3 rounded-lg">
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => onNewUserEmailChange(e.target.value)}
              placeholder="Enter email to add user"
              className="w-full px-3 py-2 rounded mb-2 text-gray-800"
            />
            <div className="flex gap-2">
              <button
                onClick={onAddUser}
                className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition duration-300"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddUser(false);
                  onNewUserEmailChange("");
                }}
                className="flex-1 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
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
    </aside>
  );
};

export default Sidebar;