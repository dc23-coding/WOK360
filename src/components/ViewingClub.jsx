// src/components/ViewingClub.jsx
// Club Hollywood - Cinema-style presence experience with metrics & reactions
// See GUARDRAILS.md for behavioral rules
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VibePlayer from "./VibePlayer";

export default function ViewingClub({ variant = "dark" }) {
  const [isLive, setIsLive] = useState(false);

  // PHASE 1: Metrics (Anonymous Aggregates)
  const [metrics, setMetrics] = useState({
    currentViewers: 0,
    totalVisitors: 1247,
    peakConcurrent: 156,
    avgSessionDuration: 847, // seconds
    contentViews: 2891
  });

  // PHASE 2: Reaction System (Hard cap: 4 reactions)
  const allowedReactions = [
    { emoji: "👍", label: "Support" },
    { emoji: "👏", label: "Applause" },
    { emoji: "❤️", label: "Love" },
    { emoji: "👀", label: "Attention" }
  ];
  const [activeReactions, setActiveReactions] = useState([]); // [{id, emoji, x, y, timestamp}]
  const [lastReactionTime, setLastReactionTime] = useState(0);

  // PHASE 2.5: Chat System (Collapsed by default)
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);

  // Audience members (presence-only, no interaction)
  const audienceMembers = [
    { id: 1, name: "Alex Chen", avatar: "👤", position: "left-top" },
    { id: 2, name: "Maria Santos", avatar: "👤", position: "left-middle" },
    { id: 3, name: "Jordan Kim", avatar: "👤", position: "left-bottom" },
    { id: 4, name: "Taylor Brooks", avatar: "👤", position: "right-top" },
    { id: 5, name: "Sam Rivera", avatar: "👤", position: "right-middle" },
    { id: 6, name: "Casey Morgan", avatar: "👤", position: "right-bottom" },
    { id: 7, name: "Drew Anderson", avatar: "👤", position: "back-left" },
    { id: 8, name: "Riley Parker", avatar: "👤", position: "back-right" },
  ];

  const isDark = variant === "dark";

  // Simulate audience arrival (gradual entry)
  const [visibleAudience, setVisibleAudience] = useState([]);

  useEffect(() => {
    if (isLive) {
      // Gradually reveal audience members
      audienceMembers.forEach((member, idx) => {
        setTimeout(() => {
          setVisibleAudience(prev => [...prev, member.id]);
        }, idx * 300);
      });
      
      // Update current viewers count
      setMetrics(prev => ({
        ...prev,
        currentViewers: audienceMembers.length
      }));
    } else {
      setVisibleAudience([]);
      setMetrics(prev => ({ ...prev, currentViewers: 0 }));
    }
  }, [isLive]);

  // PHASE 2: Send Reaction (Rate Limited)
  const sendReaction = (emoji) => {
    const now = Date.now();
    const RATE_LIMIT = 2000; // 2 seconds between reactions
    
    if (now - lastReactionTime < RATE_LIMIT) {
      return; // Rate limit: prevent spam
    }

    // Random position near center (around content)
    const x = 50 + (Math.random() - 0.5) * 30; // 35-65% horizontal
    const y = 40 + (Math.random() - 0.5) * 30; // 25-55% vertical

    const reaction = {
      id: `${now}-${Math.random()}`,
      emoji,
      x,
      y,
      timestamp: now
    };

    setActiveReactions(prev => [...prev, reaction]);
    setLastReactionTime(now);

    // Remove after animation (3 seconds)
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 3000);
  };

  // PHASE 2.5: Send Chat Message (Rate Limited)
  const sendMessage = () => {
    const now = Date.now();
    const RATE_LIMIT = 3000; // 3 seconds between messages
    const MAX_LENGTH = 200;

    if (!chatInput.trim()) return;
    if (chatInput.length > MAX_LENGTH) return;
    if (now - lastMessageTime < RATE_LIMIT) return;

    const message = {
      id: `${now}-${Math.random()}`,
      text: chatInput.trim(),
      timestamp: now,
      user: "You" // In production: actual username
    };

    setChatMessages(prev => [...prev.slice(-49), message]); // Keep last 50
    setChatInput("");
    setLastMessageTime(now);
  };

  return (
    <div className={`w-full h-full flex flex-col ${
      isDark 
        ? "bg-gradient-to-b from-black via-slate-950 to-cyan-950/30 text-white" 
        : "bg-gradient-to-b from-black via-slate-950 to-purple-950/30 text-white"
    }`}>
      {/* Header - Minimal with Metrics */}
      <div className={`px-6 py-3 border-b ${
        isDark ? "border-cyan-500/10 bg-black/50" : "border-purple-500/10 bg-black/50"
      } backdrop-blur`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold opacity-70">
              Club Hollywood
            </h2>
            
            {/* Live Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              isLive
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-slate-700/30 text-slate-500 border border-slate-600/30"
            }`}>
              <span className={isLive ? "w-2 h-2 rounded-full bg-red-500 animate-pulse" : "w-2 h-2 rounded-full bg-slate-600"} />
              {isLive ? "LIVE" : "Offline"}
            </div>
          </div>

          {/* PHASE 1: Metrics Display (Anonymous Aggregates) */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-white">👁 {metrics.currentViewers}</span> watching
            </div>
            <div className="text-xs text-slate-600">
              {metrics.totalVisitors.toLocaleString()} total
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Cinema Layout */}
      <div className="flex-1 relative overflow-hidden">
        {/* Center Stage - Content Authority (Single Source) */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className={`w-full max-w-5xl aspect-video rounded-xl overflow-hidden border ${
            isDark 
              ? "border-cyan-500/20 shadow-[0_0_80px_rgba(34,211,238,0.2)]" 
              : "border-purple-500/20 shadow-[0_0_80px_rgba(168,85,247,0.2)]"
          } bg-black relative`}>
            {/* Video/Stream Placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl font-semibold text-slate-400">
                  {isLive ? "Content Playing..." : "Awaiting Content"}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {isLive ? "Everyone sees the same thing at the same time" : "Host will start soon"}
                </p>
              </div>
            </div>

            {/* Time-Lock Indicator */}
            {isLive && (
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-slate-400 border border-slate-700/50">
                🔒 Time-synced for all
              </div>
            )}

            {/* PHASE 2: Floating Reactions (Ephemeral) */}
            <AnimatePresence>
              {activeReactions.map(reaction => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -100, scale: 1.5 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  className="absolute text-4xl pointer-events-none"
                  style={{ left: `${reaction.x}%`, top: `${reaction.y}%` }}
                >
                  {reaction.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Audience Presence - Spatial Layout (Peripheral) */}
        {/* Left Side - Cinema Seating */}
        <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col justify-center gap-6 p-6">
          {audienceMembers
            .filter(m => m.position.startsWith("left"))
            .map((member, idx) => (
              <AnimatePresence key={member.id}>
                {visibleAudience.includes(member.id) && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative"
                  >
                    {/* Soft Silhouette Video Feed */}
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${
                      isDark 
                        ? "border-cyan-500/30 bg-slate-900/50" 
                        : "border-purple-500/30 bg-slate-900/50"
                    } backdrop-blur flex items-center justify-center text-2xl opacity-60 group-hover:opacity-100 transition-opacity cursor-default`}>
                      {member.avatar}
                    </div>

                    {/* Name on Hover */}
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {member.name}
                    </div>

                    {/* Subtle Breathing Animation */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full ${
                        isDark ? "bg-cyan-500/10" : "bg-purple-500/10"
                      } -z-10`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
        </div>

        {/* Right Side - Cinema Seating */}
        <div className="absolute right-0 top-0 bottom-0 w-32 flex flex-col justify-center gap-6 p-6">
          {audienceMembers
            .filter(m => m.position.startsWith("right"))
            .map((member, idx) => (
              <AnimatePresence key={member.id}>
                {visibleAudience.includes(member.id) && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative"
                  >
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${
                      isDark 
                        ? "border-cyan-500/30 bg-slate-900/50" 
                        : "border-purple-500/30 bg-slate-900/50"
                    } backdrop-blur flex items-center justify-center text-2xl opacity-60 group-hover:opacity-100 transition-opacity cursor-default`}>
                      {member.avatar}
                    </div>

                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {member.name}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full ${
                        isDark ? "bg-cyan-500/10" : "bg-purple-500/10"
                      } -z-10`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
        </div>

        {/* Back Row - Behind Content (distant presence) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6">
          {audienceMembers
            .filter(m => m.position.startsWith("back"))
            .map((member, idx) => (
              <AnimatePresence key={member.id}>
                {visibleAudience.includes(member.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative"
                  >
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                      isDark 
                        ? "border-cyan-500/20 bg-slate-900/40" 
                        : "border-purple-500/20 bg-slate-900/40"
                    } backdrop-blur flex items-center justify-center text-xl opacity-40 group-hover:opacity-80 transition-opacity cursor-default`}>
                      {member.avatar}
                    </div>

                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {member.name}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full ${
                        isDark ? "bg-cyan-500/5" : "bg-purple-500/5"
                      } -z-10`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
        </div>
      </div>

      {/* Footer - Controls with Reactions & Chat */}
      <div className={`px-6 py-3 border-t ${
        isDark ? "border-cyan-500/10 bg-black/50" : "border-purple-500/10 bg-black/50"
      } backdrop-blur`}>
        <div className="flex items-center justify-between gap-4">
          {/* Left: Presence Controls */}
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-full text-sm transition ${
              isDark 
                ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400" 
                : "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
            }`} title="Toggle your camera">
              📹
            </button>

            <button className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition" title="Leave club">
              🚪
            </button>
          </div>

          {/* Center: PHASE 2 - Reaction Bar (Body Language) */}
          <div className="flex items-center gap-2">
            {allowedReactions.map(reaction => (
              <button
                key={reaction.emoji}
                onClick={() => sendReaction(reaction.emoji)}
                className={`p-2 text-xl rounded-full transition hover:scale-125 ${
                  isDark 
                    ? "hover:bg-cyan-500/20" 
                    : "hover:bg-purple-500/20"
                }`}
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}

            {/* Chat Toggle */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-full text-sm transition ${
                isChatOpen
                  ? isDark
                    ? "bg-cyan-500/30 text-cyan-300"
                    : "bg-purple-500/30 text-purple-300"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Toggle chat"
            >
              💬
            </button>
          </div>

          {/* Right: Host Control */}
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
          >
            {isLive ? "⏸️ Pause" : "▶️ Start"}
          </button>
        </div>
      </div>

      {/* PHASE 2.5: Chat Panel (Collapsed by Default) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "250px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-t ${
              isDark ? "border-cyan-500/10 bg-black/80" : "border-purple-500/10 bg-black/80"
            } backdrop-blur overflow-hidden`}
          >
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-8">
                    No messages yet. Be the first to say something!
                  </p>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className="text-sm">
                      <span className="text-slate-500 text-xs">{msg.user}:</span>{" "}
                      <span className="text-slate-300">{msg.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="px-6 py-3 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value.slice(0, 200))}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message... (200 char max)"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-slate-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim()}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      chatInput.trim()
                        ? isDark
                          ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                          : "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Rate limited: 1 message per 3 seconds
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vibe Player - Music Selection */}
      <div className="p-6 border-t border-cyan-500/10">
        <VibePlayer variant={variant} />
      </div>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/5" : "bg-purple-500/5"
        }`} />
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/5" : "bg-purple-500/5"
        }`} />
      </div>
    </div>
  );
}
