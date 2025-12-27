// src/sections/LightStudio.jsx
// Conference & Lecture Room - Classroom-style video feed with user interaction
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RoomSection from "../components/RoomSection";

export default function LightStudio() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [attendees, setAttendees] = useState(0);
  const [handRaised, setHandRaised] = useState(false);

  // Simulated attendee count
  useEffect(() => {
    const interval = setInterval(() => {
      setAttendees(Math.floor(Math.random() * 50) + 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <RoomSection bg="/Playroom_Light.webp" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center px-4 py-8 md:py-0">
        
        {/* Main Conference Container */}
        <div className="w-full max-w-6xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 md:mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border-2 border-amber-300/60 mb-2">
              {isLive && (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-amber-900">LIVE</span>
                </span>
              )}
              <span className="text-xs text-amber-700">
                {attendees} attending
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-amber-900 mb-1">
              Conference & Lecture Hall
            </h2>
            <p className="text-[10px] md:text-sm text-amber-700/80">
              Interactive sessions, Q&A, and live lectures
            </p>
          </motion.div>

          {/* Main Video Feed Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl md:rounded-3xl border-4 border-amber-300/80 shadow-[0_0_60px_rgba(251,191,36,0.4)] overflow-hidden bg-black mb-4"
          >
            {/* Video Feed */}
            <div className="relative aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900">
              <video
                ref={videoRef}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none">
                {/* Top Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-amber-200/60">
                    <p className="text-[10px] md:text-xs font-semibold text-amber-900">
                      📚 Current Topic: Web3 & Blockchain Basics
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-amber-900/90 backdrop-blur-sm text-amber-100 text-[10px] md:text-xs">
                    45:23
                  </div>
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                  <motion.button
                    onClick={togglePlay}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-400/90 backdrop-blur-sm flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl pointer-events-auto hover:bg-amber-500 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ▶
                  </motion.button>
                )}

                {/* Bottom Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 md:gap-3 pointer-events-auto">
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center text-white font-bold hover:bg-amber-600 transition"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </motion.button>

                  {/* Seeker Bar */}
                  <div className="flex-1 h-2 rounded-full bg-amber-900/50 backdrop-blur-sm overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-[45%] rounded-full"></div>
                  </div>

                  <div className="text-xs md:text-sm text-amber-100 font-mono bg-amber-900/70 backdrop-blur-sm px-2 py-1 rounded">
                    45:23 / 1:42:15
                  </div>
                </div>
              </div>

              {/* "No session" placeholder */}
              {!isLive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur">
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl mb-4">📚</div>
                    <h3 className="text-lg md:text-xl font-bold text-amber-100 mb-2">
                      No Active Session
                    </h3>
                    <p className="text-xs md:text-sm text-amber-300/70">
                      Check schedule or watch recorded lectures
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Classroom Interaction Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-2 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-amber-50/90 backdrop-blur-md border-2 border-amber-300/60"
          >
            {/* Interaction Buttons */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <motion.button
                onClick={() => setHandRaised(!handRaised)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all
                  ${handRaised
                    ? "bg-amber-400 text-amber-900 shadow-lg"
                    : "bg-white/60 text-amber-800 border border-amber-200/60 hover:bg-amber-100/60"}
                `}
              >
                {handRaised ? "✋ Hand Raised" : "✋ Raise Hand"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-2 rounded-lg bg-white/60 border border-amber-200/60 text-amber-800 text-xs md:text-sm font-medium hover:bg-amber-100/60 transition"
              >
                💬 Ask Question
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-2 rounded-lg bg-white/60 border border-amber-200/60 text-amber-800 text-xs md:text-sm font-medium hover:bg-amber-100/60 transition"
              >
                📝 Take Notes
              </motion.button>
            </div>

            {/* Attendee Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 border border-amber-200/60">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 border-2 border-white flex items-center justify-center text-[10px]"
                  >
                    👤
                  </div>
                ))}
              </div>
              <span className="text-xs md:text-sm font-semibold text-amber-900">
                +{attendees} more
              </span>
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3"
          >
            {[
              { time: "Tomorrow 3PM", topic: "NFT Marketplace Deep Dive", duration: "2h" },
              { time: "Friday 6PM", topic: "Smart Contracts 101", duration: "1.5h" },
              { time: "Next Week", topic: "DeFi Strategies", duration: "2h" },
            ].map((session, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-xl bg-white/60 border border-amber-200/60 cursor-pointer hover:bg-amber-100/40 transition"
              >
                <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-amber-600 font-semibold mb-1">
                  {session.time} • {session.duration}
                </p>
                <h4 className="text-xs md:text-sm font-semibold text-amber-900">
                  {session.topic}
                </h4>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </RoomSection>
  );
}
