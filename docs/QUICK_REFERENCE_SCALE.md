# Quick Reference - Arcane Tower & Shadow Market

## Arcane Tower (Progression Hub)

### Access
- **Location:** Universe Map → "Arcane Tower"
- **Status:** ✅ Active
- **Auth Required:** Yes (4-digit access code)
- **Route:** `/world/arcane-tower`

### 3 Zones

#### 1. Achievement Gallery 🏆
**Purpose:** Display badges and honors earned across all worlds

**Features:**
- Badge collection with rarity tiers:
  - Common (gray)
  - Rare (blue) 
  - Epic (purple)
  - Legendary (gold)
- Achievement unlock system
- Visual display of accomplishments

**Example Achievements:**
- "First Steps" - Entered WOK360 (common)
- "Mansion Explorer" - Visited all Kazmo rooms (rare)
- "Club Regular" - Attended 5 Club events (rare)
- "Wellness Warrior" - 7-day Chakra streak (epic)
- "Premium Elite" - Unlocked premium (legendary)

#### 2. Progress Tracker 📊
**Purpose:** Analytics showing growth across all dimensions

**Metrics:**
- Total visits across all worlds
- Worlds unlocked count
- Achievements earned
- Current level & XP
- Per-world activity breakdown
- Time spent in each zone

**Dashboard Cards:**
- Overall stats (4 cards: visits, worlds, achievements, level)
- World-by-world progress
- Growth charts (future)
- Community rankings (future)

#### 3. Rewards Vault 🎁
**Purpose:** Claim unlockables and special perks

**Reward Types:**
- **Access** - Dark Wing, premium zones
- **Content** - Bonus tracks, exclusive videos
- **Cosmetic** - Badges, profile customization
- **Commerce** - Discount codes, early access
- **Social** - VIP status, priority support

**Claim Flow:**
- Check requirements (level, achievements)
- Click "Claim Reward"
- Instantly unlocked
- Applied to account

### Progression System

**XP Sources:**
- World visit: +10 XP
- Content consumed: +5 XP
- Achievement earned: +10-100 XP (varies by rarity)
- Daily login: +20 XP
- Social interactions: +5 XP

**Leveling:**
- 100 XP per level (adjustable)
- Max level: No cap
- Level benefits: Unlock new rewards, badges, perks

### Database (Designed, Not Deployed)
```sql
user_progression (total_visits, current_level, xp)
achievements (name, rarity, xp_reward)
user_achievements (user_id, achievement_id)
world_progress (world_id, visits, time_spent)
rewards (name, type, requirements)
user_rewards (user_id, reward_id, claimed_at)
```

---

## Shadow Market (DeFi Hub)

### Current State
- **Commerce:** Merch, NFTs, exclusive content
- **Status:** ✅ Active (basic)
- **Auth:** Premium access required
- **Route:** `/world/shadow-market`

### Future Expansion (Q2-Q4 2025)

#### Prediction Markets (Q2 2025) 🎲
**Concept:** Bet on real-world outcomes using Polygon/MATIC

**Example Markets:**
- "Will WOK360 hit 10K users by Q2?" (Yes/No)
- "Which track will be most played this week?" (Multiple choice)
- "Will next NFT drop sell out in 1 hour?" (Yes/No)

**User Flow:**
1. Connect MetaMask wallet
2. Browse active markets
3. Choose outcome + enter MATIC amount
4. Place bet (smart contract transaction)
5. Track position in real-time
6. Claim winnings when market resolves

**Tech Stack:**
- Polygon blockchain (low gas fees)
- Solidity smart contracts
- ethers.js / wagmi (wallet integration)
- Chainlink oracles (outcome resolution)

**Revenue:**
- 2-5% platform fee on winnings
- Transparent, automatic distribution

#### Liquidity Pools (Q3 2025) 💧
**Concept:** Stake tokens to earn passive income

**Pools:**
- WOK/MATIC pair
- NFT staking for yield
- LP token rewards

**Benefits:**
- Passive income for holders
- Ecosystem liquidity
- Token price stability

#### Community Governance (Q4 2025) 🗳️
**Concept:** Token holders vote on platform decisions

**Votable:**
- New world releases
- Feature prioritization
- Revenue sharing models
- Content partnerships
- Token allocation

**Voting Power:**
- 1 WOK token = 1 vote
- NFT holders get weighted votes
- Premium members get bonus votes

### Database (Designed, Not Deployed)
```sql
user_wallets (wallet_address, wallet_type, verified)
prediction_markets (question, end_time, total_pool, status)
user_bets (market_id, amount, prediction, claimed)
market_resolutions (market_id, outcome, evidence_url)
```

---

## What Works Now

✅ **Arcane Tower**
- Complete UI with 3 zones
- Zone navigation
- Achievement gallery display
- Progress tracker dashboard
- Rewards vault interface
- Mock progression data
- Responsive design
- Dark theme matching WOK360 aesthetic

✅ **Shadow Market**
- Basic world structure
- Premium access gating
- Universe map entry

## What's Next

### Arcane Tower (Short-term)
1. Deploy Supabase schema
2. Add world visit tracking to all worlds
3. Define initial achievements (10-15)
4. Connect backend to UI
5. Test progression flow end-to-end

### Shadow Market (Long-term)
1. Smart contract development (Q2)
2. Wallet integration (Q2)
3. Prediction market alpha (Q2)
4. Security audit (Q3)
5. Mainnet launch (Q3)
6. Full DeFi suite (Q4)

---

## Demo Talking Points

### Arcane Tower
> "The Arcane Tower is our central progression hub. As users explore WOK360, they earn XP, unlock achievements, and climb levels. Every world they visit, every piece of content they consume - it all contributes to their journey. They can see their badges in the Achievement Gallery, track analytics in the Progress Tracker, and claim rewards in the Vault. This creates engagement loops across all our worlds."

### Shadow Market
> "Shadow Market starts as our premium commerce hub, but we're scaling toward a full DeFi experience. By Q2, users will be able to place bets on real-world outcomes using Polygon. Think of it like a decentralized prediction market - will an album drop on time? Will a tour sell out? Users stake MATIC, winners split the pool. We're building the foundation now so we're ready to scale when we hit critical mass."

---

## File Locations

```
Components:
src/worlds/arcaneTower/ArcaneTowerWorld.jsx

Documentation:
docs/ARCANE_TOWER_FOUNDATION.md
docs/SHADOW_MARKET_EXPANSION.md
docs/SCALE_FOUNDATION_SUMMARY.md

Configuration:
src/AppRouter.jsx (routes + zone context)
src/universe/data/regions.js (map entries)
```

---

## Master Key Access

**Code:** `3104`  
**Location:** `src/lib/zoneAccessControl.js` line 4

All worlds accessible with master key for testing.
