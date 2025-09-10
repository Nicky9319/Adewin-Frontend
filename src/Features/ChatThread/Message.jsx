import React from 'react';
import { User, Copy, Check, RotateCcw, Play, Edit3, X } from 'lucide-react';

const Message = ({ message, onCopy, onRegenerate, copiedMessageId, showLaunchCampaign, onLaunchCampaign }) => {
  const isUser = message.role === 'user';
  const isCopied = copiedMessageId === message.id;
  const [isCampaignRunning, setIsCampaignRunning] = React.useState(false);
  
  // Editable fields state
  const [editableFields, setEditableFields] = React.useState({
    heading: 'Freedom from Skin Worries',
    primaryText: 'Celebrate Independence Day with glowing, worry-free skin',
    budget: '₹3,500',
    days: '7 days'
  });
  const [isEditing, setIsEditing] = React.useState(false);

  const handleLaunchCampaign = () => {
    setIsCampaignRunning(true);
    if (onLaunchCampaign) {
      onLaunchCampaign();
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveAll = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values if needed
    setEditableFields({
      heading: 'Freedom from Skin Worries',
      primaryText: 'Celebrate Independence Day with glowing, worry-free skin',
      budget: '₹3,500',
      days: '7 days'
    });
  };

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
          className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-gray-100 rounded-full' : ''
          }`}
        >
          {isUser ? (
            <User size={14} className="lg:w-4 lg:h-4 text-black" />
          ) : (
            <img 
              src="/logo.PNG" 
              alt="Adewin Logo" 
              className="w-6 h-6 lg:w-8 lg:h-8 object-cover"
            />
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
          
          {/* Display image if present */}
          {message.image && (
            <div className="mt-3">
              <img 
                src={message.image} 
                alt="Shared image" 
                className="max-w-full h-auto rounded-lg border border-gray-200"
                style={{ maxHeight: '400px' }}
              />
              
              {/* Advertisement Structure */}
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                {/* Edit Button */}
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Campaign Details</span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveAll}
                          className="p-2 text-black hover:text-gray-700 rounded-full transition-colors"
                          title="Save all changes"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-black hover:text-gray-700 rounded-full transition-colors"
                          title="Cancel changes"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleToggleEdit}
                        className="p-2 text-black hover:text-gray-700 rounded-full transition-colors"
                        title="Edit campaign details"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Ad Text and Call to Action Section */}
                <div className="p-4 border-b border-gray-200">
                  <div className="mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableFields.heading}
                        onChange={(e) => setEditableFields(prev => ({ ...prev, heading: e.target.value }))}
                        className="text-lg font-bold text-black bg-transparent border-b border-blue-500 focus:outline-none w-full"
                        placeholder="Enter campaign heading"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-black">{editableFields.heading}</h3>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableFields.primaryText}
                        onChange={(e) => setEditableFields(prev => ({ ...prev, primaryText: e.target.value }))}
                        className="text-sm text-gray-700 bg-transparent border-b border-blue-500 focus:outline-none w-full"
                        placeholder="Enter campaign description"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{editableFields.primaryText}</p>
                    )}
                  </div>
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors">
                    Book Appointment 
                  </button>
                </div>
                
                {/* Campaign Details Section */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* First Row */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableFields.budget}
                          onChange={(e) => setEditableFields(prev => ({ ...prev, budget: e.target.value }))}
                          className="text-sm font-medium text-black bg-transparent border-b border-blue-500 focus:outline-none text-center w-20"
                          placeholder="₹0"
                        />
                      ) : (
                        <p className="text-sm font-medium text-black">{editableFields.budget}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Days</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableFields.days}
                          onChange={(e) => setEditableFields(prev => ({ ...prev, days: e.target.value }))}
                          className="text-sm font-medium text-black bg-transparent border-b border-blue-500 focus:outline-none text-center w-20"
                          placeholder="0 days"
                        />
                      ) : (
                        <p className="text-sm font-medium text-black">{editableFields.days}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Reach</p>
                      <p className="text-sm font-medium text-black">12,000 - 15,000</p>
                    </div>
                    
                    {/* Second Row */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Recommended by</p>
                      <p className="text-sm font-medium text-black">Adewin</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Platforms</p>
                      <p className="text-sm font-medium text-black">Facebook + Instagram</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-medium text-black">Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
              
              {/* Launch Campaign Button */}
              {showLaunchCampaign && onLaunchCampaign && !isCampaignRunning && (
                <button
                  onClick={handleLaunchCampaign}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out text-white text-sm font-medium"
                  title="Launch Campaign"
                >
                  Launch Campaign
                </button>
              )}
              
              {/* Running Indicator */}
              {isCampaignRunning && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Running</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
