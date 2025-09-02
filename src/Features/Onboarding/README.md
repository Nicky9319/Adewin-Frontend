# Onboarding Feature

A comprehensive 3-step onboarding flow for new AdWein users to set up their business profile and preferences.

## Features

- **3-Step Process**: Guided setup with progress tracking
- **Progress Bar**: Visual indication of completion status
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Input validation and error handling
- **Modern UI**: Beautiful gradient design with glassmorphism effects

## Components

### Main Components

- `Onboarding.jsx` - Main container component with step management
- `Step1.jsx` - Basic business information (website, category, company name)
- `Step2.jsx` - Brand identity (logo, colors, tone)
- `Step3.jsx` - Contact & integration (WhatsApp, social handles, ad accounts)

### Step 1: Basic Information
- Website URL input
- Business category selection
- Company name input

### Step 2: Brand Identity
- Logo upload with preview
- Brand color picker (primary, secondary, accent)
- Brand tone selection

### Step 3: Contact & Integration
- WhatsApp number with country code prefix
- Social media handles (Facebook, Instagram, Twitter, LinkedIn)
- Advertising account connection option

## Usage

```jsx
import Onboarding from './Features/Onboarding';

function App() {
  return (
    <div className="App">
      <Onboarding />
    </div>
  );
}
```

## Props

The Onboarding component manages its own state internally, but you can extend it to accept:

- `onComplete` - Callback function when onboarding is finished
- `initialData` - Pre-filled data for editing existing profiles
- `onStepChange` - Callback when user moves between steps

## Styling

The component uses CSS modules with:
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts
- Custom form controls

## Data Structure

The form data is structured as:

```javascript
{
  // Step 1
  website: string,
  category: string,
  companyName: string,
  
  // Step 2
  logo: string | null, // base64 image data
  brandColors: {
    primary: string,
    secondary: string,
    accent: string
  },
  tone: string,
  
  // Step 3
  whatsappNumber: string,
  socialHandles: {
    facebook: string,
    instagram: string,
    twitter: string,
    linkedin: string
  },
  connectAdAccount: boolean
}
```

## Future Enhancements

- Form validation and error messages
- Data persistence between steps
- Integration with backend APIs
- Custom step validation rules
- Multi-language support
- Accessibility improvements
