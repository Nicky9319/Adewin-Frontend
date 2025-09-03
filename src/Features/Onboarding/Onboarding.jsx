import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import { useOnboarding } from '../../OnboardingContext.jsx';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    website: '',
    category: '',
    companyName: '',
    
    // Step 2
    logo: null,
    brandColors: {
      primary: '#FFFFFF',
      secondary: '#EC4899',
      accent: '#FF0000'
    },
    tone: '',
    
    // Step 3
    whatsappNumber: '',
    socialHandles: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    connectAdAccount: false
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Basic validation before proceeding
      if (currentStep === 1) {
        if (!formData.website || !formData.category || !formData.companyName) {
          alert('Please fill in all required fields before proceeding.');
          return;
        }
      } else if (currentStep === 2) {
        if (!formData.tone) {
          alert('Please select a brand tone before proceeding.');
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    console.log('Onboarding completed:', formData);
    setIsSubmitting(true);
    
    // Simulate a brief loading state
    setTimeout(() => {
      // Complete onboarding and redirect to main app
      completeOnboarding(formData);
      navigate('/chat');
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} onDataChange={handleFormDataChange} />;
      case 2:
        return <Step2 formData={formData} onDataChange={handleFormDataChange} />;
      case 3:
        return <Step3 formData={formData} onDataChange={handleFormDataChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Welcome to AdWein</h1>
        <p>Let's set up your account in just a few steps</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-content">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn btn-success" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Setting up...' : 'Complete Setup'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
