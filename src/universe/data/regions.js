// src/universe/data/regions.js
// World of Karma 360 - Universe Region Registry

export const regions = [
  {
    id: "kazmo-mansion",
    name: "Kazmo Mansion",
    district: "Kazmo District",
    description: "The legendary mansion where stories unfold through light and shadow. Explore exclusive content, live sessions, and immersive media experiences.",
    status: "active",
    requiredAccess: "basic", // "basic" | "premium"
    thumbnail: "/mansionThumb.png",
    coordinates: { lat: 34.05, lng: -118.25 }, // Globe position (LA coords as example)
    features: [
      "Interactive Story Panels",
      "Day & Night Wings",
      "Live Music Sessions",
      "Photo Gallery",
      "Merch Shop",
      "Ask CLE AI Assistant"
    ],
    entryPoint: "/world/kazmo-mansion"
  },
  {
    id: "studio-belt",
    name: "Studio Belt",
    district: "Creative Quarter",
    description: "A sprawling complex of recording studios, production rooms, and collaboration spaces. Where music and video come to life.",
    status: "coming-soon",
    requiredAccess: "premium",
    thumbnail: "/studioBeltThumb.png",
    coordinates: { lat: 40.75, lng: -73.99 },
    features: [
      "Multi-track Recording",
      "Video Production Suites",
      "Collaboration Rooms",
      "Equipment Marketplace"
    ],
    entryPoint: "/world/studio-belt"
  },
  {
    id: "garden-ring",
    name: "Garden Ring",
    district: "Serenity Zone",
    description: "A tranquil realm of meditation spaces, ambient soundscapes, and peaceful exploration. The light wing of the Karma Universe.",
    status: "coming-soon",
    requiredAccess: "basic",
    thumbnail: "/gardenRingThumb.png",
    coordinates: { lat: 51.51, lng: -0.13 },
    features: [
      "Meditation Spaces",
      "Ambient Music Library",
      "Nature Walks",
      "Wellness Content"
    ],
    entryPoint: "/world/garden-ring"
  },
  {
    id: "shadow-market",
    name: "Shadow Market",
    district: "Exchange District",
    description: "The underground marketplace for exclusive drops, limited releases, and rare collectibles. Premium access only.",
    status: "coming-soon",
    requiredAccess: "premium",
    thumbnail: "/shadowMarketThumb.png",
    coordinates: { lat: 35.68, lng: 139.65 },
    features: [
      "Exclusive Merch Drops",
      "NFT Gallery",
      "Auction House",
      "VIP Pre-orders"
    ],
    entryPoint: "/world/shadow-market"
  },
  {
    id: "arcane-tower",
    name: "Arcane Tower",
    district: "AI Nexus",
    description: "The central hub for Ask CLE AI. Dive deep into conversations, unlock knowledge, and explore AI-powered experiences.",
    status: "coming-soon",
    requiredAccess: "basic",
    thumbnail: "/arcaneTowerThumb.png",
    coordinates: { lat: 48.86, lng: 2.35 },
    features: [
      "CLE Conversation Hub",
      "AI Memory Archives",
      "Knowledge Library",
      "Interactive Tutorials"
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
