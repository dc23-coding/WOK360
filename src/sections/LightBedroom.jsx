// src/sections/LightBedroom.jsx
// Personal Crypto Learning Dashboard - Behind-the-scenes command center
import { useState } from "react";
import { motion } from "framer-motion";
import RoomSection from "../components/RoomSection";
import { useZoneContent } from "../hooks/useZoneContent";
import StoryPanelRail from "../components/StoryPanelRail";

export default function LightBedroom({ onToggleMode }) {
  const [activeFeed, setActiveFeed] = useState("dashboard");
  const [selectedLecture, setSelectedLecture] = useState(null);
  
  // Fetch Sanity content for this room
  const { content, loading } = useZoneContent('kazmo', 'light');

  // Upcoming crypto lectures
  const upcomingLectures = [
    { 
      id: 1, 
      title: "Bitcoin Fundamentals", 
      date: "Dec 20", 
      time: "3:00 PM", 
      duration: "2h",
      instructor: "Prof. Cle",
      enrolled: 42
    },
    { 
      id: 2, 
      title: "Smart Contracts Deep Dive", 
      date: "Dec 22", 
      time: "6:00 PM", 
      duration: "1.5h",
      instructor: "Prof. Cle",
      enrolled: 38
    },
    { 
      id: 3, 
      title: "DeFi Strategies", 
      date: "Dec 25", 
      time: "4:00 PM", 
      duration: "2h",
      instructor: "Prof. Cle",
      enrolled: 51
    },
  ];

  // Community chat messages
  const chatMessages = [
    { user: "CryptoKing", msg: "Great lecture today! Questions about gas fees?", time: "2m ago" },
    { user: "BlockchainBob", msg: "Anyone attending the DeFi session Friday?", time: "5m ago" },
    { user: "Web3Wizard", msg: "Just finished the NFT course - amazing! 🚀", time: "12m ago" },
  ];

  // User stats
  const userStats = {
    videosWatched: 23,
    lecturesAttended: 7,
    notesTaken: 15,
    streak: 12
  };

  return (
    <RoomSection bg="/Bedroon_Light.png" className="bg-white" id="light-bedroom">
      <div className="relative w-full h-full flex items-center justify-center px-4 py-8 md:py-0">
        
        {/* Main Container */}
        <div className="w-full max-w-6xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 md:mb-6"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 mb-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-semibold">
                🔒 Your Command Center
              </p>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-amber-900 mb-1">
              Crypto Learning Dashboard
            </h2>
            <p className="text-xs md:text-sm text-amber-800/80">
              Track progress • Schedule lectures • Connect with community
            </p>
          </motion.div>

          {/* Dashboard Grid - 2 columns on desktop, stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            
            {/* LEFT COLUMN */}
            <div className="space-y-3 md:space-y-4">
              
              {/* Personal Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-300/60 p-4 md:p-5 shadow-lg"
              >
                <h3 className="text-sm md:text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
                  📊 Your Progress
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Videos", value: userStats.videosWatched, icon: "🎥" },
                    { label: "Lectures", value: userStats.lecturesAttended, icon: "📚" },
                    { label: "Notes", value: userStats.notesTaken, icon: "📝" },
                    { label: "Day Streak", value: userStats.streak, icon: "🔥" },
                  ].map((stat, idx) => (
                    <div 
                      key={idx}
                      className="bg-white/70 rounded-lg p-3 text-center border border-amber-200/50"
                    >
                      <div className="text-xl md:text-2xl mb-1">{stat.icon}</div>
                      <div className="text-lg md:text-2xl font-bold text-amber-900">
                        {stat.value}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-amber-700/70 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lecture Scheduler */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-amber-50/90 rounded-2xl border-2 border-amber-300/60 p-4 md:p-5 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm md:text-base font-bold text-amber-900 flex items-center gap-2">
                    📅 Upcoming Lectures
                  </h3>
                  <button className="text-[10px] px-2 py-1 rounded-full bg-amber-200/60 text-amber-800 hover:bg-amber-300/60 transition">
                    View All
                  </button>
                </div>
                <div className="space-y-2 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                  {upcomingLectures.map((lecture) => (
                    <motion.div
                      key={lecture.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all
                        ${selectedLecture?.id === lecture.id
                          ? "bg-amber-300/60 border-2 border-amber-400"
                          : "bg-white/60 border border-amber-200/60 hover:bg-amber-100/40"}
                      `}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-xs md:text-sm font-semibold text-amber-900 flex-1">
                          {lecture.title}
                        </h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 ml-2">
                          {lecture.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-amber-700/70">
                        <span>📆 {lecture.date}</span>
                        <span>•</span>
                        <span>🕐 {lecture.time}</span>
                        <span>•</span>
                        <span>👥 {lecture.enrolled}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button 
                          className="flex-1 px-2 py-1 rounded text-[9px] md:text-[10px] font-medium bg-amber-400 text-amber-900 hover:bg-amber-500 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Reminder set for ${lecture.title}`);
                          }}
                        >
                          🔔 Remind Me
                        </button>
                        <button 
                          className="flex-1 px-2 py-1 rounded text-[9px] md:text-[10px] font-medium bg-white/60 text-amber-800 border border-amber-200 hover:bg-amber-100/60 transition"
                        >
                          ℹ️ Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-3 md:space-y-4">
              
              {/* Community Chat */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-amber-50/90 rounded-2xl border-2 border-amber-300/60 p-4 md:p-5 shadow-lg h-[300px] md:h-[400px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm md:text-base font-bold text-amber-900 flex items-center gap-2">
                    💬 Community Chat
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </h3>
                  <span className="text-[10px] text-amber-700/70">
                    127 online
                  </span>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 space-y-2 overflow-y-auto mb-3">
                  {chatMessages.map((chat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/70 rounded-lg p-2.5 border border-amber-200/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] md:text-xs font-semibold text-amber-900">
                          {chat.user}
                        </span>
                        <span className="text-[8px] md:text-[9px] text-amber-600/60">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-amber-800/90">
                        {chat.msg}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question or share thoughts..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/70 border border-amber-200/60 text-xs text-amber-900 placeholder:text-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button className="px-3 py-2 rounded-lg bg-amber-400 text-amber-900 font-bold hover:bg-amber-500 transition text-sm">
                    →
                  </button>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-2 md:gap-3"
              >
                {[
                  { icon: "📝", label: "My Notes", color: "from-blue-100 to-blue-50" },
                  { icon: "🔖", label: "Saved", color: "from-green-100 to-green-50" },
                  { icon: "📚", label: "Resources", color: "from-purple-100 to-purple-50" },
                  { icon: "🎯", label: "Goals", color: "from-orange-100 to-orange-50" },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      bg-gradient-to-br ${action.color}
                      rounded-xl border-2 border-amber-200/60
                      p-4 text-center
                      hover:shadow-lg transition-all
                    `}
                  >
                    <div className="text-2xl md:text-3xl mb-1">{action.icon}</div>
                    <div className="text-xs md:text-sm font-semibold text-amber-900">
                      {action.label}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

            </div>
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <p className="text-[10px] md:text-xs text-amber-700/70 mb-2">
              Ready for advanced crypto content and live trading sessions?
            </p>
            <button
              onClick={onToggleMode}
              className="px-4 md:px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-cyan-300 text-xs md:text-sm font-semibold hover:shadow-lg transition"
            >
              🌙 Switch to Night Wing
            </button>
          </motion.div>

        </div>
      </div>
    </RoomSection>
  );
}
