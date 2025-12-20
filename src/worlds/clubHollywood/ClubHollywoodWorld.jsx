// src/worlds/clubHollywood/ClubHollywoodWorld.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseAuth } from "../../context/ClerkAuthContext";
import AudienceRail from "../../components/AudienceRail";
import MixSelector from "../../components/MixSelector";
import PresenceIndicator from "../../components/PresenceIndicator";

export default function ClubHollywoodWorld({ onExitWorld }) {
  const { user } = useSupabaseAuth();
  const [activeMix, setActiveMix] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [viewerCount, setViewerCount] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Mock audience users
  const [audienceUsers, setAudienceUsers] = useState([
    { id: "user-1", name: "Alex Chen", avatar: null },
    { id: "user-2", name: "Maria Santos", avatar: null },
    { id: "user-3", name: "Jordan Kim", avatar: null },
    { id: "user-4", name: "Taylor Brooks", avatar: null },
    { id: "user-5", name: "Sam Rivera", avatar: null },
    { id: "user-6", name: "Casey Morgan", avatar: null },
    { id: "user-7", name: "Drew Anderson", avatar: null },
    { id: "user-8", name: "Riley Parker", avatar: null },
    { id: "user-9", name: "Pat Morgan", avatar: null },
    { id: "user-10", name: "Jamie Lee", avatar: null },
    { id: "user-11", name: "Quinn Davis", avatar: null },
    { id: "user-12", name: "Morgan Swift", avatar: null },
  ]);

  // Available mixes for selection
  const mixes = [
    {
      id: "mix-1",
      name: "Chill Lounge",
      emoji: "🌙",
      description: "Relaxed downtempo beats",
      duration: "45:30",
      source: "https://example.com/mix1.mp4"
    },
    {
      id: "mix-2",
      name: "Deep Focus",
      emoji: "🧠",
      description: "Ambient concentration flow",
      duration: "52:15",
      source: "https://example.com/mix2.mp4"
    },
    {
      id: "mix-3",
      name: "Upbeat Energy",
      emoji: "⚡",
      description: "High-energy motivational",
      duration: "38:45",
      source: "https://example.com/mix3.mp4"
    },
  ];

  useEffect(() => {
    // Set initial mix
    if (!activeMix && mixes.length > 0) {
      setActiveMix(mixes[0]);
    }
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(30, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectMix = (mix) => {
    setActiveMix(mix);
    // In production: switch video source
  };

  const handleReaction = (emoji, userId) => {
    const newReaction = {
      id: `${Date.now()}-${userId}`,
      emoji,
      userId,
      timestamp: Date.now(),
    };
    setReactions(prev => [...prev, newReaction]);
  };

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden relative">
      {/* Background Image with Video Frame */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/ClubHollywod.png)" }}
      >
        {/* Overlay to darken background slightly */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col pt-16">
        {/* Header with Presence */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-black/40 backdrop-blur-sm border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <p className="text-sm text-cyan-400/80">
              {isLive ? "🔴 LIVE" : "Entertainment District"}
            </p>
          </div>
          <PresenceIndicator count={viewerCount} variant="dark" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Mix Selector (Hidden on Mobile or Fullscreen) */}
          {!isFullscreen && (
          <div className="hidden md:block w-80 bg-black/60 backdrop-blur-sm border-r border-cyan-500/20 overflow-y-auto p-6">
            <MixSelector
              mixes={mixes}
              activeMixId={activeMix?.id}
              onSelectMix={handleSelectMix}
            />

            {/* User Profile Card */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-cyan-400/70">Signed In</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          )}

          {/* Center - Video Frame Area (matches background frame) */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-5xl aspect-video relative">
              {/* Video Content Placeholder */}
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-black/80 border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{activeMix?.emoji || "🎬"}</div>
                    <p className="text-xl font-semibold text-cyan-300">
                      {activeMix?.name || "Select a Mix"}
                    </p>
                    <p className="text-sm text-cyan-400/70 mt-2">
                      {activeMix?.description || "Choose from the sidebar"}
                    </p>
                  </div>
                </div>

                {/* Fullscreen Toggle Button */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute top-4 right-4 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:bg-black/90 transition-all group"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 text-sm">
                      {isFullscreen ? "⊡" : "⛶"}
                    </span>
                    <span className="text-xs text-cyan-400/90 hidden sm:inline">
                      {isFullscreen ? "Exit" : "Fullscreen"}
                    </span>
                  </div>
                </button>

                {/* Overlay: Now Playing */}
                {activeMix && (
                  <div className="absolute top-4 left-4 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-xs text-cyan-400 font-medium">Now Playing</span>
                    </div>
                  </div>
                )}

                {/* Reaction Overlay */}
                <AnimatePresence>
                  {reactions.slice(-10).map((reaction) => (
                    <motion.div
                      key={reaction.id}
                      initial={{ opacity: 0, y: 20, scale: 0.5 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: [20, -60], 
                        scale: [0.5, 1.2, 1, 0.8],
                        x: Math.random() * 40 - 20
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.5 }}
                      className="absolute bottom-20 left-1/2 text-4xl pointer-events-none"
                    >
                      {reaction.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Sidebar - User Profile Windows (Hidden on Mobile or Fullscreen) */}
          {!isFullscreen && (
          <div className="hidden md:block w-80 bg-black/60 backdrop-blur-sm border-l border-cyan-500/20 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-cyan-400/70 uppercase tracking-wider mb-4">
              In the Club
            </h3>
            
            {/* User Windows Grid */}
            <div className="grid grid-cols-2 gap-3">
              {audienceUsers.slice(0, viewerCount).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-lg bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 overflow-hidden relative group hover:border-cyan-400/50 transition-all"
                >
                  {/* Video Feed Placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                    <div className="text-4xl opacity-60 group-hover:opacity-100 transition-opacity">
                      👤
                    </div>
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs text-white/90 truncate">{user.name}</p>
                  </div>

                  {/* Breathing Animation */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/30 rounded-lg pointer-events-none"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Bottom Bar - Audience Rail & Reactions (Hidden in Fullscreen) */}
        {!isFullscreen && (
        <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/20">
          <AudienceRail users={audienceUsers} reactions={reactions} />
          
          {/* Reaction Buttons - Touch-optimized (44px minimum) */}
          <div className="px-4 sm:px-6 py-3 flex items-center justify-center gap-2 sm:gap-3 border-t border-cyan-500/10">
            {["👍", "👏", "❤️", "🔥"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji, user?.id || "guest")}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400/50 flex items-center justify-center text-xl sm:text-2xl transition-all hover:scale-110 active:scale-95 touch-manipulation"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
