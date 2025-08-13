import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import Message from './Message';

const ChatThread = ({ messages = [], onSendMessage, isLoading = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
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

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0056CC] flex items-center justify-center shadow-lg">
                <Bot size={40} className="text-white" />
              </div>
              <h3 className="text-4xl font-bold text-[#007AFF] mb-4">
                Adewin
              </h3>
              <p className="text-[#E5E5E7] text-lg">
                How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={copyToClipboard}
              onRegenerate={handleRegenerate}
              copiedMessageId={copiedMessageId}
            />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-[#007AFF]" />
              </div>
              <div className="bg-[#111111] rounded-lg px-4 py-3 border border-[#1C1C1E]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-[#1C1C1E] p-4 bg-[#111111] flex-shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message AI Assistant... (Press Enter to send, Shift+Enter for new line)"
              className="w-full p-3 pr-12 rounded-lg bg-[#1C1C1E] border border-[#2D2D2F] text-[#E5E5E7] placeholder-[#8E8E93] resize-none focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] focus:ring-opacity-20 transition-all duration-200"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 p-1.5 rounded-md bg-[#007AFF] hover:bg-[#0056CC] disabled:bg-[#2D2D2F] disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <div className="flex items-center justify-end mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00D09C] rounded-full"></div>
              <span className="text-xs text-[#8E8E93]">AI Assistant is ready</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatThread;
