import React, { useState, useEffect } from 'react';
import ChatListPane from '../ChatListPane';
import ChatThread from '../ChatThread';
import chatStartData from '../ChatThread/chat_start.json';
import chatApiData from '../ChatThread/chat_api.json';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sessionIds, setSessionIds] = useState({}); // Track session IDs for each chat



  const handleNewChat = () => {
    // Create a temporary chat that doesn't get added to chat history
    const tempChatId = 'temp-chat';
    
    // Clear any existing temporary chat messages
    setMessages(prev => ({
      ...prev,
      [tempChatId]: []
    }));
    
    // Deselect any existing chat to show the temporary chat
    setSelectedChatId(null);
  };

  const handleLaunchCampaign = () => {
    // Create a new chat with the current conversation
    const newChatId = Date.now().toString();
    const currentMessages = messages['temp-chat'] || [];
    
    // Get the first message content for the title
    const firstMessage = currentMessages[0]?.content || 'New Campaign';
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    
    const newChat = {
      id: newChatId,
      title: title,
      lastMessage: currentMessages[currentMessages.length - 1]?.content || 'No messages yet',
      timestamp: new Date().toISOString()
    };
    
    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newChatId]: [...currentMessages] // Copy current messages to new chat
    }));
    
    // Keep the current conversation visible by selecting the new chat
    setSelectedChatId(newChatId);
    
    // Clear the temporary chat
    setMessages(prev => ({
      ...prev,
      'temp-chat': []
    }));
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
    
    // If no chat is selected, use a temporary chat for communication
    if (!chatId) {
      chatId = 'temp-chat';
      if (!messages[chatId]) {
        setMessages(prev => ({
          ...prev,
          [chatId]: []
        }));
      }
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

    // Only update chat title and last message if this is a real chat (not temp)
    if (chatId !== 'temp-chat') {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: content, timestamp: new Date().toISOString() }
          : chat
      ));
    }

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
        
        // Only update last message if this is a real chat (not temp)
        if (chatId !== 'temp-chat') {
          setChats(prev => prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, lastMessage: assistantMessage.content.substring(0, 50) + '...' }
              : chat
          ));
        }
        
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
        
        // Only update last message if this is a real chat (not temp)
        if (chatId !== 'temp-chat') {
          setChats(prev => prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, lastMessage: assistantMessage.content.substring(0, 50) + '...' }
              : chat
          ));
        }
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

  const currentMessages = selectedChatId ? (messages[selectedChatId] || []) : (messages['temp-chat'] || []);

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      
      {/* Chat List Pane - always show when chats exist */}
      {chats.length > 0 && (
        <div className="h-full flex-shrink-0">
          <ChatListPane
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={setSelectedChatId}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Center - Adewin Title */}
            <div className="flex justify-center w-full">
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
            hasChatHistory={chats.length > 0}
            isTemporaryChat={!selectedChatId}
            onLaunchCampaign={handleLaunchCampaign}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
