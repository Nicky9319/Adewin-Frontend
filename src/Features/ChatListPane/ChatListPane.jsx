import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, User } from 'lucide-react';

const ChatListPane = ({ onChatSelect, selectedChatId, chats, onNewChat, onDeleteChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`h-full bg-black border-r border-[#1C1C1E] transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1C1C1E] flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-white text-lg font-semibold">Chats</h2>
          )}
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg bg-[#007AFF] hover:bg-[#0056CC] transition-colors"
            title="New Chat"
          >
            <Plus size={20} className="text-white" />
          </button>
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
                  ? 'bg-[#007AFF] text-white'
                  : 'hover:bg-[#1C1C1E] text-[#E5E5E7]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <MessageSquare size={16} />
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {chat.title || 'New Chat'}
                      </p>
                      <p className="text-xs opacity-70 truncate">
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
                    className="p-1 rounded hover:bg-[#FF3B30] transition-colors"
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
      <div className="p-4 border-t border-[#1C1C1E] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm text-white font-medium">User</p>
              <p className="text-xs text-[#8E8E93]">user@example.com</p>
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-[#1C1C1E] transition-colors"
            title="Settings"
          >
            <Settings size={16} className="text-[#8E8E93]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatListPane;
