import React from 'react';
import { User, Bot, Copy, Check, RotateCcw } from 'lucide-react';

const Message = ({ message, onCopy, onRegenerate, copiedMessageId }) => {
  const isUser = message.role === 'user';
  const isCopied = copiedMessageId === message.id;

  const formatContent = (content) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Handle code blocks
        if (line.startsWith('```') && line.endsWith('```')) {
          const code = line.slice(3, -3);
          return (
            <pre key={index} className="bg-[#1C1C1E] p-3 rounded-lg my-2 overflow-x-auto">
              <code className="text-[#00D09C] text-sm">{code}</code>
            </pre>
          );
        }
        
        // Handle inline code
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <span key={index}>
              {parts.map((part, partIndex) => 
                partIndex % 2 === 0 ? (
                  <span key={partIndex}>{part}</span>
                ) : (
                  <code key={partIndex} className="bg-[#1C1C1E] px-1 rounded text-[#00D09C] text-sm">
                    {part}
                  </code>
                )
              )}
              {index < content.split('\n').length - 1 && <br />}
            </span>
          );
        }
        
        return (
          <span key={index}>
            {line}
            {index < content.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl flex items-start space-x-3 ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-[#007AFF]' : 'bg-[#1C1C1E]'
          }`}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-[#007AFF]" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-[#007AFF] text-white'
              : 'bg-[#111111] text-[#E5E5E7] border border-[#1C1C1E]'
          }`}
        >
          <div className="prose prose-invert max-w-none">
            {formatContent(message.content)}
          </div>
          
          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-[#1C1C1E]">
              <button
                onClick={() => onCopy(message.content, message.id)}
                className="p-1 rounded hover:bg-[#1C1C1E] transition-colors"
                title="Copy message"
              >
                {isCopied ? (
                  <Check size={14} className="text-[#00D09C]" />
                ) : (
                  <Copy size={14} className="text-[#8E8E93]" />
                )}
              </button>
              <button
                onClick={() => onRegenerate(message.id)}
                className="p-1 rounded hover:bg-[#1C1C1E] transition-colors"
                title="Regenerate response"
              >
                <RotateCcw size={14} className="text-[#8E8E93]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
