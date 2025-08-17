import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Settings, User, X, Menu } from 'lucide-react';

const ChatListPane = ({ onChatSelect, selectedChatId, chats, onNewChat, onDeleteChat, onViewChat, onEditChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  // Global click handler to close floating widgets
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Check if click is outside the floating buttons and not on a chat item
      const floatingButtons = document.querySelector('.floating-button-container');
      const chatItems = document.querySelectorAll('[data-chat-item]');
      
      let isOnChatItem = false;
      chatItems.forEach(item => {
        if (item.contains(e.target)) {
          isOnChatItem = true;
        }
      });

      if (floatingButtons && !floatingButtons.contains(e.target) && !isOnChatItem) {
        setActiveChatId(null);
      }
    };

    // Only add listener when floating widgets are open
    if (activeChatId) {
      document.addEventListener('click', handleGlobalClick);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [activeChatId]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChatClick = (chatId) => {
    if (activeChatId === chatId) {
      setActiveChatId(null);
    } else {
      setActiveChatId(chatId);
    }
  };

  const handleView = (chatId, e) => {
    e.stopPropagation();
    onViewChat(chatId);
    setActiveChatId(null);
  };

  const handleEdit = (chatId, e) => {
    e.stopPropagation();
    onEditChat(chatId);
    setActiveChatId(null);
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation();
    onDeleteChat(chatId);
    setActiveChatId(null);
  };

  // Close floating options when clicking outside
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveChatId(null);
    }
  };

  return (
    <div 
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      onClick={handleContainerClick}
    >
      {/* Header */}
      <div className={`border-b border-gray-200 flex-shrink-0 relative z-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
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
        <div className="p-4 border-b border-gray-200 relative z-0">
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
      <div className="flex-1 overflow-y-auto overflow-x-visible min-h-0">
        <div className={`${isCollapsed ? 'p-2' : 'p-2'}`}>
          {!isCollapsed && chats.map((chat) => (
            <div
              key={chat.id}
              className="relative"
              data-chat-item
            >
              <div
                onClick={() => handleChatClick(chat.id)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                  selectedChatId === chat.id
                    ? 'bg-gray-100 text-black'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <MessageSquare size={16} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate font-primary">
                        {chat.title || 'New Chat'}
                      </p>
                      <p className="text-xs opacity-70 truncate font-secondary">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Buttons */}
              {activeChatId === chat.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-[99999] floating-button-container">
                  <button
                    onClick={(e) => handleView(chat.id, e)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out text-black border border-gray-200 shadow-lg text-sm font-medium whitespace-nowrap floating-button-enter hover:scale-105 hover:shadow-xl "
                    title="View Chat"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => handleEdit(chat.id, e)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out text-black border border-gray-200 shadow-lg text-sm font-medium whitespace-nowrap floating-button-enter floating-button-enter-delay-1 hover:scale-105 hover:shadow-xl"
                    title="Edit Chat"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out text-black border border-gray-200 shadow-lg text-sm font-medium whitespace-nowrap floating-button-enter floating-button-enter-delay-2 hover:scale-105 hover:shadow-xl"
                    title="Delete Chat"
                  >
                    Delete
                  </button>
                </div>
              )}
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
