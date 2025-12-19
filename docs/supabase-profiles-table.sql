-- Profiles table for storing user personal codes and zone information
-- Run this in your Supabase SQL editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  personal_code TEXT UNIQUE NOT NULL,
  signup_zone TEXT NOT NULL,
  zone_codes TEXT[] DEFAULT ARRAY[]::TEXT[],
  admin_zones TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Service role can do anything (for server-side operations)
CREATE POLICY "Service role can do anything"
  ON public.profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create index on personal_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_personal_code 
  ON public.profiles(personal_code);

-- Create index on signup_zone for analytics
CREATE INDEX IF NOT EXISTS idx_profiles_signup_zone 
  ON public.profiles(signup_zone);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, personal_code, signup_zone)
  VALUES (
    NEW.id,
    NEW.email,
    LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'), -- Generate random 4-digit code
    COALESCE(NEW.raw_user_meta_data->>'signup_zone', 'kazmo-mansion')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Optional: Seed master admin user (replace with your admin email)
-- UPDATE public.profiles
-- SET admin_zones = ARRAY['1000', '2000', '3000', '4000', '5000', '6000']
-- WHERE email = 'your-admin-email@example.com';
