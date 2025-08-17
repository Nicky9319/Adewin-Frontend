import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ChatListPane from '../ChatListPane';
import ChatThread from '../ChatThread';
import chatStartData from '../ChatThread/chat_start.json';
import chatApiData from '../ChatThread/chat_api.json';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sessionIds, setSessionIds] = useState({}); // Track session IDs for each chat

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
    
    // Remove session ID
    setSessionIds(prev => {
      const newSessionIds = { ...prev };
      delete newSessionIds[chatId];
      return newSessionIds;
    });
    
    // Select the first available chat or create a new one
    const remainingChats = chats.filter(chat => chat.id !== chatId);
    if (remainingChats.length > 0) {
      setSelectedChatId(remainingChats[0].id);
    } else {
      setSelectedChatId(null);
    }
  };

  // API call for first message
  const simulateChatStartAPI = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/prompt/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      // Fallback to hardcoded data if API fails
      return {
        session_id: chatStartData.session_id,
        extracted_keywords: chatStartData.extracted_keywords,
        questions: chatStartData.questions
      };
      throw error; // Re-throw to handle in the calling function
    }
  };

  // API call for subsequent messages
  const simulateChatAPI = async (userMessage, sessionId, conversationHistory) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      // Fallback to hardcoded data if API fails
      return {
        session_id: chatApiData.session_id,
        response: chatApiData.response,
        stage: chatApiData.stage,
        conversation_history: chatApiData.conversation_history
      };
      throw error; // Re-throw to handle in the calling function
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

    try {
      let apiResponse;
      
      // Check if this is the first message in the conversation
      const isFirstMessage = currentMessages.length === 0;
      
      if (isFirstMessage) {
        // First message - use chat_start API
        apiResponse = await simulateChatStartAPI(content);
        
        // Store session ID for this chat
        setSessionIds(prev => ({
          ...prev,
          [chatId]: apiResponse.session_id
        }));
        
        // Create assistant response from chat_start data
        const assistantMessage = {
          id: `${chatId}-${Date.now() + 1}`,
          role: 'assistant',
          content: apiResponse.questions.join('\n\n'),
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
        
      } else {
        // Subsequent messages - use chat API
        const sessionId = sessionIds[chatId];
        const conversationHistory = [...currentMessages, userMessage].map(msg => msg.content);
        
        apiResponse = await simulateChatAPI(content, sessionId, conversationHistory);
        
        // Create assistant response from chat_api data
        const assistantMessage = {
          id: `${chatId}-${Date.now() + 1}`,
          role: 'assistant',
          content: apiResponse.response,
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
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      // Fallback response
      const fallbackMessage = {
        id: `${chatId}-${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), fallbackMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessages = messages[selectedChatId] || [];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
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
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 relative transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[320px]' : 'lg:pl-0'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Left side - Sidebar Toggle Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
                title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
              >
                {isSidebarOpen ? (
                  <X size={20} className="text-black" />
                ) : (
                  <Menu size={20} className="text-black" />
                )}
              </button>
            </div>
            
            {/* Center - Adewin Title */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-semibold text-black font-primary">Adewin</h1>
            </div>
            
            {/* Right side - Account/Profile Section */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
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
