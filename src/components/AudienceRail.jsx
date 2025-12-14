import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function AudienceRail({ users = [], reactions = [] }) {
  const [activeReactions, setActiveReactions] = useState({});

  // Listen for new reactions and animate avatars
  useEffect(() => {
    if (reactions.length === 0) return;

    const latestReaction = reactions[reactions.length - 1];
    const userId = latestReaction.userId;

    // Trigger glow animation for this user
    setActiveReactions(prev => ({ ...prev, [userId]: Date.now() }));

    // Remove glow after animation
    const timeout = setTimeout(() => {
      setActiveReactions(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [reactions]);

  // Ensure we display between 8-30 users
  const displayUsers = users.slice(0, 30);
  const minUsers = 8;
  
  // Fill with placeholder avatars if less than 8
  const filledUsers = [...displayUsers];
  while (filledUsers.length < minUsers) {
    filledUsers.push({
      id: `placeholder-${filledUsers.length}`,
      name: "Guest",
      avatar: null,
      isPlaceholder: true,
    });
  }

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (userId) => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-cyan-500 to-blue-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-cyan-500",
    ];
    const hash = userId?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  return (
    <div className="py-4 px-6 border-t border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/70 text-sm font-medium">
          Audience ({displayUsers.length})
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence mode="popLayout">
          {filledUsers.map((user, index) => {
            const isReacting = activeReactions[user.id];
            const isPlaceholder = user.isPlaceholder;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isPlaceholder ? 0.3 : 1,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                className="relative group"
              >
                {/* Avatar Circle */}
                <motion.div
                  animate={{
                    opacity: isReacting ? [1, 0.7, 1] : 1,
                    scale: isReacting ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${getAvatarColor(user.id)}
                    ${isReacting ? "ring-4 ring-white/50" : ""}
                    transition-all duration-300
                    cursor-pointer
                  `}
                  style={{
                    boxShadow: isReacting
                      ? "0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)"
                      : "0 0 10px rgba(0, 0, 0, 0.3)",
                  }}
                  title={user.name}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {getInitials(user.name)}
                    </span>
                  )}
                </motion.div>

                {/* Reaction Burst Effect */}
                {isReacting && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-white/30 pointer-events-none"
                  />
                )}

                {/* Tooltip on hover */}
                {!isPlaceholder && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {user.name}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
