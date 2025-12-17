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
    requiredAccess: "basic",
    thumbnail: "/mansionThumb.png",
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
    description: "The decentralized marketplace for crypto trading, real estate listings, and real-world assets. Trade on the DEX, invest in tokenized properties, and access exclusive RWA opportunities.",
    status: "active",
    requiredAccess: "basic",
    thumbnail: "/shadowMarketThumb.png",
    coordinates: { lat: 35.68, lng: 139.65 },
    features: [
      "Crypto DEX (Decentralized Exchange)",
      "Real Estate Listings & Tokenization",
      "Real-World Assets (RWA) Marketplace",
      "Property Investment Opportunities",
      "Secure Blockchain Transactions",
      "NFT & Digital Asset Trading"
    ],
    entryPoint: "/world/shadow-market"
  },
  {
    id: "club-hollywood",
    name: "Club Hollywood",
    district: "Entertainment District",
    description: "Cinema-style presence lounge where you watch content together. Join live sessions with Professor Cle and the community. Free for all visitors.",
    status: "active",
    requiredAccess: "basic",
    thumbnail: "/clubHollywoodThumb.png",
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
    status: "active",
    requiredAccess: "premium",
    thumbnail: "/studioBeltThumb.png",
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
    id: "garden-ring",
    name: "Chakra Center",
    district: "Healing & Wellness Center",
    description: "A sacred healing sanctuary for mental, physical, and spiritual wellness. Explore curated books, resources, and tools for holistic health. Join an invitation-only community for deep connection and support.",
    status: "coming-soon",
    requiredAccess: "basic",
    thumbnail: "/gardenRingThumb.png",
    coordinates: { lat: 51.51, lng: -0.13 },
    features: [
      "Mental Health Resources & Books",
      "Physical Wellness Programs",
      "Invitation-Only Social Community",
      "Meditation & Healing Spaces",
      "Curated Wellness Library",
      "Member-to-Member Invitations"
    ],
    entryPoint: "/world/garden-ring"
  },
  {
    id: "arcane-tower",
    name: "Arcane Tower",
    district: "AI Nexus",
    description: "The central hub for Ask CLE AI. Dive deep into conversations, unlock knowledge archives, and explore AI-powered educational experiences.",
    status: "coming-soon",
    requiredAccess: "basic",
    thumbnail: "/arcaneTowerThumb.png",
    coordinates: { lat: 48.86, lng: 2.35 },
    features: [
      "CLE Conversation Hub",
      "AI Memory & Knowledge Archives",
      "Interactive Learning Modules",
      "Advanced AI Tutorials",
      "Personalized Education Pathways",
      "Research & Development Lab"
    ],
    entryPoint: "/world/arcane-tower"
  }
];

export const getRegionById = (id) => regions.find(r => r.id === id);

export const getActiveRegions = () => regions.filter(r => r.status === "active");

export const getComingSoonRegions = () => regions.filter(r => r.status === "coming-soon");

export const getAccessibleRegions = (isPremium = false) => {
  return regions.filter(r => {
    if (r.requiredAccess === "basic") return true;
    if (r.requiredAccess === "premium") return isPremium;
    return false;
  });
};
