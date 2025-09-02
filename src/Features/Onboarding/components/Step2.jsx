import React from 'react';
import './Step2.css';

const Step2 = ({ formData, onDataChange }) => {
  const handleInputChange = (field, value) => {
    onDataChange({ [field]: value });
  };

  const handleColorChange = (colorType, value) => {
    onDataChange({
      brandColors: {
        ...formData.brandColors,
        [colorType]: value
      }
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onDataChange({ logo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const tones = [
    'Professional',
    'Friendly',
    'Casual',
    'Luxury',
    'Playful',
    'Serious',
    'Innovative',
    'Traditional',
    'Modern',
    'Vintage'
  ];

  return (
    <div className="step2-container">
      <div className="step-header">
        <h2>Brand Identity</h2>
        <p>Customize your brand appearance and voice</p>
      </div>

      <div className="form-group">
        <label htmlFor="logo">Company Logo</label>
        <div className="logo-upload-container">
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoUpload}
            className="logo-input"
          />
          <label htmlFor="logo" className="logo-upload-label">
            {formData.logo ? (
              <div className="logo-preview">
                <img src={formData.logo} alt="Logo preview" />
                <span>Change Logo</span>
              </div>
            ) : (
              <div className="logo-upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Upload Logo</span>
                <small>PNG, JPG up to 5MB</small>
              </div>
            )}
          </label>
        </div>
        <small>Upload your company logo (recommended: 200x200px)</small>
      </div>

      <div className="form-group">
        <label>Brand Colors</label>
        <div className="color-inputs">
          <div className="color-input">
            <label htmlFor="primaryColor">Primary</label>
            <input
              type="color"
              id="primaryColor"
              value={formData.brandColors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="color-input">
            <label htmlFor="secondaryColor">Secondary</label>
            <input
              type="color"
              id="secondaryColor"
              value={formData.brandColors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="color-input">
            <label htmlFor="accentColor">Accent</label>
            <input
              type="color"
              id="accentColor"
              value={formData.brandColors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="color-picker"
            />
          </div>
        </div>
        <small>Choose your brand color palette</small>
      </div>

      <div className="form-group">
        <label htmlFor="tone">Brand Tone</label>
        <select
          id="tone"
          value={formData.tone}
          onChange={(e) => handleInputChange('tone', e.target.value)}
          className="form-select"
        >
          <option value="">Select brand tone</option>
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
        <small>Choose the tone that best represents your brand voice</small>
      </div>
    </div>
  );
};

export default Step2;
