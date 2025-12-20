// src/sections/LightBedroom.jsx
// Personal Command Center - Multi-functional workspace with tabs
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoomSection from "../components/RoomSection";

export default function LightBedroom({ onToggleMode }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notes, setNotes] = useState([
    { id: 1, title: "Bitcoin Basics", content: "Key takeaways from today's lecture on blockchain fundamentals and consensus mechanisms.", date: "Dec 19", pinned: true },
    { id: 2, title: "Smart Contract Ideas", content: "Explored potential use cases: NFT marketplace, DAO governance, DeFi lending protocol.", date: "Dec 18", pinned: false },
  ]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [savedItems, setSavedItems] = useState([
    { id: 1, title: "DeFi Tutorial Series", type: "video", url: "https://youtube.com" },
    { id: 2, title: "Tokenomics Guide", type: "article", url: "#" },
    { id: 3, title: "NFT Marketplace Code", type: "code", url: "https://github.com" },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, text: "Complete Bitcoin fundamentals course", completed: true, dueDate: "Dec 20" },
    { id: 2, text: "Build first smart contract", completed: false, dueDate: "Dec 25" },
    { id: 3, text: "Understand DeFi protocols", completed: false, dueDate: "Dec 30" },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [resources] = useState([
    { id: 1, title: "Ethereum Developer Docs", category: "documentation", url: "https://ethereum.org/developers", type: "resource" },
    { id: 2, title: "Coinbase Learn", category: "tutorial", url: "https://coinbase.com/learn", type: "resource" },
    { id: 3, title: "CryptoZombies", category: "interactive", url: "https://cryptozombies.io", type: "resource" },
    { id: 4, title: "Web3 University", category: "course", url: "https://web3.university", type: "resource" },
    { id: 5, title: "Coinbase", category: "signup", url: "YOUR_COINBASE_REFERRAL_LINK_HERE", type: "signup" },
    { id: 6, title: "Binance", category: "signup", url: "YOUR_BINANCE_REFERRAL_LINK_HERE", type: "signup" },
    { id: 7, title: "Kraken", category: "signup", url: "YOUR_KRAKEN_REFERRAL_LINK_HERE", type: "signup" },
    { id: 8, title: "MetaMask", category: "signup", url: "YOUR_METAMASK_REFERRAL_LINK_HERE", type: "signup" },
  ]);
  const [donationAmount, setDonationAmount] = useState("10");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "saved", label: "Saved", icon: "🔖" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "donate", label: "Donate", icon: "💝" },
  ];

  const userStats = {
    videosWatched: 23,
    lecturesAttended: 7,
    notesTaken: notes.length,
    streak: 12
  };

  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([...notes, { 
        id: Date.now(), 
        ...newNote, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        pinned: false 
      }]);
      setNewNote({ title: "", content: "" });
    }
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { 
        id: Date.now(), 
        text: newGoal, 
        completed: false, 
        dueDate: "TBD" 
      }]);
      setNewGoal("");
    }
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
              Personal Command Center
            </h2>
            <p className="text-xs md:text-sm text-amber-800/80">
              Your workspace for learning, goals, and contributions
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold
                  transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? "bg-amber-400 text-amber-900 shadow-lg scale-105"
                    : "bg-amber-100/60 text-amber-700 hover:bg-amber-200/60"}
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <div className="min-h-[400px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100/50">
            <AnimatePresence mode="wait">
              
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {[
                    { label: "Videos", value: userStats.videosWatched, icon: "🎥" },
                    { label: "Lectures", value: userStats.lecturesAttended, icon: "📚" },
                    { label: "Notes", value: userStats.notesTaken, icon: "📝" },
                    { label: "Day Streak", value: userStats.streak, icon: "🔥" },
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 text-center border-2 border-amber-200/60 shadow-lg"
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-amber-900">{stat.value}</div>
                      <div className="text-[10px] text-amber-700/70 uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* NOTES TAB */}
              {activeTab === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {/* Add Note Form */}
                  <div className="bg-amber-100/60 rounded-xl p-4 border-2 border-amber-200/60">
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/70 border border-amber-200 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <textarea
                      placeholder="Write your note..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/70 border border-amber-200 text-sm mb-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      onClick={addNote}
                      className="px-4 py-2 rounded-lg bg-amber-400 text-amber-900 font-semibold text-sm hover:bg-amber-500 transition"
                    >
                      + Add Note
                    </button>
                  </div>

                  {/* Notes List */}
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/70 rounded-xl p-4 border-2 border-amber-200/60"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-amber-900">{note.title}</h3>
                        <div className="flex gap-2">
                          {note.pinned && <span className="text-amber-600">📌</span>}
                          <span className="text-xs text-amber-600">{note.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-amber-800">{note.content}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* SAVED TAB */}
              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {savedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/70 rounded-xl p-4 border-2 border-amber-200/60 flex items-center justify-between hover:bg-amber-50/70 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {item.type === "video" ? "🎥" : item.type === "article" ? "📄" : "💻"}
                        </span>
                        <div>
                          <h3 className="font-semibold text-amber-900">{item.title}</h3>
                          <span className="text-xs text-amber-600 capitalize">{item.type}</span>
                        </div>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-amber-400 text-amber-900 text-xs font-semibold hover:bg-amber-500 transition"
                      >
                        Open
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* RESOURCES TAB */}
              {activeTab === "resources" && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {resources.map((resource) => (
                    <motion.a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 border-2 border-amber-200/60 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{resource.type === "signup" ? "🎁" : "📚"}</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-300/60 text-amber-800 capitalize">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-amber-900 mb-1">{resource.title}</h3>
                      <p className="text-xs text-amber-700">
                        {resource.type === "signup" ? "Sign up with referral →" : "Click to open →"}
                      </p>
                    </motion.a>
                  ))}
                </motion.div>
              )}

              {/* GOALS TAB */}
              {activeTab === "goals" && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {/* Add Goal Form */}
                  <div className="bg-amber-100/60 rounded-xl p-4 border-2 border-amber-200/60 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new goal..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addGoal()}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/70 border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      onClick={addGoal}
                      className="px-4 py-2 rounded-lg bg-amber-400 text-amber-900 font-semibold text-sm hover:bg-amber-500 transition"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Goals List */}
                  {goals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        bg-white/70 rounded-xl p-4 border-2 border-amber-200/60 flex items-center gap-3
                        ${goal.completed ? "opacity-60" : ""}
                      `}
                    >
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                          ${goal.completed
                            ? "bg-green-400 border-green-500"
                            : "border-amber-300 hover:border-amber-400"}
                        `}
                      >
                        {goal.completed && <span className="text-white text-sm">✓</span>}
                      </button>
                      <div className="flex-1">
                        <p className={`font-semibold text-amber-900 ${goal.completed ? "line-through" : ""}`}>
                          {goal.text}
                        </p>
                        <span className="text-xs text-amber-600">Due: {goal.dueDate}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* DONATE TAB */}
              {activeTab === "donate" && (
                <motion.div
                  key="donate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 border-2 border-amber-300/60 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">💝</div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2">Support WOK360</h3>
                    <p className="text-sm text-amber-700">
                      Help us create more immersive content and experiences
                    </p>
                  </div>

                  {/* Donation Amount Selector */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {["5", "10", "25", "50"].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className={`
                          px-4 py-3 rounded-lg font-bold transition-all
                          ${donationAmount === amount
                            ? "bg-amber-400 text-amber-900 scale-105"
                            : "bg-white/70 text-amber-700 hover:bg-amber-200/60"}
                        `}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="mb-4">
                    <label className="text-xs text-amber-700 mb-1 block">Or enter custom amount:</label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/70 border-2 border-amber-200 text-lg font-bold text-amber-900 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="0"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2 mb-4">
                    <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
                      <span>💳</span>
                      Donate with Card
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
                      <span>₿</span>
                      Donate with Crypto
                    </button>
                  </div>

                  <p className="text-xs text-center text-amber-600">
                    All donations go directly to content creation and platform development
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
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
