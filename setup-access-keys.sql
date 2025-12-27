-- Access Keys System for WOK360
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/wazrqqxpqbqpsbgyvcbg/sql

-- Main access keys table
CREATE TABLE IF NOT EXISTS access_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(4) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Zone access permissions (array of zone IDs)
  access_zones JSONB DEFAULT '["kazmo-mansion", "club-hollywood"]'::jsonb,
  
  -- Access level: 'user', 'premium', 'admin'
  access_level TEXT DEFAULT 'user',
  
  -- User preferences and metadata
  preferences JSONB DEFAULT '{}'::jsonb
);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  zone_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_access_keys_code ON access_keys(code);
CREATE INDEX IF NOT EXISTS idx_access_keys_email ON access_keys(email);
CREATE INDEX IF NOT EXISTS idx_access_keys_is_active ON access_keys(is_active);

-- Function to generate unique 4-digit code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS VARCHAR(4) AS $$
DECLARE
  new_code VARCHAR(4);
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 4-digit code between 1000-1999 (Kazmo Mansion range)
    new_code := (1000 + FLOOR(RANDOM() * 1000))::TEXT;
    
    -- Don't allow master key as user code
    IF new_code = '3104' THEN
      CONTINUE;
    END IF;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM access_keys WHERE code = new_code) INTO code_exists;
    
    -- If code doesn't exist, return it
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create new user with access key
CREATE OR REPLACE FUNCTION create_access_key(
  p_name TEXT,
  p_email TEXT,
  p_zones JSONB DEFAULT '["kazmo-mansion"]'::jsonb
)
RETURNS TABLE(
  code VARCHAR(4),
  user_id UUID,
  name TEXT,
  email TEXT
) AS $$
DECLARE
  new_code VARCHAR(4);
  new_user_id UUID;
BEGIN
  -- Generate unique code
  new_code := generate_access_code();
  
  -- Insert new user
  INSERT INTO access_keys (code, name, email, access_zones)
  VALUES (new_code, p_name, p_email, p_zones)
  RETURNING id INTO new_user_id;
  
  -- Return user info
  RETURN QUERY
  SELECT new_code, new_user_id, p_name, p_email;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read access_keys (for code lookup)
CREATE POLICY "Allow anonymous read access_keys"
  ON access_keys FOR SELECT
  USING (true);

-- Allow anonymous users to update last_used timestamp
CREATE POLICY "Allow anonymous update last_used"
  ON access_keys FOR UPDATE
  USING (true);

-- Allow anonymous users to insert new keys via function
CREATE POLICY "Allow anonymous insert via function"
  ON access_keys FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to insert activity logs
CREATE POLICY "Allow anonymous insert user_activity"
  ON user_activity FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to read activity (optional)
CREATE POLICY "Allow anonymous read user_activity"
  ON user_activity FOR SELECT
  USING (true);

-- Grant permissions
GRANT ALL ON access_keys TO anon, authenticated;
GRANT ALL ON user_activity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_access_key TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_access_code TO anon, authenticated;

-- Test: Create a sample user
-- Uncomment to test:
-- SELECT * FROM create_access_key('Test User', 'test@example.com');
