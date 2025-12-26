# Shadow Market - DeFi Expansion Plan

## Current State
Shadow Market currently serves as the **exclusive commerce hub** for:
- Premium merchandise
- NFT drops
- Exclusive content access
- Limited edition releases

---

## Expansion Vision: DeFi Hub

### Phase 1: Foundation (Current)
✅ **Basic Commerce**
- Merch store interface
- NFT gallery concept
- Premium content gating
- Access control

### Phase 2: Prediction Markets (Next)
🎯 **Polygon Integration**

#### What Are Prediction Markets?
Users bet on real-world outcomes using crypto:
- Music chart predictions (Will X song hit #1?)
- Event outcomes (Album release dates, tour announcements)
- Community governance decisions
- Content performance predictions

#### Technical Requirements
1. **Polygon (MATIC) Integration**
   - MetaMask wallet connection
   - Smart contract deployment (prediction market logic)
   - MATIC token handling for bets
   - Gas fee management

2. **Smart Contract Structure**
   ```solidity
   // Prediction market contract (simplified)
   contract PredictionMarket {
     struct Market {
       uint256 id;
       string question;
       uint256 endTime;
       uint256 totalPool;
       mapping(address => Bet) bets;
       bool resolved;
       bool outcome;
     }
     
     struct Bet {
       uint256 amount;
       bool prediction;
     }
     
     function createMarket(string question, uint256 duration) external;
     function placeBet(uint256 marketId, bool prediction) external payable;
     function resolveMarket(uint256 marketId, bool outcome) external;
     function claimWinnings(uint256 marketId) external;
   }
   ```

3. **Frontend Components**
   - Market browser (active, upcoming, resolved)
   - Bet placement interface
   - Wallet connection flow
   - Position tracker (your active bets)
   - Winnings history

4. **Backend Services**
   - Market creation admin panel
   - Oracle service (resolve outcomes)
   - Transaction monitoring
   - Analytics and reporting

#### User Flow
1. **Connect Wallet** → MetaMask/WalletConnect integration
2. **Browse Markets** → See active prediction opportunities
3. **Place Bet** → Choose outcome, enter MATIC amount
4. **Track Position** → Monitor your bets in real-time
5. **Claim Winnings** → Auto-distribute when market resolves

#### Example Markets
- "Will World of Karma hit 10K users by Q2 2025?" (Yes/No)
- "Which track will be most played in Club Hollywood this week?" (Multiple choice)
- "Will the next NFT drop sell out in under 1 hour?" (Yes/No)
- "What will be the average gas price on Polygon this weekend?" (Range betting)

---

### Phase 3: Liquidity Pools (Future)
🔮 **Advanced DeFi Features**

#### Concept
Users provide liquidity to earn passive income:
- **WOK Token Pools** - Stake WOK tokens, earn rewards
- **NFT Staking** - Lock NFTs for yield
- **LP Tokens** - Provide liquidity to WOK/MATIC pair on DEXs

#### Benefits
- Passive income for holders
- Deeper liquidity for ecosystem
- Token price stability
- Community incentive alignment

---

### Phase 4: Community Governance (Future)
🗳️ **DAO Features**

#### Voting Power
- Token holders vote on platform decisions
- NFT holders get weighted votes
- Premium members get governance perks

#### Votable Decisions
- New world releases
- Feature prioritization
- Revenue sharing models
- Content creator partnerships
- Token allocation

---

## Technical Architecture

### Blockchain Stack
```
Frontend (React)
    ↓
Web3 Provider (ethers.js / wagmi)
    ↓
Polygon Network (MATIC)
    ↓
Smart Contracts (Solidity)
    ↓
IPFS (decentralized storage)
```

### Smart Contract Deployment
1. **Development:** Hardhat local network
2. **Testing:** Polygon Mumbai testnet
3. **Production:** Polygon mainnet

### Database Schema Additions

```sql
-- Track user wallets
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT CHECK (wallet_type IN ('metamask', 'walletconnect', 'coinbase')),
  verified BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wallet_address)
);

-- Prediction markets
CREATE TABLE prediction_markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_address TEXT NOT NULL,
  question TEXT NOT NULL,
  description TEXT,
  end_time TIMESTAMPTZ NOT NULL,
  total_pool DECIMAL(18, 8) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'locked', 'resolved', 'cancelled')),
  outcome BOOLEAN, -- true/false for binary markets
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- User bets
CREATE TABLE user_bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES access_keys(id) ON DELETE CASCADE,
  market_id UUID REFERENCES prediction_markets(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  prediction BOOLEAN NOT NULL, -- true = yes, false = no
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  claimed BOOLEAN DEFAULT FALSE,
  winnings DECIMAL(18, 8)
);

-- Market resolutions (audit trail)
CREATE TABLE market_resolutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID REFERENCES prediction_markets(id) ON DELETE CASCADE,
  resolver_address TEXT NOT NULL,
  outcome BOOLEAN NOT NULL,
  evidence_url TEXT, -- Link to proof
  resolved_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Integration Plan

### Component Structure
```
ShadowMarketWorld.jsx
  ├── CommerceHub (current merch/NFT)
  ├── PredictionHub (new)
  │   ├── WalletConnect
  │   ├── MarketBrowser
  │   ├── BetPlacement
  │   └── PositionTracker
  ├── LiquidityHub (future)
  └── GovernanceHub (future)
```

### Wallet Integration
```javascript
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  
  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Smart Contract Interaction
```javascript
import { useContractWrite } from 'wagmi';
import { parseEther } from 'ethers';

function PlaceBet({ marketId, prediction, amount }) {
  const { write } = useContractWrite({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'placeBet',
  });
  
  const handleBet = () => {
    write({
      args: [marketId, prediction],
      value: parseEther(amount.toString()),
    });
  };
  
  return <button onClick={handleBet}>Place Bet</button>;
}
```

---

## Security Considerations

### Smart Contract Audits
- **Required:** Full audit before mainnet deployment
- **Tools:** OpenZeppelin, Slither, Mythril
- **Cost:** $10k-50k depending on complexity

### Frontend Security
- Wallet connection validation
- Transaction signing confirmations
- Gas limit protections
- Slippage tolerance settings

### Backend Security
- Market resolution oracle trusted source
- Admin controls for emergency pause
- Rate limiting on market creation
- Fraud detection (suspicious betting patterns)

---

## Revenue Model

### Platform Fees
1. **Prediction Markets:** 2-5% of each winning payout
2. **Liquidity Pools:** 0.3% swap fees (standard DEX model)
3. **NFT Sales:** 10% platform fee + creator royalties
4. **Governance:** Fee-free (community benefit)

### Token Economics (Future WOK Token)
- **Total Supply:** 1 billion tokens
- **Distribution:**
  - 40% Community rewards (staking, predictions, engagement)
  - 20% Team and advisors (4-year vest)
  - 20% Ecosystem development (partnerships, grants)
  - 10% Liquidity provision
  - 10% Treasury (governance-controlled)

---

## Roadmap

### Q1 2025 (Foundation Complete)
- ✅ Shadow Market basic structure
- ✅ Access control system
- ✅ Universe navigation

### Q2 2025 (Prediction Markets Alpha)
- [ ] Smart contract development and testing
- [ ] Wallet integration (MetaMask)
- [ ] Polygon testnet deployment
- [ ] Alpha launch with 5 test markets
- [ ] User feedback and iteration

### Q3 2025 (Prediction Markets Beta)
- [ ] Smart contract audit
- [ ] Polygon mainnet deployment
- [ ] Public beta with 20+ active markets
- [ ] Marketing campaign
- [ ] Analytics dashboard

### Q4 2025 (Full DeFi Suite)
- [ ] Liquidity pools launch
- [ ] WOK token launch
- [ ] Community governance rollout
- [ ] Mobile wallet support
- [ ] Cross-chain bridge (Ethereum, BSC)

---

## Dependencies

### Technical Stack Additions
```json
{
  "dependencies": {
    "ethers": "^6.9.0",
    "wagmi": "^2.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "viem": "^2.0.0",
    "@web3modal/wagmi": "^4.0.0"
  },
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@nomiclabs/hardhat-ethers": "^2.2.3"
  }
}
```

### External Services
- **Polygon RPC:** Alchemy or Infura
- **Price Oracles:** Chainlink (for outcome resolution)
- **IPFS:** Pinata or web3.storage (metadata storage)
- **Analytics:** Dune Analytics, The Graph

---

## Current Status
**Foundation:** ✅ Complete
- ShadowMarketWorld basic structure
- Access gating for premium features
- UI placeholder for commerce

**To Implement:**
- [ ] Wallet connection flow
- [ ] Prediction market smart contracts
- [ ] Market browser UI
- [ ] Bet placement flow
- [ ] Position tracking
- [ ] Oracle service for resolution
- [ ] Admin panel for market creation
- [ ] Analytics dashboard

---

## Demo Preparation
For tomorrow's demo, Shadow Market will show:
- **Current:** Exclusive commerce hub concept
- **Vision:** Roadmap slide for prediction markets
- **Prototype:** Wallet connection mockup (no real transactions)
- **Strategy:** DeFi expansion plan and revenue model

**Note:** Full DeFi features are Q2-Q4 2025 targets. Demo focuses on vision and foundation.
