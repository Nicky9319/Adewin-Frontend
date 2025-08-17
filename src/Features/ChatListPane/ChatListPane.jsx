import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, User, X, Menu } from 'lucide-react';

const ChatListPane = ({ onChatSelect, selectedChatId, chats, onNewChat, onDeleteChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className={`border-b border-gray-200 flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-black font-primary">Adewin</h2>
            </div>
          )}
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <Menu size={18} className="text-black" />
            ) : (
              <X size={18} className="text-black" />
            )}
          </button>
        </div>
      </div>

      {/* New Chat Button - shown when expanded */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onNewChat}
            className="w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center space-x-3"
          >
            <Plus size={18} className="text-black" />
            <span className="text-sm font-medium text-black font-primary">Start new chat</span>
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`${isCollapsed ? 'p-2' : 'p-2'}`}>
          {!isCollapsed && chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`${isCollapsed ? 'p-2' : 'p-3'} rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                selectedChatId === chat.id
                  ? 'bg-gray-100 text-black'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3 min-w-0 flex-1'}`}>
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
          {/* Add Chat Button - shown when collapsed */}
          {isCollapsed && (
            <div className="mt-4">
              <button
                onClick={onNewChat}
                className="w-full p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                title="New Chat"
              >
                <Plus size={18} className="text-black" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t border-gray-200 flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-2 justify-center' : 'space-x-3'}`}>
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
