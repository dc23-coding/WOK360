// src/worlds/studioBelt/StudioBeltWorld.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ViewingClub from "../../components/ViewingClub";

export default function StudioBeltWorld({ isPremium, onExitWorld }) {
  const [activeRoom, setActiveRoom] = useState(null);

  const rooms = [
    { id: "club", name: "Club Hollywood", icon: "🎭", description: "Cinema-style presence lounge" },
    { id: "recording", name: "Recording Studio", icon: "🎙️", description: "Professional audio recording" },
    { id: "production", name: "Video Production", icon: "🎬", description: "Video editing & production" },
    { id: "equipment", name: "Equipment Library", icon: "🎸", description: "Browse & reserve equipment" },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400/60">
              Creative Quarter
            </p>
            <p className="text-lg font-semibold text-white">
              Multiverse Studios
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12">
        {!activeRoom ? (
          // Room Selection Grid
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to Multiverse Studios
              </h1>
              <p className="text-lg text-slate-300">
                Professional recording, production, and collaboration spaces
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room, idx) => (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveRoom(room.id)}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 hover:border-purple-400 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                >
                  <div className="text-6xl mb-4">{room.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition">
                    {room.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {room.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-purple-400">
                    Enter Room
                    <span className="group-hover:translate-x-1 transition">→</span>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          // Active Room View
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setActiveRoom(null)}
              className="mb-6 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white text-sm transition"
            >
              ← Back to Rooms
            </button>

            <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30">
              {activeRoom === "club" && <ViewingClub variant="light" />}
              
              {activeRoom === "recording" && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🎙️</div>
                    <h2 className="text-3xl font-bold mb-4">Recording Studio</h2>
                    <p className="text-slate-400">Coming Soon</p>
                  </div>
                </div>
              )}

              {activeRoom === "production" && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🎬</div>
                    <h2 className="text-3xl font-bold mb-4">Video Production</h2>
                    <p className="text-slate-400">Coming Soon</p>
                  </div>
                </div>
              )}

              {activeRoom === "equipment" && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🎸</div>
                    <h2 className="text-3xl font-bold mb-4">Equipment Library</h2>
                    <p className="text-slate-400">Coming Soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
