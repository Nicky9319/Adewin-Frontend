import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);

  // Check if onboarding was completed on app load
  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    const data = localStorage.getItem('onboardingData');
    
    if (completed === 'true' && data) {
      setIsOnboardingCompleted(true);
      setOnboardingData(JSON.parse(data));
    }
  }, []);

  const completeOnboarding = (data) => {
    setIsOnboardingCompleted(true);
    setOnboardingData(data);
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(data));
  };

  const resetOnboarding = () => {
    setIsOnboardingCompleted(false);
    setOnboardingData(null);
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingData');
  };

  return (
    <OnboardingContext.Provider value={{
      isOnboardingCompleted,
      onboardingData,
      completeOnboarding,
      resetOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};
