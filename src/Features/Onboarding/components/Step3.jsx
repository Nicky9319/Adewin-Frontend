import React from 'react';
import './Step3.css';

const Step3 = ({ formData, onDataChange }) => {
  const handleInputChange = (field, value) => {
    onDataChange({ [field]: value });
  };

  const handleSocialHandleChange = (platform, value) => {
    onDataChange({
      socialHandles: {
        ...formData.socialHandles,
        [platform]: value
      }
    });
  };

  const handleCheckboxChange = (field, checked) => {
    onDataChange({ [field]: checked });
  };

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
    { key: 'twitter', label: 'Twitter', placeholder: '@yourhandle' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/yourcompany' }
  ];

  return (
    <div className="step3-container">
      <div className="step-header">
        <h2>Contact & Integration</h2>
        <p>Connect your communication channels and advertising accounts</p>
      </div>

      <div className="form-group">
        <label htmlFor="whatsappNumber">WhatsApp Number</label>
        <div className="input-with-prefix">
          <span className="input-prefix">+91</span>
          <input
            type="tel"
            id="whatsappNumber"
            placeholder="98765 43210"
            value={formData.whatsappNumber}
            onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
            className="form-input"
          />
        </div>
        <small>Enter your business WhatsApp number for customer support (e.g., 98765 43210)</small>
      </div>

      <div className="form-group">
        <label>Social Media Handles</label>
        <div className="social-handles-grid">
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className="social-handle-input">
              <label htmlFor={platform.key}>{platform.label}</label>
              <input
                type="text"
                id={platform.key}
                placeholder={platform.placeholder}
                value={formData.socialHandles[platform.key]}
                onChange={(e) => handleSocialHandleChange(platform.key, e.target.value)}
                className="form-input"
              />
            </div>
          ))}
        </div>
        <small>Add your social media profiles to help customers find you</small>
      </div>

      <div className="form-group">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="connectAdAccount"
            checked={formData.connectAdAccount}
            onChange={(e) => handleCheckboxChange('connectAdAccount', e.target.checked)}
            className="checkbox-input"
          />
          <label htmlFor="connectAdAccount" className="checkbox-label">
            <div className="checkbox-custom"></div>
            <span>Connect Advertising Account</span>
          </label>
        </div>
        <small>
          Connect your Facebook Ads, Google Ads, or other advertising accounts 
          to enable advanced campaign management features
        </small>
      </div>

      {formData.connectAdAccount && (
        <div className="ad-account-info">
          <div className="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <span>
              You'll be able to connect your advertising accounts after completing the setup. 
              This will allow you to manage campaigns, track performance, and optimize your ads 
              directly from the AdWein platform.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
