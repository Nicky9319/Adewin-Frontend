# Chat Application Components

This directory contains the chat application components built with React and Tailwind CSS, following a ChatGPT-like interface design.

## Components Structure

```
Features/
├── Chat/                    # Main chat application
│   ├── Chat.jsx            # Main chat component with state management
│   └── index.js            # Export file
├── ChatListPane/           # Left sidebar with chat list
│   ├── ChatListPane.jsx    # Chat list component
│   └── index.js            # Export file
├── ChatThread/             # Main chat interface
│   ├── ChatThread.jsx      # Chat thread component
│   ├── Message.jsx         # Individual message component
│   └── index.js            # Export file
└── README.md               # This file
```

## Features

### ChatListPane
- **Chat List**: Displays all conversations with titles and last messages
- **New Chat**: Button to create new conversations
- **Chat Selection**: Click to switch between chats
- **Delete Chat**: Remove conversations (with confirmation)
- **User Profile**: User information in the footer
- **Collapsible**: Can be collapsed to save space

### ChatThread
- **Message Display**: Shows conversation messages with user/assistant avatars
- **Message Actions**: Copy and regenerate buttons for assistant messages
- **Input Area**: Text area for typing messages with send button
- **Loading States**: Animated loading indicator while waiting for responses
- **Auto-scroll**: Automatically scrolls to the latest message
- **Markdown Support**: Basic markdown formatting for code blocks and inline code

### Message Component
- **Avatar Display**: Different avatars for user and assistant
- **Message Formatting**: Support for code blocks and inline code
- **Action Buttons**: Copy and regenerate functionality
- **Responsive Design**: Adapts to different screen sizes

## Color Palette

The application uses a dark theme with the following color scheme:

- **Primary Background**: #000000 (Pure Black)
- **Secondary Background**: #111111 (Dark Gray)
- **Surface Background**: #1C1C1E (Medium Gray)
- **Primary Blue**: #007AFF (Apple Blue)
- **Success Green**: #00D09C (Donna Green)
- **Primary Text**: #FFFFFF (Pure White)
- **Secondary Text**: #E5E5E7 (Light Gray)
- **Muted Text**: #8E8E93 (Medium Gray)

## Usage

To use the chat application, navigate to `/chat` in your application:

```jsx
import Chat from './Features/Chat';

// In your router
<Route path="/chat" element={<Chat />} />
```

## State Management

The Chat component manages the following state:
- `chats`: Array of chat objects with id, title, lastMessage, and timestamp
- `selectedChatId`: Currently selected chat ID
- `messages`: Object mapping chat IDs to their message arrays
- `isLoading`: Boolean indicating if a response is being generated

## Future Enhancements

- **Real AI Integration**: Connect to OpenAI API or similar services
- **Message Persistence**: Save chats to localStorage or database
- **File Upload**: Support for image and document uploads
- **Voice Input**: Speech-to-text functionality
- **Export Chats**: Download conversation history
- **Search**: Search through chat history
- **Themes**: Light/dark theme toggle
- **Keyboard Shortcuts**: Hotkeys for common actions
