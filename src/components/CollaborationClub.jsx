// src/components/CollaborationClub.jsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function CollaborationClub({ variant = "dark" }) {
  const [isLive, setIsLive] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [mainSpeaker, setMainSpeaker] = useState(null);
  const videoRef = useRef(null);

  const isDark = variant === "dark";

  // Mock participants for demo (replace with actual video feed integration)
  const mockParticipants = [
    { id: 1, name: "Professor Cle", avatar: "👨‍🏫", isHost: true },
    { id: 2, name: "Guest Speaker", avatar: "🎤" },
    { id: 3, name: "Community Member", avatar: "👤" },
    { id: 4, name: "VIP Guest", avatar: "⭐" },
    { id: 5, name: "Attendee", avatar: "👥" },
    { id: 6, name: "Moderator", avatar: "🛡️" },
  ];

  useEffect(() => {
    if (isLive) {
      setParticipants(mockParticipants);
      setMainSpeaker(mockParticipants[0]);
    } else {
      setParticipants([]);
      setMainSpeaker(null);
    }
  }, [isLive]);

  const colors = isDark
    ? {
        bg: "bg-slate-900",
        border: "border-cyan-400/50",
        accent: "bg-cyan-500",
        text: "text-cyan-100",
        glow: "shadow-[0_0_40px_rgba(34,211,238,0.4)]",
      }
    : {
        bg: "bg-amber-50",
        border: "border-amber-400/50",
        accent: "bg-amber-500",
        text: "text-amber-900",
        glow: "shadow-[0_0_40px_rgba(251,191,36,0.4)]",
      };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${colors.text}`}>
            🎭 Collaboration Club
          </h2>
          <p className={`text-sm ${colors.text} opacity-70`}>
            {isLive
              ? `Live Now • ${participants.length} Participants`
              : "Room Offline • Start Live Session"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLive(!isLive)}
          className={`
            px-6 py-3 rounded-full font-semibold transition-all
            ${isLive
              ? `${colors.accent} text-white ${colors.glow} hover:scale-105`
              : `${colors.bg} ${colors.border} border ${colors.text} hover:${colors.accent} hover:text-white`
            }
          `}
        >
          {isLive ? "🔴 End Session" : "▶ Go Live"}
        </button>
      </div>

      {/* Main Stage Area */}
      <div className="flex-1 flex gap-4">
        {/* Main Speaker Display */}
        <div className="flex-1 flex flex-col gap-3">
          <div
            className={`
            relative flex-1 rounded-2xl overflow-hidden
            ${colors.border} border-2 ${colors.glow}
            ${isLive ? colors.bg : "bg-black/50"}
          `}
          >
            {isLive && mainSpeaker ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Placeholder for main video feed */}
                <div className="text-center">
                  <div className="text-8xl mb-4">{mainSpeaker.avatar}</div>
                  <p className={`text-xl font-semibold ${colors.text}`}>
                    {mainSpeaker.name}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-300">LIVE</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center opacity-50">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className={`${colors.text}`}>Main Stage</p>
                  <p className={`text-xs ${colors.text} opacity-70 mt-2`}>
                    Waiting for live session...
                  </p>
                </div>
              </div>
            )}

            {/* Main Speaker Controls Overlay */}
            {isLive && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white hover:bg-black/80 flex items-center justify-center">
                  🎤
                </button>
                <button className="w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white hover:bg-black/80 flex items-center justify-center">
                  📹
                </button>
                <button className="w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white hover:bg-black/80 flex items-center justify-center">
                  🖥️
                </button>
              </div>
            )}
          </div>

          {/* Room Controls */}
          {isLive && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
              <button className={`flex-1 py-2 rounded-lg ${colors.accent}/20 hover:${colors.accent}/30 ${colors.text} text-sm font-medium transition`}>
                💬 Open Chat
              </button>
              <button className={`flex-1 py-2 rounded-lg ${colors.accent}/20 hover:${colors.accent}/30 ${colors.text} text-sm font-medium transition`}>
                ✋ Raise Hand
              </button>
              <button className={`flex-1 py-2 rounded-lg ${colors.accent}/20 hover:${colors.accent}/30 ${colors.text} text-sm font-medium transition`}>
                👥 Invite Users
              </button>
            </div>
          )}
        </div>

        {/* Participant Grid (Right Side) */}
        <div className="w-80 flex flex-col gap-3">
          <div className={`px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border`}>
            <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
              Participants ({participants.length})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isLive ? (
              participants.map((participant, idx) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`
                    relative aspect-video rounded-xl overflow-hidden
                    ${colors.border} border ${colors.bg}
                    hover:${colors.glow} transition-all cursor-pointer
                    ${mainSpeaker?.id === participant.id ? colors.glow : ""}
                  `}
                  onClick={() => setMainSpeaker(participant)}
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center">
                      <div className="text-4xl">{participant.avatar}</div>
                    </div>
                  </div>

                  {/* Participant Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white truncate">
                        {participant.name}
                      </p>
                      {participant.isHost && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/80 text-white">
                          HOST
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Speaker Indicator */}
                  {mainSpeaker?.id === participant.id && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-2 h-2 rounded-full ${colors.accent} animate-pulse`} />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center opacity-50">
                <div className="text-center">
                  <p className={`text-sm ${colors.text}`}>No participants yet</p>
                  <p className={`text-xs ${colors.text} opacity-70 mt-1`}>
                    Start a session to see participants
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {isLive && (
            <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border space-y-2`}>
              <button className="w-full py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 text-xs font-medium transition">
                📸 Take Snapshot
              </button>
              <button className="w-full py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 text-xs font-medium transition">
                🎥 Start Recording
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className={`text-center text-xs ${colors.text} opacity-60`}>
        <p>
          {isLive
            ? "Live collaboration in progress • Click participant to feature on main stage"
            : "Start a live session to enable video feeds and collaboration features"}
        </p>
      </div>
    </div>
  );
}
