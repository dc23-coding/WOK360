-- Run this SQL in your Supabase SQL Editor to verify and fix the profiles table
-- This will create the table if missing or show if it exists

-- 1. Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'profiles'
);

-- 2. If needed, create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,  -- Changed from UUID to TEXT for Clerk user IDs
  email TEXT,
  personal_code TEXT UNIQUE,
  signup_zone TEXT,
  zone_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (in case they're conflicting)
DROP POLICY IF EXISTS "Allow public insert" ON public.profiles;
DROP POLICY IF EXISTS "Allow public select" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON public.profiles;

-- 5. Create simple policies that allow everything (for testing)
CREATE POLICY "Enable all for anon users"
  ON public.profiles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_personal_code ON public.profiles(personal_code);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 7. Grant permissions
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;

-- 8. Verify table was created
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
