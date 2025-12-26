# Arcane Tower - Progression Hub Foundation

## Overview
The Arcane Tower serves as the **central progression and achievement tracking system** for WOK360. Users can view their accomplishments, track analytics across all worlds, and claim rewards.

---

## Architecture

### 3-Zone Structure

#### 1. Achievement Gallery
**Purpose:** Display badges, honors, and milestones earned across all worlds

**Features:**
- Badge collection (common, rare, epic, legendary)
- Achievement unlock system
- Milestone tracking
- Rarity tiers with visual differentiation

**Achievement Categories:**
- **Exploration:** Visit all rooms, discover hidden areas
- **Social:** Attend events, interact with community
- **Wellness:** Complete Chakra Center streaks, health goals
- **Commerce:** Make purchases, trade NFTs
- **Time-based:** Daily login streaks, world visit streaks
- **Premium:** Unlock exclusive access, VIP status

#### 2. Progress Tracker
**Purpose:** Analytics and stats showing user growth across all dimensions

**Metrics Tracked:**
- Total visits per world
- Time spent in each zone
- Content consumed (audio, video)
- Social interactions (reactions, comments)
- Purchases made
- Wellness activities completed
- Overall level and XP

**Dashboard Components:**
- Overall stats cards (visits, worlds unlocked, achievements, level)
- Per-world activity breakdown
- Growth charts (XP over time, engagement trends)
- Comparative analytics (your rank vs. community)

#### 3. Rewards Vault
**Purpose:** Claim unlockables, perks, and special access earned through progression

**Reward Types:**
- **Access:** Dark Wing, premium worlds, exclusive zones
- **Content:** Bonus tracks, behind-the-scenes videos
- **Cosmetic:** Badges, profile customization, emojis
- **Commerce:** Discount codes, early access to drops
- **Social:** VIP status, priority support

---

## Database Schema

### Tables to Add

```sql
-- User progression tracking
CREATE TABLE user_progression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  total_visits INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievement definitions
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  xp_reward INTEGER DEFAULT 0,
  requirements JSONB, -- Flexible requirements (visits, actions, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements earned
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- World-specific progress
CREATE TABLE world_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  world_id TEXT NOT NULL,
  visits INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- seconds
  completed_items JSONB DEFAULT '[]'::jsonb,
  last_visit TIMESTAMPTZ,
  UNIQUE(user_id, world_id)
);

-- Rewards available
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reward_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  reward_type TEXT CHECK (reward_type IN ('access', 'content', 'cosmetic', 'commerce', 'social')),
  requirements JSONB, -- Level, achievements, purchases required
  metadata JSONB, -- Reward-specific data (URLs, codes, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User rewards claimed
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB, -- Claim-specific data
  UNIQUE(user_id, reward_id)
);
```

### Helper Functions

```sql
-- Add XP to user and check for level up
CREATE OR REPLACE FUNCTION add_experience(p_user_id UUID, p_xp INTEGER)
RETURNS TABLE(new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Get current progression
  SELECT experience_points, current_level INTO v_current_xp, v_current_level
  FROM user_progression WHERE user_id = p_user_id;
  
  -- Add XP
  v_current_xp := v_current_xp + p_xp;
  
  -- Calculate new level (100 XP per level for now, can adjust formula)
  v_new_level := FLOOR(v_current_xp / 100) + 1;
  
  -- Update progression
  UPDATE user_progression
  SET experience_points = v_current_xp,
      current_level = v_new_level,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_new_level, (v_new_level > v_current_level);
END;
$$ LANGUAGE plpgsql;

-- Award achievement to user
CREATE OR REPLACE FUNCTION award_achievement(p_user_id UUID, p_achievement_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_achievement_uuid UUID;
  v_xp_reward INTEGER;
  v_already_earned BOOLEAN;
BEGIN
  -- Check if already earned
  SELECT EXISTS(
    SELECT 1 FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    WHERE ua.user_id = p_user_id AND a.achievement_id = p_achievement_id
  ) INTO v_already_earned;
  
  IF v_already_earned THEN
    RETURN FALSE;
  END IF;
  
  -- Get achievement UUID and XP reward
  SELECT id, xp_reward INTO v_achievement_uuid, v_xp_reward
  FROM achievements WHERE achievement_id = p_achievement_id;
  
  -- Award achievement
  INSERT INTO user_achievements (user_id, achievement_id)
  VALUES (p_user_id, v_achievement_uuid);
  
  -- Grant XP reward
  PERFORM add_experience(p_user_id, v_xp_reward);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Track world visit
CREATE OR REPLACE FUNCTION track_world_visit(p_user_id UUID, p_world_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO world_progress (user_id, world_id, visits, last_visit)
  VALUES (p_user_id, p_world_id, 1, NOW())
  ON CONFLICT (user_id, world_id)
  DO UPDATE SET 
    visits = world_progress.visits + 1,
    last_visit = NOW();
    
  -- Update total visits
  UPDATE user_progression
  SET total_visits = total_visits + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Grant XP for visit
  PERFORM add_experience(p_user_id, 10);
END;
$$ LANGUAGE plpgsql;
```

---

## Integration Points

### World Entry Tracking
Each world component should call `track_world_visit()` on mount:

```javascript
useEffect(() => {
  const user = getCurrentUser();
  if (user) {
    trackWorldVisit(user.id, "kazmo-mansion");
  }
}, []);
```

### Achievement Triggers
Award achievements based on user actions:

```javascript
// After content upload
if (uploadCount === 1) {
  awardAchievement(userId, "first-upload");
}

// After world exploration
if (visitedAllRooms("kazmo-mansion")) {
  awardAchievement(userId, "mansion-explorer");
}
```

### Reward Claims
Check requirements before allowing claim:

```javascript
const canClaimReward = async (rewardId) => {
  const user = await getCurrentUser();
  const reward = await getReward(rewardId);
  
  // Check level requirement
  if (user.current_level < reward.requirements.level) return false;
  
  // Check achievement requirements
  if (!hasAllAchievements(user, reward.requirements.achievements)) return false;
  
  return true;
};
```

---

## Scalability Considerations

### Future Enhancements
1. **Leaderboards** - Global and per-world rankings
2. **Seasonal Events** - Time-limited achievements and rewards
3. **Quests** - Multi-step challenges with progressive rewards
4. **Social Features** - Share achievements, gift rewards, team achievements
5. **NFT Integration** - Mint achievements as NFTs, trade rare badges
6. **Token Economy** - Earn WOK tokens for progression, spend on rewards

### Performance Optimization
- Index frequently queried fields (user_id, achievement_id, world_id)
- Cache user progression data in localStorage
- Batch XP updates to reduce DB calls
- Use materialized views for leaderboards

---

## Current Status
**Foundation:** ✅ Complete
- ArcaneTowerWorld component created with 3-zone hub
- Achievement Gallery UI with rarity tiers
- Progress Tracker with per-world analytics
- Rewards Vault with claim system

**To Implement:**
- [ ] Deploy Supabase schema (tables and functions)
- [ ] Add achievement definitions to database
- [ ] Implement reward definitions
- [ ] Connect world visit tracking
- [ ] Build achievement trigger system
- [ ] Create reward claim logic
- [ ] Add XP and level up animations
- [ ] Build leaderboards

---

## Demo Preparation
For tomorrow's demo, the Arcane Tower will show:
- **Structure:** 3-zone hub with clear purposes
- **UI:** Polished achievement gallery with rarity tiers
- **Progress:** Mock data showing multi-world tracking
- **Rewards:** Preview of unlock system

**Note:** Full backend integration will come after schema deployment.
