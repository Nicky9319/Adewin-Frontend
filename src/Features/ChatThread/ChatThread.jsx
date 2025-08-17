import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, MicOff, Play } from 'lucide-react';
import Message from './Message';

const ChatThread = ({ messages = [], onSendMessage, isLoading = false, hasChatHistory = false, onLaunchCampaign }) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRegenerate = (messageId) => {
    // This would typically trigger a regeneration of the AI response
    console.log('Regenerate message:', messageId);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Image uploaded:', file.name);
        // Handle image upload logic here
      }
    };
    input.click();
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic
      console.log('Started voice recording');
    } else {
      // Stop recording logic
      console.log('Stopped voice recording');
    }
  };

  const handleLaunchCampaign = () => {
    if (onLaunchCampaign) {
      onLaunchCampaign();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-0 transition-all duration-500 ease-in-out ${hasMessages ? 'block opacity-100' : 'hidden opacity-0'}`}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onCopy={copyToClipboard}
            onRegenerate={handleRegenerate}
            copiedMessageId={copiedMessageId}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Welcome Screen (when no messages) */}
      {!hasMessages && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl w-full">
            <h3 className="text-5xl lg:text-6xl font-bold text-black mb-1 font-primary">
              Hello, Adewin
            </h3>
          </div>
        </div>
      )}

      {/* Input Container - always show */}
      <div className="p-4 bg-white flex-shrink-0 transition-all duration-700 ease-in-out">
        {/* Suggested Actions - only show when no messages */}
        {!hasMessages && (
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setInputValue("Help me sales")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Help me sales
            </button>
            <button
              type="button"
              onClick={() => setInputValue("Help me views")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Help me views
            </button>
            <button
              type="button"
              onClick={() => setInputValue("Help me leads")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Help me leads
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto transition-all duration-700 ease-in-out">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Adewin..."
              className="w-full p-4 pr-28 rounded-2xl bg-gray-50 border border-gray-300 text-black placeholder-gray-500 resize-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:ring-opacity-20 transition-all duration-700 ease-in-out font-secondary text-base shadow-lg"
              rows="1"
              style={{ minHeight: '60px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Action Buttons */}
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              {/* Launch Campaign Button - only show when no chat history */}
              {!hasChatHistory && (
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out text-white"
                  title="Launch Campaign"
                >
                  <Play size={16} />
                </button>
              )}
              
              {/* Image Upload Button */}
              <button
                type="button"
                onClick={handleImageUpload}
                className="p-1.5 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
                title="Upload Image"
              >
                <Image size={16} className="text-gray-500 hover:text-black" />
              </button>
              
              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={handleVoiceRecording}
                className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out ${
                  isRecording 
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-200'
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? (
                  <MicOff size={16} className="text-black" />
                ) : (
                  <Mic size={16} className="text-gray-500 hover:text-black" />
                )}
              </button>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
              >
                <Send size={16} className="text-black" />
              </button>
            </div>
          </div>
          
          {/* Status indicator - only show when no messages */}
          {!hasMessages && (
            <div className="flex items-center justify-end mt-2 transition-all duration-700 ease-in-out">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <span className="text-xs text-gray-500 font-secondary">Adewin is ready</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatThread;
