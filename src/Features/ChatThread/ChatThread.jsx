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
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0056CC] flex items-center justify-center shadow-lg">
                <Bot size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Welcome to AI Chat!
              </h3>
              <p className="text-[#E5E5E7] text-lg mb-6 leading-relaxed">
                I'm your AI assistant, ready to help you with any questions, coding problems, or creative tasks.
              </p>
              <div className="bg-[#111111] rounded-lg p-4 border border-[#1C1C1E]">
                <p className="text-[#8E8E93] text-sm mb-3">Try asking me about:</p>
                <ul className="text-[#E5E5E7] text-sm space-y-2">
                  <li>• "Help me write a React component"</li>
                  <li>• "Explain how to use Tailwind CSS"</li>
                  <li>• "Debug this JavaScript code"</li>
                  <li>• "Create a simple API endpoint"</li>
                </ul>
              </div>
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
      <div className="border-t border-[#1C1C1E] p-6 bg-[#111111] flex-shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message AI Assistant..."
              className="w-full p-4 pr-12 rounded-xl bg-[#1C1C1E] border border-[#2D2D2F] text-[#E5E5E7] placeholder-[#8E8E93] resize-none focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF] focus:ring-opacity-20 transition-all duration-200 shadow-lg"
              rows="1"
              style={{ minHeight: '56px', maxHeight: '200px' }}
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
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-[#007AFF] hover:bg-[#0056CC] disabled:bg-[#2D2D2F] disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#8E8E93]">
              Press Enter to send, Shift+Enter for new line
            </p>
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
