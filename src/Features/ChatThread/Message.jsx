import React from 'react';
import { User, Copy, Check, RotateCcw } from 'lucide-react';

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
            <pre key={index} className="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto border border-gray-200">
              <code className="text-green-600 text-sm">{code}</code>
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
                  <code key={partIndex} className="bg-gray-100 px-1 rounded text-green-600 text-sm border border-gray-200">
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
        className={`max-w-3xl flex items-start space-x-2 lg:space-x-3 ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-gray-100' : 'bg-gray-100'
          }`}
        >
          {isUser ? (
            <User size={14} className="lg:w-4 lg:h-4 text-black" />
          ) : (
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg px-3 py-2 lg:px-4 lg:py-3 ${
            isUser
              ? 'bg-gray-100 text-black'
              : 'bg-white text-black border border-gray-200'
          }`}
        >
          <div className="prose prose-invert max-w-none font-secondary body-line-height">
            {message.content === 'Marvin' ? (
              <span className="text-black font-medium font-primary">{message.content}</span>
            ) : (
              formatContent(message.content)
            )}
          </div>
          
          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => onCopy(message.content, message.id)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Copy message"
              >
                {isCopied ? (
                  <Check size={14} className="text-black" />
                ) : (
                  <Copy size={14} className="text-gray-500" />
                )}
              </button>
              <button
                onClick={() => onRegenerate(message.id)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw size={14} className="text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
