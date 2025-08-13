import React, { useState, useEffect } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import ChatListPane from '../ChatListPane';
import ChatThread from '../ChatThread';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState([
    {
      id: '1',
      title: 'General Questions',
      lastMessage: 'How can I help you with React development?',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Code Review',
      lastMessage: 'Let me review your JavaScript code...',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      title: 'API Integration',
      lastMessage: 'Here\'s how to integrate the REST API...',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '4',
      title: 'Database Design',
      lastMessage: 'For your use case, I recommend...',
      timestamp: new Date(Date.now() - 10800000).toISOString()
    },
    {
      id: '5',
      title: 'UI/UX Discussion',
      lastMessage: 'The user experience should focus on...',
      timestamp: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: '6',
      title: 'Performance Optimization',
      lastMessage: 'To improve performance, consider...',
      timestamp: new Date(Date.now() - 18000000).toISOString()
    }
  ]);
  
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [messages, setMessages] = useState({
    '1': [],
    '2': [
      {
        id: '2-1',
        role: 'user',
        content: 'Can you review this JavaScript code?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2-2',
        role: 'assistant',
        content: 'I\'d be happy to review your JavaScript code! Please share the code you\'d like me to look at.',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  });
  
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
      handleNewChat();
    }
  };

  const handleSendMessage = async (content) => {
    const currentMessages = messages[selectedChatId] || [];
    const userMessage = {
      id: `${selectedChatId}-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...currentMessages, userMessage]
    }));

    // Update chat title and last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: content, timestamp: new Date().toISOString() }
        : chat
    ));

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: `${selectedChatId}-${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), assistantMessage]
      }));

      // Update last message
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, lastMessage: assistantMessage.content.substring(0, 50) + '...' }
          : chat
      ));

      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateAIResponse = (userMessage) => {
    const responses = [
      "That's an interesting question! Let me help you with that.",
      "I understand what you're asking. Here's what I can tell you...",
      "Great question! Based on my knowledge, here's what I think...",
      "I'd be happy to help you with that. Let me break it down...",
      "That's a good point. Here's my perspective on this...",
      "I can definitely assist you with that. Here's what you should know...",
      "Thanks for asking! Here's what I found about that topic...",
      "I'm glad you brought that up. Let me explain...",
      "That's a common question. Here's what I recommend...",
      "I can help you with that! Here's my advice..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " This is a simulated response. In a real application, this would be connected to an AI service like OpenAI's API.";
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
