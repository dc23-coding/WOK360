# Ask Cle Assistant Setup Guide

## Overview
"Ask Cle" is an AI-powered assistant available in the Dark Bedroom and Dark Playroom. It uses OpenAI's GPT-4o-mini model to provide navigation help, storytelling, feature explanations, and personalized recommendations.

## Features
- 💬 Floating avatar bubble in dark wing rooms
- 🤖 Powered by OpenAI (gpt-4o-mini)
- 💾 Conversation memory stored in Supabase
- 🎯 Smart context awareness about the app
- 📱 Fully responsive modal chat interface
- ✨ Smooth animations and real-time responses

## Setup Instructions

### 1. Environment Variables
Add these to your `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_api_key
SUPABASE_SERVICE_KEY=your_service_key
```

### 2. Supabase Database Setup
1. Go to your Supabase dashboard
2. Open SQL Editor
3. Run the SQL from `docs/supabase-schema.sql`
4. This creates the `ask_cle_conversations` table with proper RLS policies

### 3. OpenAI Setup
1. Sign up at [openai.com](https://openai.com)
2. Create an API key
3. Set your `OPENAI_API_KEY` in environment variables
4. Set usage limits to avoid unexpected charges

### 4. Backend API Routes
Deploy these API routes to your backend (examples for Next.js):

**`pages/api/ask-cle.js`** - Handles OpenAI requests
- Accepts POST with `message`, `userId`, `conversationHistory`
- Returns AI response from GPT-4o-mini
- Handles errors gracefully

**`pages/api/store-conversation.js`** - Stores conversations in Supabase
- Accepts POST with user message and assistant response
- Saves to `ask_cle_conversations` table
- Respects user authentication

### 5. Component Integration
The `AskCleAssistant` component is already added to:
- `src/sections/DarkBedroom.jsx`
- `src/sections/DarkPlayroom.jsx`

It's ready to use out of the box!

## Usage

### For Users
1. In any dark wing room (Dark Bedroom or Dark Playroom)
2. Click the floating "💬" bubble in the bottom-right corner
3. Type a question or message
4. Get instant responses from Cle

### Example Conversations
- "How do I navigate to the music room?"
- "Tell me a story about the World of Karma"
- "What features are available in the light wing?"
- "Can you recommend what I should explore first?"

## API Response Format

### Ask Cle Request
```json
{
  "message": "Tell me about this room",
  "userId": "user-uuid",
  "conversationHistory": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}
```

### Ask Cle Response
```json
{
  "reply": "This is a response from Cle..."
}
```

### Store Conversation Request
```json
{
  "userId": "user-uuid",
  "userMessage": "What is this?",
  "assistantMessage": "This is...",
  "timestamp": "2025-12-10T12:00:00Z"
}
```

## Customization

### Changing the Greeting
Edit `AskCleAssistant.jsx` line ~42-48:
```jsx
setMessages([
  {
    id: 1,
    role: "assistant",
    content: "Your custom greeting here",
    timestamp: new Date(),
  },
]);
```

### Customizing Cle's Personality
Edit the `systemPrompt` in `server/api/ask-cle.js` (lines ~24-37) to change how Cle responds.

### Adding to Light Wing
To add Ask Cle to light wing rooms, import and add:
```jsx
import AskCleAssistant from "../components/AskCleAssistant";

// In your component's return:
<AskCleAssistant />
```

Then change the bubble color in `AskCleAssistant.jsx` from cyan to amber for light theme.

## Troubleshooting

### "Failed to get response"
- Check OpenAI API key is valid
- Verify API has usage budget remaining
- Check browser console for detailed errors

### Messages not storing
- Verify Supabase table exists (run schema SQL)
- Check `SUPABASE_SERVICE_KEY` is set correctly
- Verify RLS policies are in place

### Chat window not opening
- Check browser console for errors
- Verify Framer Motion is installed
- Ensure z-index doesn't conflict with other modals

## Security Considerations

1. **API Keys**: Never expose `OPENAI_API_KEY` in frontend code
2. **Supabase RLS**: Row Level Security ensures users only access their own conversations
3. **Rate Limiting**: Consider adding rate limits on backend to prevent abuse
4. **Content Moderation**: Implement moderation if needed

## Future Enhancements

- [ ] Voice input/output
- [ ] Conversation history sidebar
- [ ] Sentiment analysis
- [ ] User preferences and personality adjustments
- [ ] Integration with search/discovery features
- [ ] Conversation export/download
- [ ] Multi-language support

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Test API endpoints independently
4. Check OpenAI and Supabase dashboards for errors
