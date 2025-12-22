# Club Hollywood Live Performance System - Roadmap

## Vision: "Showtime at the Apollo" Style Theater

### Current Status ✅
- **Content delivery system ready**
- **Three performance zones**:
  - 🎭 **Main Stage** - Featured live performances
  - 💎 **VIP Lounge** - Exclusive artist sessions
  - 🕺 **Dance Floor** - Interactive DJ sets

### Phase 1: Content Assignment (COMPLETE)
- ✅ Admin can assign audio/video to Club Hollywood zones
- ✅ Content Control Room shows all zones
- ✅ Zone-based content delivery

### Phase 2: Live Performance Features (PLANNED)

#### 🎬 Scheduled Broadcasts
```javascript
// Schema additions needed:
{
  scheduledBroadcast: {
    isScheduled: boolean,
    startTime: datetime,
    endTime: datetime,
    performerName: string,
    performerBio: text,
    eventTitle: string,
    ticketPrice: number (optional),
  }
}
```

**Features:**
- Event calendar showing upcoming performances
- Push notifications for scheduled shows
- Countdown timers
- Auto-start streams at scheduled time

#### 💰 Live Tipping System (Crypto)

**Wallet Integration:**
```javascript
// Recommended: Coinbase Commerce / Web3 wallets
{
  performer: {
    walletAddress: string,
    paymentProcessor: 'coinbase' | 'metamask' | 'walletconnect',
    acceptedTokens: ['ETH', 'USDC', 'SOL'],
  },
  tip: {
    amount: number,
    token: string,
    timestamp: datetime,
    tipper: string (anonymous or wallet),
  }
}
```

**Tip Flow:**
1. User clicks "Tip Performer" button during live show
2. Wallet connect modal (MetaMask, WalletConnect, Coinbase Wallet)
3. Select tip amount & token
4. Transaction processed
5. **Platform fee**: 5-10% auto-split
6. Remaining 90-95% goes to performer instantly
7. On-screen tip animation/notification

**Smart Contract Logic:**
```solidity
// Auto-split payment
function tipPerformer(address performer) payable {
  uint platformFee = msg.value * 10 / 100; // 10% fee
  uint performerAmount = msg.value - platformFee;
  
  payable(platformAddress).transfer(platformFee);
  payable(performer).transfer(performerAmount);
  
  emit TipSent(performer, performerAmount);
}
```

#### 👥 Engagement Features

**Live Chat:**
- Real-time chat during performances
- Emoji reactions
- Tip leaderboard (optional)

**Audience Interaction:**
- Applause button (like Clubhouse)
- Request song/shoutout via tip
- Vote on next performance

**Performer Dashboard:**
- Real-time tip tracker
- Audience count
- Engagement metrics
- Earnings per show

### Phase 3: Business Model

#### Revenue Streams:
1. **Platform Fee**: 5-10% of all tips
2. **Ticket Sales**: Premium shows require ticket purchase
3. **Subscriptions**: Monthly pass for unlimited shows
4. **Sponsorships**: Featured artist placements

#### Performer Benefits:
- **Instant payouts** (crypto = no bank delays)
- **Global audience** (no geographic limits)
- **Keep 90%+** of earnings (vs traditional venues 50-70%)
- **Built-in promotion** via platform

#### Payment Automation:
```javascript
// Automatic fee distribution
const processPayment = async (tipAmount, performerWallet) => {
  const platformFee = tipAmount * 0.10; // 10%
  const performerAmount = tipAmount - platformFee;
  
  await Promise.all([
    sendCrypto(platformWallet, platformFee),
    sendCrypto(performerWallet, performerAmount),
  ]);
  
  // Record transaction
  await logTransaction({
    performer: performerWallet,
    amount: performerAmount,
    fee: platformFee,
    timestamp: Date.now(),
  });
};
```

### Technical Implementation Roadmap

#### Immediate (Next Steps):
1. ✅ **Zone setup** - Club Hollywood display locations
2. 🔄 **Create Club Hollywood rooms** - Main Stage, VIP, Dance Floor components
3. 🔄 **Video player** - Full-screen video for performances
4. 🔄 **Live stream support** - Embed live video URLs

#### Short-term (1-2 weeks):
1. **Scheduled broadcast UI**
   - Event calendar component
   - Countdown timers
   - "Live Now" indicators

2. **Basic crypto tipping**
   - Coinbase Commerce integration (easiest start)
   - Fixed tip amounts ($5, $10, $25, $50)
   - Tip button during live shows

#### Mid-term (1 month):
1. **Wallet connect**
   - MetaMask, WalletConnect integration
   - Multi-token support (ETH, USDC, SOL)
   - Custom tip amounts

2. **Performer portal**
   - Upload performance content
   - Schedule shows
   - View earnings
   - Withdraw funds

3. **Live chat**
   - Real-time messaging
   - Moderation tools
   - Tip notifications in chat

#### Long-term (2-3 months):
1. **Smart contracts**
   - Deploy custom tipping contract
   - Automated fee splits
   - Escrow for ticketed events

2. **NFT tickets**
   - Collectible show passes
   - VIP access NFTs
   - Artist merchandise NFTs

3. **Advanced features**
   - Multi-camera views
   - Interactive polls
   - Backstage pass system

### Tech Stack Recommendations

**Live Video:**
- **Agora.io** - Low latency live streaming
- **LiveKit** - Open-source alternative
- **Mux** - Video infrastructure with live support

**Crypto Payments:**
- **Coinbase Commerce** - Easiest integration (hosted)
- **Stripe Crypto** - Fiat off-ramp included
- **thirdweb** - Web3 SDK with payment flows
- **WalletConnect** - Multi-wallet support

**Smart Contracts:**
- **Solidity** (Ethereum/Polygon)
- **thirdweb** SDK for deployment
- **Hardhat** for testing

**Real-time Chat:**
- **Supabase Realtime** (already using)
- **Socket.io**
- **Ably**

### MVP Feature Set (Launch Ready)

For initial launch, focus on:
1. ✅ Content zones (Main Stage, VIP, Dance Floor)
2. ⚡ Video player with live stream support
3. ⚡ Coinbase Commerce tip buttons
4. ⚡ Simple scheduled show listing
5. ⚡ Basic chat

This gives performers:
- Place to perform ✅
- Way to earn money ✅
- Audience engagement ✅

Everything else can be added iteratively.

---

## Next Immediate Action Items:

1. **See Music Room working** (already implemented)
2. **Create Club Hollywood Main Stage component** (video player + tip button)
3. **Test content assignment** (Control Room → Club Hollywood)
4. **Add Coinbase Commerce** (basic tipping)

Once Music Room is verified, we can clone the pattern for Club Hollywood with video focus + tipping integration.
