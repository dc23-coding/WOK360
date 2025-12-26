// src/worlds/arcaneTower/ArcaneTowerWorld.jsx
// Arcane Tower - Progression Hub & Achievement System
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, TrendingUp, Gift, X, Lock } from "lucide-react";
import { getCurrentUser, hasZoneAccess } from "../../lib/zoneAccessControl";

export default function ArcaneTowerWorld({ onExitWorld }) {
  const [activeZone, setActiveZone] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    const user = await getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user progression data from Supabase
    // This will track activity across all worlds
    setUserProgress({
      totalVisits: 0,
      worldsUnlocked: ["kazmo-mansion"],
      achievementsEarned: [],
      currentLevel: 1,
      experiencePoints: 0,
      badges: [],
      // Track progression per world
      worlds: {
        "kazmo-mansion": { visits: 0, timeSpent: 0, completed: [] },
        "club-hollywood": { visits: 0, timeSpent: 0, completed: [] },
        "shadow-market": { visits: 0, timeSpent: 0, completed: [] },
        "chakra-center": { visits: 0, timeSpent: 0, completed: [] },
      }
    });
    setLoading(false);
  };

  const zones = [
    {
      id: "achievement-gallery",
      name: "Achievement Gallery",
      description: "View your badges, honors, and milestones earned across all worlds",
      icon: Award,
      color: "purple",
      available: true,
    },
    {
      id: "progress-tracker",
      name: "Progress Tracker",
      description: "Analytics and stats tracking your growth across all dimensions",
      icon: TrendingUp,
      color: "blue",
      available: true,
    },
    {
      id: "rewards-vault",
      name: "Rewards Vault",
      description: "Claim unlockables, perks, and special access you've earned",
      icon: Gift,
      color: "amber",
      available: true,
    },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your progression data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-purple-500/20 backdrop-blur-md bg-black/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              The Arcane Tower
            </h1>
            <p className="text-sm text-white/60 mt-1">Track your journey across all dimensions</p>
          </div>
          <div className="flex items-center gap-4">
            {userProgress && (
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <span className="text-sm font-semibold text-purple-300">Level {userProgress.currentLevel}</span>
                <span className="text-xs text-white/60 ml-2">{userProgress.experiencePoints} XP</span>
              </div>
            )}
            <button
              onClick={onExitWorld}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6 text-white/80" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6">
        {!activeZone ? (
          // Zone Selection Hub
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {zones.map((zone) => (
              <motion.button
                key={zone.id}
                onClick={() => zone.available && setActiveZone(zone.id)}
                disabled={!zone.available}
                whileHover={zone.available ? { scale: 1.02, y: -4 } : {}}
                className={`relative p-8 rounded-2xl border backdrop-blur-md transition-all ${
                  zone.available
                    ? `border-${zone.color}-500/30 bg-${zone.color}-950/30 hover:border-${zone.color}-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]`
                    : "border-slate-700/30 bg-slate-900/30 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    zone.available ? `bg-${zone.color}-500/20` : "bg-slate-700/20"
                  }`}>
                    <zone.icon className={`w-8 h-8 ${
                      zone.available ? `text-${zone.color}-400` : "text-slate-500"
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{zone.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{zone.description}</p>
                  {!zone.available && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-semibold">Coming Soon</span>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          // Active Zone Content
          <div className="mt-8">
            <button
              onClick={() => setActiveZone(null)}
              className="mb-6 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-white/5 rounded-lg transition"
            >
              ← Back to Tower Hub
            </button>

            {activeZone === "achievement-gallery" && (
              <AchievementGallery userProgress={userProgress} />
            )}

            {activeZone === "progress-tracker" && (
              <ProgressTracker userProgress={userProgress} />
            )}

            {activeZone === "rewards-vault" && (
              <RewardsVault userProgress={userProgress} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Achievement Gallery Component
function AchievementGallery({ userProgress }) {
  const achievements = [
    { id: "first-visit", name: "First Steps", description: "Entered the WOK360 universe", earned: true, rarity: "common" },
    { id: "mansion-explorer", name: "Mansion Explorer", description: "Visited all rooms in Kazmo Mansion", earned: false, rarity: "rare" },
    { id: "club-regular", name: "Club Regular", description: "Attended 5 Club Hollywood events", earned: false, rarity: "rare" },
    { id: "wellness-warrior", name: "Wellness Warrior", description: "Completed 7-day Chakra Center streak", earned: false, rarity: "epic" },
    { id: "shadow-trader", name: "Shadow Trader", description: "Made your first Shadow Market purchase", earned: false, rarity: "rare" },
    { id: "premium-elite", name: "Premium Elite", description: "Unlocked premium access", earned: false, rarity: "legendary" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Achievement Gallery</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-xl border backdrop-blur-md ${
              achievement.earned
                ? "border-purple-500/30 bg-purple-950/30"
                : "border-slate-700/30 bg-slate-900/30 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Award className={`w-8 h-8 ${
                achievement.earned ? "text-purple-400" : "text-slate-600"
              }`} />
              <span className={`text-xs px-2 py-1 rounded-full ${
                achievement.rarity === "legendary" ? "bg-amber-500/20 text-amber-400" :
                achievement.rarity === "epic" ? "bg-purple-500/20 text-purple-400" :
                achievement.rarity === "rare" ? "bg-blue-500/20 text-blue-400" :
                "bg-slate-500/20 text-slate-400"
              }`}>
                {achievement.rarity}
              </span>
            </div>
            <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
            <p className="text-sm text-white/60">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Tracker Component
function ProgressTracker({ userProgress }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Progress Tracker</h2>
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-950/30 backdrop-blur-md">
            <p className="text-sm text-white/60 mb-1">Total Visits</p>
            <p className="text-3xl font-bold text-purple-400">{userProgress?.totalVisits || 0}</p>
          </div>
          <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-950/30 backdrop-blur-md">
            <p className="text-sm text-white/60 mb-1">Worlds Unlocked</p>
            <p className="text-3xl font-bold text-blue-400">{userProgress?.worldsUnlocked?.length || 0}</p>
          </div>
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-950/30 backdrop-blur-md">
            <p className="text-sm text-white/60 mb-1">Achievements</p>
            <p className="text-3xl font-bold text-amber-400">{userProgress?.achievementsEarned?.length || 0}</p>
          </div>
          <div className="p-6 rounded-xl border border-green-500/30 bg-green-950/30 backdrop-blur-md">
            <p className="text-sm text-white/60 mb-1">Current Level</p>
            <p className="text-3xl font-bold text-green-400">{userProgress?.currentLevel || 1}</p>
          </div>
        </div>

        {/* Per-World Progress */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">World Activity</h3>
          <div className="space-y-3">
            {Object.entries(userProgress?.worlds || {}).map(([worldId, data]) => (
              <div key={worldId} className="p-4 rounded-lg border border-slate-700/30 bg-slate-900/30 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white capitalize">{worldId.replace(/-/g, ' ')}</span>
                  <span className="text-sm text-white/60">{data.visits} visits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Rewards Vault Component
function RewardsVault({ userProgress }) {
  const rewards = [
    { id: "dark-wing-access", name: "Dark Wing Access", description: "Unlock Kazmo Mansion's Dark Wing", unlocked: false, type: "access" },
    { id: "premium-content", name: "Premium Content Pack", description: "Exclusive videos and audio tracks", unlocked: false, type: "content" },
    { id: "vip-badge", name: "VIP Badge", description: "Display your VIP status across all worlds", unlocked: false, type: "cosmetic" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Rewards Vault</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`p-6 rounded-xl border backdrop-blur-md ${
              reward.unlocked
                ? "border-amber-500/30 bg-amber-950/30"
                : "border-slate-700/30 bg-slate-900/30"
            }`}
          >
            <Gift className={`w-8 h-8 mb-4 ${reward.unlocked ? "text-amber-400" : "text-slate-600"}`} />
            <h3 className="font-bold text-white mb-2">{reward.name}</h3>
            <p className="text-sm text-white/60 mb-4">{reward.description}</p>
            <button
              disabled={!reward.unlocked}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                reward.unlocked
                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  : "bg-slate-700/20 text-slate-600 cursor-not-allowed"
              }`}
            >
              {reward.unlocked ? "Claim Reward" : "Locked"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
