import React from 'react';
import './Step1.css';

const Step1 = ({ formData, onDataChange }) => {
  const handleInputChange = (field, value) => {
    onDataChange({ [field]: value });
  };

  const categories = [
    'E-commerce',
    'SaaS',
    'Healthcare',
    'Education',
    'Finance',
    'Real Estate',
    'Food & Beverage',
    'Fashion & Beauty',
    'Technology',
    'Entertainment',
    'Travel',
    'Other'
  ];

  return (
    <div className="step1-container">
      <div className="step-header">
        <h2>Basic Information</h2>
        <p>Tell us about your business</p>
      </div>

      <div className="form-group">
        <label htmlFor="website">Website URL</label>
        <input
          type="url"
          id="website"
          placeholder="https://yourwebsite.com"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="form-input"
        />
        <small>Enter your main website URL</small>
      </div>

      <div className="form-group">
        <label htmlFor="category">Business Category</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="form-select"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <small>Choose the category that best describes your business</small>
      </div>

      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          id="companyName"
          placeholder="Your Company Name"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className="form-input"
        />
        <small>Enter your official company or business name</small>
      </div>
    </div>
  );
};

export default Step1;
