// src/worlds/clubHollywood/ClubHollywoodWorld.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSupabaseAuth } from "../../context/ClerkAuthContext";
import PresenceIndicator from "../../components/PresenceIndicator";
import VibePlayer from "../../components/VibePlayer";

export default function ClubHollywoodWorld({ onExitWorld }) {
  const { user } = useSupabaseAuth();
  
  const [reactions, setReactions] = useState([]);
  const [viewerCount, setViewerCount] = useState(12);

  // Mock audience users
  const [audienceUsers] = useState([
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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/ClubHollywod.png)" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-black/60 backdrop-blur-sm border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <p className="text-sm font-semibold text-cyan-400">🎭 Club Hollywood</p>
          </div>
          <div className="flex items-center gap-4">
            <PresenceIndicator count={viewerCount} variant="dark" />
            <button
              onClick={onExitWorld}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 transition"
            >
              ← Universe
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Center - Main Stage Player */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-5xl">
              {/* Vibe Player - Automatically pulls content from club-main-stage */}
              <VibePlayer 
                variant="dark" 
                mode="vod" 
                locked={false}
                roomId="club-main-stage"
              />
            </div>
          </div>

          {/* Audience Grid */}
          <div className="px-4 sm:px-6 md:px-8 pb-4">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-sm font-semibold text-cyan-400/70 uppercase tracking-wider mb-3">
                In the Club ({viewerCount})
              </h3>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {audienceUsers.slice(0, viewerCount).map((audience, index) => (
                  <motion.div
                    key={audience.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="aspect-square rounded-lg bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 overflow-hidden relative group hover:border-cyan-400/50 transition-all"
                  >
                    <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                      <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                        👤
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                      <p className="text-[10px] text-white/90 truncate">{audience.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Reactions */}
        <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/20">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-center gap-2 sm:gap-3">
            {["👍", "👏", "❤️", "🔥", "🎉", "😂"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji, user?.id || "guest")}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400/50 flex items-center justify-center text-lg sm:text-xl transition-all hover:scale-110 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
