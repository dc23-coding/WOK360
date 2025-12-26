// src/universe/data/regions.js
// World of Karma 360 - Universe Region Registry

export const regions = [
  {
    id: "kazmo-mansion",
    name: "Kazmo Mansion",
    district: "Kazmo District",
    owner: "Professor Cle",
    description: "Professor Cleshay's legendary mansion. Follow exclusive live sessions, crypto market insights, and learning centers. Stay connected with Professor Cle's latest content and educational experiences.",
    status: "active",
    requiredAccess: "authenticated", // Login required - gold-plated signin
    zoneCode: "1000", // Mansion zone code
    thumbnail: null, // Add actual thumbnail later
    coordinates: { lat: 34.05, lng: -118.25 },
    features: [
      "Live Sessions with Professor Cle",
      "Crypto Market Learning Centers",
      "Exclusive Educational Content",
      "Interactive Story Panels",
      "Day & Night Wings",
      "Ask CLE AI Assistant"
    ],
    entryPoint: "/world/kazmo-mansion"
  },
  {
    id: "shadow-market",
    name: "Shadow Market",
    district: "Exchange District",
    description: "Enter the enigmatic Shadow Market for exclusive NFT drops, prediction markets, and DeFi trading. Bet on real-world outcomes with Polygon, trade tokenized assets, and access premium commerce opportunities.",
    status: "coming-soon", // DISABLED: Investigating glitch
    requiredAccess: "authenticated", // Requires access key
    zoneCode: "2000", // Shadow Market zone code
    allowWalletAuth: true, // Enable crypto wallet authentication
    thumbnail: null, // Add actual thumbnail later
    coordinates: { lat: 35.68, lng: 139.65 },
    features: [
      "Exclusive NFT Drops",
      "Prediction Markets (Polygon - Coming Q2 2025)",
      "Crypto Wallet Integration (MetaMask)",
      "Limited Edition Merchandise",
      "Premium Content Access",
      "VIP Member Perks"
    ],
    entryPoint: "/world/shadow-market"
  },
  {
    id: "club-hollywood",
    name: "Club Hollywood",
    district: "Entertainment District",
    description: "Cinema-style presence lounge where you watch content together. Join live sessions with Professor Cle and the community. Free for all visitors.",
    status: "active",
    requiredAccess: "none", // No login required - enhanced for logged-in users
    zoneCode: "3000", // Club Hollywood zone code
    thumbnail: null, // Add actual thumbnail later
    coordinates: { lat: 34.10, lng: -118.35 },
    features: [
      "Live Content Viewing",
      "Cinema-Style Presence",
      "Real-Time Reactions",
      "Community Chat",
      "Anonymous Metrics",
      "Free Access for All"
    ],
    entryPoint: "/world/club-hollywood"
  },
  {
    id: "studio-belt",
    name: "Multiverse Studios",
    district: "Creative Quarter",
    description: "A sprawling complex of recording studios, production rooms, and collaboration spaces. Where music and video content come to life.",
    status: "coming-soon", // DISABLED: Needs content development
    requiredAccess: "premium",
    thumbnail: null, // Add actual thumbnail later
    coordinates: { lat: 40.75, lng: -73.99 },
    features: [
      "Multi-track Recording Studios",
      "Video Production Suites",
      "Collaboration Rooms",
      "Content Creation Tools",
      "Equipment & Resource Library"
    ],
    entryPoint: "/world/studio-belt"
  },
  {
    id: "chakra-center",
    name: "Chakra Center",
    district: "Wellness District",
    description: "Your personal wellness sanctuary. Access binaural beats for meditation, track your health journey, and receive AI-powered health advice tailored to your unique needs.",
    status: "coming-soon", // DISABLED: Investigating glitch
    requiredAccess: "authenticated", // Requires access key
    zoneCode: "4000", // Chakra Center zone code
    premiumFeatures: ["Advanced Health Tracking", "Custom AI Diet Plans", "Progress Analytics"],
    thumbnail: null, // Add actual thumbnail later
    coordinates: { lat: 51.51, lng: -0.13 },
    features: [
      "Binaural Beats Audio Library",
      "Self-Improvement Book Collection",
      "Health & Wealth Resources",
      "Personal Health Data Tracking",
      "Fitness Journey Monitoring",
      "AI Health Advisor Chatbot",
      "Personalized Diet Strategies"
    ],
    entryPoint: "/world/chakra-center"
  },
  {
    id: "arcane-tower",
    name: "Arcane Tower",
    district: "Progression Hub",
    description: "Climb the Arcane Tower to track your journey, earn achievements, and claim rewards. View your badges, analyze your growth across all worlds, and unlock special perks.",
    status: "coming-soon", // DISABLED: Basic structure only
    requiredAccess: "authenticated",
    zoneCode: "6000",
    premiumFeatures: ["Advanced Analytics", "Exclusive Badges", "Premium Rewards"],
    thumbnail: "/arcaneTowerThumb.png",
    coordinates: { lat: 48.86, lng: 2.35 },
    features: [
      "Achievement Gallery",
      "Progress Analytics Dashboard",
      "Rewards Vault",
      "Multi-World Progression Tracking",
      "Badge Collection & Honors",
      "Leaderboards (Coming Soon)"
    ],
    entryPoint: "/world/arcane-tower"
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

export const getRegionById = (id) => regions.find(r => r.id === id);

export const getActiveRegions = () => regions.filter(r => r.status === "active");

export const getComingSoonRegions = () => regions.filter(r => r.status === "coming-soon");

// NOTE: With zone-based auth, all regions are visible on the map
// Authentication is handled at world entry (Kazmo Mansion, Shadow Market)
export const getAllRegions = () => regions;
