import React, { useState, useEffect } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import ChatListPane from '../ChatListPane';
import ChatThread from '../ChatThread';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen]);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      lastMessage: 'No messages yet',
      timestamp: new Date().toISOString()
    };
    
    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newChatId]: []
    }));
    setSelectedChatId(newChatId);
  };

  const handleDeleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
      return newMessages;
    });
    
    // Select the first available chat or create a new one
    const remainingChats = chats.filter(chat => chat.id !== chatId);
    if (remainingChats.length > 0) {
      setSelectedChatId(remainingChats[0].id);
    } else {
      setSelectedChatId(null);
    }
  };

  const handleSendMessage = async (content) => {
    let chatId = selectedChatId;
    
    // If no chat is selected, create a new one
    if (!chatId) {
      chatId = Date.now().toString();
      const newChat = {
        id: chatId,
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        lastMessage: content,
        timestamp: new Date().toISOString()
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(chatId);
      setMessages(prev => ({
        ...prev,
        [chatId]: []
      }));
    }

    const currentMessages = messages[chatId] || [];
    const userMessage = {
      id: `${chatId}-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message
    setMessages(prev => ({
      ...prev,
      [chatId]: [...currentMessages, userMessage]
    }));

    // Update chat title and last message
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: content, timestamp: new Date().toISOString() }
        : chat
    ));

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: `${chatId}-${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), assistantMessage]
      }));

      // Update last message
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: assistantMessage.content.substring(0, 50) + '...' }
          : chat
      ));

      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateAIResponse = (userMessage) => {
    // Simple response generation - replace with actual AI integration
    const responses = [
      "I understand you're asking about that. Let me help you with that.",
      "That's an interesting question. Here's what I can tell you about it.",
      "I'd be happy to help you with that. Let me provide some information.",
      "That's a great question! Here's my response to help you out.",
      "I can assist you with that. Let me give you a detailed answer."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const currentMessages = messages[selectedChatId] || [];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Chat List Pane */}
      <div className={`fixed top-0 left-0 h-full z-30 sidebar-toggle ${
        isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'
      }`} style={{ width: '320px' }}>
        <ChatListPane
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      
      {/* No standalone close button – header toggle handles both open/close */}
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 relative transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[320px]' : 'lg:pl-0'}`}>
        {/* Header */}
        <div className="bg-[#111111] border-b border-[#1C1C1E] px-3 lg:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Sidebar Toggle Button (visible on all screens) */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 lg:p-3 rounded-lg bg-[#1C1C1E] hover:bg-[#2D2D2F] transition-colors border border-[#2D2D2F]"
                title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
              >
                {isSidebarOpen ? (
                  <X size={18} className="lg:w-5 lg:h-5 text-[#FFFFFF]" />
                ) : (
                  <Menu size={18} className="lg:w-5 lg:h-5 text-[#FFFFFF]" />
                )}
              </button>
              
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                <Bot size={14} className="lg:w-4 lg:h-4 text-[#FFFFFF]" />
              </div>
              <div>
                <h1 className="text-base lg:text-lg font-semibold text-white font-primary heading-line-height">AI Assistant</h1>
                <p className="text-xs lg:text-sm text-[#8E8E93] font-secondary body-line-height">Powered by advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#FFFFFF] rounded-full animate-pulse"></div>
              <span className="text-xs lg:text-sm text-[#8E8E93] font-secondary">Online</span>
            </div>
          </div>
        </div>
        
        {/* Chat Thread */}
        <div className="flex-1 min-h-0">
          <ChatThread
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
