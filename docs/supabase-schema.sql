-- Supabase SQL Schema for Ask Cle Conversations
-- Run this SQL in your Supabase dashboard to set up the table

CREATE TABLE ask_cle_conversations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX idx_ask_cle_user_id ON ask_cle_conversations(user_id);

-- Create index for ordering by creation time
CREATE INDEX idx_ask_cle_created_at ON ask_cle_conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ask_cle_conversations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own conversations
CREATE POLICY "Users can view their own conversations"
  ON ask_cle_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY "Users can insert their own conversations"
  ON ask_cle_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Optional: Grant public access to service role for server-side operations
CREATE POLICY "Service role can manage all conversations"
  ON ask_cle_conversations
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
