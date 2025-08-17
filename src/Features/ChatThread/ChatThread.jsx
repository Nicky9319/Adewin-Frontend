import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, MicOff } from 'lucide-react';
import Message from './Message';

const ChatThread = ({ messages = [], onSendMessage, isLoading = false }) => {
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

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-3 lg:p-4 space-y-4 lg:space-y-6 min-h-0 transition-all duration-500 ease-in-out ${hasMessages ? 'block opacity-100' : 'hidden opacity-0'}`}>
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
              <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-[#007AFF] rounded-full"></div>
              </div>
              <div className="bg-black rounded-lg px-4 py-3 border border-[#1C1C1E]">
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

      {/* Welcome Screen (when no messages) */}
      {!hasMessages && (
        <div className="flex-1 flex items-end justify-center px-4 pb-12">
          <div className="text-center max-w-2xl w-full">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-1 font-primary heading-line-height">
              Hello, Marvin
            </h3>
          </div>
        </div>
      )}

      {/* Input Container - Single component that adapts */}
      <div className={`${hasMessages ? 'p-3 lg:p-4' : 'flex-1 flex items-center justify-center px-4'} bg-black flex-shrink-0 transition-all duration-700 ease-in-out`}>
        <form onSubmit={handleSubmit} className={`${hasMessages ? 'max-w-4xl mx-auto' : 'w-full max-w-2xl'} transition-all duration-700 ease-in-out`}>
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message Marvin... (Press Enter to send, Shift+Enter for new line)"
              className={`w-full ${hasMessages ? 'p-3' : 'p-4'} pr-28 lg:pr-32 rounded-2xl bg-[#1C1C1E] border border-[#2D2D2F] text-[#E5E5E7] placeholder-[#8E8E93] resize-none focus:outline-none focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF] focus:ring-opacity-20 transition-all duration-700 ease-in-out font-secondary body-line-height text-sm lg:text-base shadow-lg`}
              rows="1"
              style={{ minHeight: hasMessages ? '50px' : '60px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Action Buttons */}
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              {/* Image Upload Button */}
              <button
                type="button"
                onClick={handleImageUpload}
                className="p-1.5 rounded-lg hover:bg-[#2D2D2F] transition-all duration-300 ease-in-out"
                title="Upload Image"
              >
                <Image size={16} className="text-[#8E8E93] hover:text-[#FFFFFF]" />
              </button>
              
              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={handleVoiceRecording}
                className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out ${
                  isRecording 
                    ? 'bg-[#1C1C1E]' 
                    : 'hover:bg-[#2D2D2F]'
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? (
                  <MicOff size={16} className="text-[#FFFFFF]" />
                ) : (
                  <Mic size={16} className="text-[#8E8E93] hover:text-[#FFFFFF]" />
                )}
              </button>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-1.5 rounded-lg bg-[#1C1C1E] hover:bg-[#2D2D2F] disabled:bg-[#2D2D2F] disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
              >
                <Send size={16} className="text-[#FFFFFF]" />
              </button>
            </div>
          </div>
          
          {/* Status indicator - only show in centered mode */}
          {!hasMessages && (
            <div className="flex items-center justify-end mt-2 transition-all duration-700 ease-in-out">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full"></div>
                <span className="text-xs text-[#8E8E93] font-secondary">Marvin is ready</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatThread;
