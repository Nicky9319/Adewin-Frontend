import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import ChatListPane from '../ChatListPane';
import ChatThread from '../ChatThread';

const Chat = () => {
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
    }
  ]);
  
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [messages, setMessages] = useState({
    '1': [
      {
        id: '1-1',
        role: 'assistant',
        content: 'Hello! I\'m here to help you with any questions you might have. How can I assist you today?',
        timestamp: new Date().toISOString()
      }
    ],
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
      <ChatListPane
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-[#111111] border-b border-[#1C1C1E] px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
                <p className="text-sm text-[#8E8E93]">Powered by advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00D09C] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#8E8E93]">Online</span>
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
