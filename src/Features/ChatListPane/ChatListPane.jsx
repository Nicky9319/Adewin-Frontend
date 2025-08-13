import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, User, X } from 'lucide-react';

const ChatListPane = ({ onChatSelect, selectedChatId, chats, onNewChat, onDeleteChat, isOpen, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`h-full bg-black border-r border-[#1C1C1E] transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-72 lg:w-80'
      }`}
    >
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-[#1C1C1E] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-3">
            {!isCollapsed && (
              <h2 className="text-white text-base lg:text-lg font-semibold font-primary heading-line-height">Chats</h2>
            )}
            <button
              onClick={onNewChat}
              className="p-1.5 lg:p-2 rounded-lg bg-[#1C1C1E] hover:bg-[#2D2D2F] transition-colors"
              title="New Chat"
            >
              <Plus size={16} className="lg:w-5 lg:h-5 text-[#FFFFFF]" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-1.5 lg:p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-2 lg:p-3 rounded-lg mb-1.5 lg:mb-2 cursor-pointer transition-all duration-200 ${
                selectedChatId === chat.id
                  ? 'bg-[#1C1C1E] text-[#FFFFFF]'
                  : 'hover:bg-[#1C1C1E] text-[#E5E5E7]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                  <MessageSquare size={14} className="lg:w-4 lg:h-4" />
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium truncate font-primary">
                        {chat.title || 'New Chat'}
                      </p>
                      <p className="text-xs opacity-70 truncate font-secondary body-line-height">
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
                    className="p-1 rounded hover:bg-[#1C1C1E] transition-colors"
                    title="Delete Chat"
                  >
                    <Trash2 size={12} className="lg:w-3.5 lg:h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-[#1C1C1E] flex-shrink-0">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center">
            <User size={14} className="lg:w-4 lg:h-4 text-[#FFFFFF]" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-xs lg:text-sm text-white font-medium font-primary">User</p>
              <p className="text-xs text-[#8E8E93] font-secondary body-line-height">user@example.com</p>
            </div>
          )}
          <button
            className="p-1.5 lg:p-2 rounded-lg hover:bg-[#1C1C1E] transition-colors"
            title="Settings"
          >
            <Settings size={14} className="lg:w-4 lg:h-4 text-[#8E8E93]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatListPane;
