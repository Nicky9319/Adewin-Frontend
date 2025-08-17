import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, User, X } from 'lucide-react';

const ChatListPane = ({ onChatSelect, selectedChatId, chats, onNewChat, onDeleteChat, isOpen, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-black font-primary">Chats</h2>
            )}
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="New Chat"
            >
              <Plus size={18} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                selectedChatId === chat.id
                  ? 'bg-gray-100 text-black'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <MessageSquare size={16} />
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate font-primary">
                        {chat.title || 'New Chat'}
                      </p>
                      <p className="text-xs opacity-70 truncate font-secondary">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  )}
                </div>
                {!isCollapsed && selectedChatId === chat.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm text-black font-medium font-primary">User</p>
              <p className="text-xs text-gray-500 font-secondary">user@example.com</p>
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatListPane;
