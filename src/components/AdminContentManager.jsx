// src/components/AdminContentManager.jsx
// Admin Content Management Interface - DJ Crates Style
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Video, Image as ImageIcon, Trash2, Eye, EyeOff, Check, Upload } from "lucide-react";
import { sanityClient } from "../lib/sanityClient";
import { Button } from "./ui/button";
import ContentUploader from "../admin/ContentUploader";
import { useZoneContext } from "../context/ZoneContext";

const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || "3104";

export default function AdminContentManager() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, audio, video
  const [updating, setUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState("manage"); // "manage" | "upload"
  const { currentZone, currentWing } = useZoneContext();

  // Check admin status
  useEffect(() => {
    const adminUnlocked = localStorage.getItem('adminUnlocked') === 'true';
    setIsAdmin(adminUnlocked);
    if (adminUnlocked) {
      fetchAllContent();
    }
  }, []);

  const handleAdminUnlock = (code) => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
      localStorage.setItem('adminUnlocked', 'true');
      setShowKeypad(false);
      fetchAllContent();
    }
  };

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const data = await sanityClient.fetch(
        `*[_type == "mediaContent"] | order(_createdAt desc) {
          _id,
          _createdAt,
          title,
          subtitle,
          zone,
          wing,
          room,
          contentType,
          accessLevel,
          featured,
          "thumbnailUrl": thumbnail.asset->url,
          "mediaUrl": mediaFile.asset->url,
          duration,
          tags
        }`
      );
      setContent(data || []);
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateContentLocation = async (contentId, newRoom) => {
    setUpdating(contentId);
    try {
      await sanityClient
        .patch(contentId)
        .set({ room: newRoom })
        .commit();
      
      // Update local state
      setContent(prev => prev.map(item => 
        item._id === contentId ? { ...item, room: newRoom } : item
      ));
    } catch (err) {
      console.error("Failed to update location:", err);
      alert("Failed to update location");
    } finally {
      setUpdating(null);
    }
  };

  const toggleFeatured = async (contentId, currentFeatured) => {
    setUpdating(contentId);
    try {
      await sanityClient
        .patch(contentId)
        .set({ featured: !currentFeatured })
        .commit();
      
      setContent(prev => prev.map(item => 
        item._id === contentId ? { ...item, featured: !currentFeatured } : item
      ));
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    } finally {
      setUpdating(null);
    }
  };

  const deleteContent = async (contentId) => {
    if (!confirm("Delete this content permanently?")) return;
    
    setUpdating(contentId);
    try {
      await sanityClient.delete(contentId);
      setContent(prev => prev.filter(item => item._id !== contentId));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete content");
    } finally {
      setUpdating(null);
    }
  };

  const filteredContent = content.filter(item => {
    if (filter === "all") return true;
    return item.contentType === filter;
  });

  // Admin unlock UI
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-cyan-400 mb-4">Admin Access Required</p>
          {!showKeypad ? (
            <Button
              onClick={() => setShowKeypad(true)}
              className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
            >
              🔒 Unlock Control Room
            </Button>
          ) : (
            <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <input
                type="password"
                placeholder="Enter admin code"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAdminUnlock(e.target.value);
                  }
                }}
                className="px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Content Control Room</h2>
        <p className="text-sm text-cyan-300/70">Upload and manage content across all zones</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
            activeTab === "upload"
              ? "bg-cyan-500 text-black"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload New
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
            activeTab === "manage"
              ? "bg-cyan-500 text-black"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          }`}
        >
          Manage ({content.length})
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-6 mb-6">
          <ContentUploader 
            currentZone={currentZone}
            currentWing={currentWing}
            onUploadComplete={() => {
              fetchAllContent();
              setActiveTab("manage");
            }}
          />
        </div>
      )}

      {/* Manage Tab */}
      {activeTab === "manage" && (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs transition ${
            filter === "all"
              ? "bg-cyan-500 text-black"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          }`}
        >
          All ({content.length})
        </button>
        <button
          onClick={() => setFilter("audio")}
          className={`px-4 py-2 rounded-full text-xs transition ${
            filter === "audio"
              ? "bg-cyan-500 text-black"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          }`}
        >
          <Music className="w-3 h-3 inline mr-1" />
          Audio ({content.filter(c => c.contentType === "audio").length})
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-4 py-2 rounded-full text-xs transition ${
            filter === "video"
              ? "bg-cyan-500 text-black"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
          }`}
        >
          <Video className="w-3 h-3 inline mr-1" />
          Video ({content.filter(c => c.contentType === "video").length})
        </button>
        <button
          onClick={fetchAllContent}
          className="ml-auto px-4 py-2 rounded-full text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition"
        >
          Refresh
        </button>
      </div>

      {/* Content List - DJ Crates Style */}
      {loading ? (
        <div className="text-center text-cyan-400 py-12">Loading content...</div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center text-cyan-400/60 py-12">
          <p>No content uploaded yet</p>
          <p className="text-xs mt-2">Use the Admin Upload button to add content</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredContent.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-cyan-500/10 rounded flex items-center justify-center flex-shrink-0">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover rounded" />
                    ) : item.contentType === "audio" ? (
                      <Music className="w-8 h-8 text-cyan-400" />
                    ) : (
                      <Video className="w-8 h-8 text-cyan-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-cyan-400/70 truncate">{item.subtitle}</p>
                    )}
                    <div className="flex gap-2 mt-2 text-[10px]">
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">
                        {item.contentType}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                        {item.wing}
                      </span>
                      {item.accessLevel === "premium" && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                          Premium
                        </span>
                      )}
                      {item.featured && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Location Selector */}
                    <div className="mt-3">
                      <label className="text-[10px] text-cyan-400/70 uppercase tracking-wide block mb-1">
                        Display Location:
                      </label>
                      <select
                        value={item.room || ""}
                        onChange={(e) => updateContentLocation(item._id, e.target.value)}
                        disabled={updating === item._id}
                        className="text-xs bg-black/50 border border-cyan-500/30 rounded px-2 py-1 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">-- Not Published --</option>
                        <option value="music-room">🎵 Music Room</option>
                        <option value="studio">🎙️ Studio</option>
                        <option value="bedroom">🛏️ Bedroom</option>
                        <option value="photo-gallery">🖼️ Photo Gallery</option>
                        <option value="merch-shop">🛍️ Merch Shop</option>
                        <option value="playroom">🎮 Playroom (Dark)</option>
                        <option value="featured">⭐ Featured/Homepage</option>
                        <optgroup label="Club Hollywood">
                          <option value="club-main-stage">🎭 Main Stage</option>
                          <option value="club-vip">💎 VIP Lounge</option>
                          <option value="club-dance-floor">🕺 Dance Floor</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleFeatured(item._id, item.featured)}
                      disabled={updating === item._id}
                      className={`p-2 rounded transition ${
                        item.featured
                          ? "bg-green-500/20 text-green-400"
                          : "bg-cyan-500/10 text-cyan-400/60 hover:bg-cyan-500/20"
                      }`}
                      title={item.featured ? "Remove from featured" : "Mark as featured"}
                    >
                      {item.featured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteContent(item._id)}
                      disabled={updating === item._id}
                      className="p-2 rounded bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition"
                      title="Delete content"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {updating === item._id && (
                  <div className="mt-2 text-xs text-cyan-400">Updating...</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
        </>
      )}
    </div>
  );
}
