-- Access Keys System for WOK360
-- Zone-based authentication with 4-digit codes

-- Main access keys table
CREATE TABLE access_keys (
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

-- Zone rules and configuration
CREATE TABLE zone_rules (
  zone_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  required_level TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User activity tracking
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  zone_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- User favorites/bookmarks
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  zone_id TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Insert default zone rules
INSERT INTO zone_rules (zone_id, display_name, required_level, is_active, description) VALUES
  ('kazmo-mansion', 'Kazmo Mansion', 'user', true, 'Main mansion - all users have access'),
  ('club-hollywood', 'Club Hollywood', 'user', true, 'Live music venue - all users have access'),
  ('shadow-market', 'Shadow Market', 'premium', false, 'Premium marketplace - coming soon'),
  ('chakra-center', 'Chakra Center', 'premium', false, 'Wellness center - coming soon');

-- Indexes for performance
CREATE INDEX idx_access_keys_code ON access_keys(code);
CREATE INDEX idx_access_keys_email ON access_keys(email);
CREATE INDEX idx_access_keys_is_active ON access_keys(is_active);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);

-- Function to generate unique 4-digit code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS VARCHAR(4) AS $$
DECLARE
  new_code VARCHAR(4);
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 4-digit code
    new_code := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
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
  p_zones JSONB DEFAULT '["kazmo-mansion", "club-hollywood"]'::jsonb
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

-- Function to check zone access
CREATE OR REPLACE FUNCTION check_zone_access(
  p_code VARCHAR(4),
  p_zone_id TEXT
)
RETURNS TABLE(
  has_access BOOLEAN,
  reason TEXT,
  user_data JSONB
) AS $$
DECLARE
  user_record RECORD;
  zone_record RECORD;
  level_order JSONB := '{"user": 1, "premium": 2, "admin": 3}'::jsonb;
BEGIN
  -- Get user by code
  SELECT * INTO user_record
  FROM access_keys
  WHERE code = p_code AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'invalid_code'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Get zone rules
  SELECT * INTO zone_record
  FROM zone_rules
  WHERE zone_id = p_zone_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'invalid_zone'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Check if zone is active
  IF NOT zone_record.is_active THEN
    RETURN QUERY SELECT false, 'zone_inactive'::TEXT, row_to_json(user_record)::JSONB;
    RETURN;
  END IF;
  
  -- Check if user has zone in their access list
  IF NOT (user_record.access_zones ? p_zone_id) THEN
    RETURN QUERY SELECT false, 'no_zone_access'::TEXT, row_to_json(user_record)::JSONB;
    RETURN;
  END IF;
  
  -- Check access level
  IF (level_order->user_record.access_level)::INTEGER < (level_order->zone_record.required_level)::INTEGER THEN
    RETURN QUERY SELECT false, 'insufficient_level'::TEXT, row_to_json(user_record)::JSONB;
    RETURN;
  END IF;
  
  -- Access granted
  RETURN QUERY SELECT true, 'access_granted'::TEXT, row_to_json(user_record)::JSONB;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (enable row level security)
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read zone rules
CREATE POLICY "Zone rules are public"
  ON zone_rules FOR SELECT
  USING (true);

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON access_keys FOR SELECT
  USING (auth.uid() = id::TEXT OR is_active = true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON access_keys FOR UPDATE
  USING (auth.uid() = id::TEXT);

-- Policy: Anyone can create access keys (for sign up)
CREATE POLICY "Anyone can create access keys"
  ON access_keys FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON access_keys TO anon, authenticated;
GRANT ALL ON zone_rules TO anon, authenticated;
GRANT ALL ON user_activity TO anon, authenticated;
GRANT ALL ON user_favorites TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_access_code() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_access_key(TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_zone_access(VARCHAR(4), TEXT) TO anon, authenticated;
