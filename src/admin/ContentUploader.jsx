// src/admin/ContentUploader.jsx
// Admin-only content upload interface for WOK360
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { sanityClient } from "../lib/sanityClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || "3104";

// Props allow zone/wing context to be passed from parent
export default function ContentUploader({ currentZone = null, currentWing = null, onUploadComplete = null }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Check if admin is already unlocked in localStorage
  useEffect(() => {
    const adminUnlocked = localStorage.getItem('adminUnlocked') === 'true';
    setIsAdmin(adminUnlocked);
  }, []);

  const handleAdminUnlock = (code) => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
      localStorage.setItem('adminUnlocked', 'true');
      setShowKeypad(false);
    }
  };
  // Auto-detect access level based on zone/wing
  // Light Wing = Premium, Dark Wing = Public, Shadow Market = Premium
  const getDefaultAccessLevel = () => {
    if (currentZone === 'shadowMarket') return 'premium';
    if (currentWing === 'light') return 'premium';
    return 'public';
  };

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    zone: currentZone || "kazmo",
    wing: currentWing || "light",
    room: "music-room",
    contentType: "video",
    accessLevel: getDefaultAccessLevel(),
    featured: false,
    isLive: false,
    duration: "",
    tags: "",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // If not admin, show unlock button
  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        {!showKeypad ? (
          <button
            onClick={() => setShowKeypad(true)}
            className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full text-white text-sm hover:shadow-lg transition-all"
            title="Admin Access"
          >
            🔒 Admin
          </button>
        ) : (
          <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cyan-400">Enter Code</h3>
              <button
                onClick={() => setShowKeypad(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Input
              type="password"
              placeholder="Enter admin code"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdminUnlock(e.target.value);
                }
              }}
              className="bg-black/50 border-cyan-500/30 text-white"
              autoFocus
            />
          </div>
        )}
      </motion.div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image files before setting state
    if (fileType === "thumbnail") {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        setUploadStatus({
          type: "error",
          message: `Invalid format: ${file.type}. Only JPG, PNG, GIF, WebP allowed.`
        });
        e.target.value = ""; // Clear the input
        return;
      }

      // Check file signature (magic bytes) for common corruptions
      try {
        const buffer = await file.slice(0, 4).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Valid image signatures
        const validSignatures = [
          'ffd8ff',   // JPEG
          '89504e47', // PNG
          '47494638', // GIF
          '52494646', // WEBP (RIFF)
        ];
        
        const isValid = validSignatures.some(sig => hex.startsWith(sig));
        if (!isValid) {
          setUploadStatus({
            type: "error",
            message: "File is corrupted or not a real image. Try a different file."
          });
          e.target.value = "";
          return;
        }
      } catch (err) {
        console.error('File signature check failed:', err);
      }

      // Additional check: verify file can be read as an image
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          const timeout = setTimeout(() => reject(new Error("Image load timeout")), 5000);
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("File is not a valid image"));
          };
          img.src = URL.createObjectURL(file);
        });
        setThumbnailFile(file);
        setUploadStatus(null); // Clear any previous errors
      } catch (err) {
        setUploadStatus({
          type: "error",
          message: "Cannot load image. File may be corrupted. Try converting to JPG."
        });
        e.target.value = ""; // Clear the input
        return;
      }
    } else if (fileType === "media") {
      setMediaFile(file);
    }
  };

  const uploadFile = async (file, fileType) => {
    // Validate file type and size
    if (fileType === "image") {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        throw new Error(`Invalid image format: ${file.type}. Please use JPG, PNG, GIF, or WebP.`);
      }
      
      // Check file size (max 10MB for images)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Image too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 10MB.`);
      }
    }

    const formData = new FormData();
    formData.append("file", file);

    // Upload to Sanity assets
    const url = `https://${import.meta.env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v2021-03-25/assets/${fileType}s/${import.meta.env.VITE_SANITY_DATASET}`;
    
    console.log(`Uploading ${fileType}: ${file.name} (${file.type}) to ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SANITY_AUTH_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Upload failed for ${fileType}:`, errorData);
      throw new Error(`Failed to upload ${fileType}: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.document._id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus({ type: "loading", message: "Uploading content..." });

    try {
      // Upload media file
      let mediaAssetId = null;
      if (mediaFile && !formData.isLive) {
        setUploadStatus({ type: "loading", message: "Uploading media file..." });
        // Always use 'file' for media uploads (video, audio, etc.)
        mediaAssetId = await uploadFile(mediaFile, "file");
      }

      // Upload thumbnail (optional, but with error handling)
      let thumbnailAssetId = null;
      if (thumbnailFile) {
        try {
          setUploadStatus({ type: "loading", message: "Uploading thumbnail..." });
          thumbnailAssetId = await uploadFile(thumbnailFile, "image");
        } catch (thumbError) {
          console.error("Thumbnail upload failed:", thumbError);
          // Show warning but continue - thumbnail is optional
          setUploadStatus({ 
            type: "warning", 
            message: `Thumbnail upload failed: ${thumbError.message}. Continuing without thumbnail...` 
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Brief pause to show message
        }
      }

      // Create document in Sanity
      setUploadStatus({ type: "loading", message: "Creating document..." });
      const doc = {
        _type: "mediaContent",
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        zone: formData.zone,
        wing: formData.wing,
        room: formData.room,
        contentType: formData.contentType,
        accessLevel: formData.accessLevel,
        featured: formData.featured,
        isLive: formData.isLive,
        duration: formData.duration,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };

      // Only add thumbnail if uploaded
      if (thumbnailAssetId) {
        doc.thumbnail = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: thumbnailAssetId,
          },
        };
      }

      if (mediaAssetId) {
        doc.mediaFile = {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: mediaAssetId,
          },
        };
      }

      if (formData.isLive && formData.liveStreamUrl) {
        doc.liveStreamUrl = formData.liveStreamUrl;
      }

      await sanityClient.create(doc);

      setUploadStatus({ type: "success", message: "Content uploaded successfully!" });
      
      // Notify parent if callback provided
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // Reset form but maintain zone/wing context
      setTimeout(() => {
        setFormData({
          title: "",
          subtitle: "",
          description: "",
          zone: currentZone || "kazmo",
          wing: currentWing || "light",
          room: "music-room",
          contentType: "video",
          accessLevel: getDefaultAccessLevel(),
          featured: false,
          isLive: false,
          duration: "",
          tags: "",
        });
        setMediaFile(null);
        setThumbnailFile(null);
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: `Upload failed: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <details className="group">
        <summary className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
          <Upload className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Admin Upload</span>
        </summary>

        <div className="absolute bottom-full right-0 mb-4 w-[500px] max-h-[80vh] overflow-y-auto bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-cyan-400">Upload Content</h3>
            <button
              onClick={() => document.querySelector("details").removeAttribute("open")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Indicator - Shows where content will be uploaded */}
          {currentZone && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyan-400">📍 Uploading to:</span>
                <span className="text-white font-semibold">
                  {currentZone === 'kazmo' && 'Kazmo Mansion'}
                  {currentZone === 'clubHollywood' && 'Club Hollywood'}
                  {currentZone === 'shadowMarket' && 'Shadow Market'}
                  {currentWing && ` • ${currentWing === 'light' ? 'Light Wing' : currentWing === 'dark' ? 'Dark Wing' : 'Both Wings'}`}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Content will automatically be categorized for this zone
                {formData.accessLevel === 'premium' && ' as premium content'}
                {currentWing === 'light' && ' (Light Wing = Premium ✨)'}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-black/50 border-cyan-500/30 text-white"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="subtitle" className="text-gray-300">
                Subtitle
              </Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="bg-black/50 border-cyan-500/30 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Zone */}
            <div>
              <Label htmlFor="zone" className="text-gray-300">
                Zone * {currentZone && <span className="text-xs text-cyan-400">(auto-detected)</span>}
              </Label>
              <select
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                required
                disabled={!!currentZone}
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="kazmo">Kazmo Mansion</option>
                <option value="clubHollywood">Club Hollywood</option>
                <option value="shadowMarket">Shadow Market</option>
              </select>
            </div>

            {/* Wing */}
            <div>
              <Label htmlFor="wing" className="text-gray-300">
                Wing/Mode * {currentWing && <span className="text-xs text-cyan-400">(auto-detected)</span>}
              </Label>
              <select
                id="wing"
                name="wing"
                value={formData.wing}
                onChange={handleInputChange}
                required
                disabled={!!currentWing}
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="light">Light Wing</option>
                <option value="dark">Dark Wing</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Room/Display Location */}
            <div>
              <Label htmlFor="room" className="text-gray-300">
                Display Location * <span className="text-xs text-amber-400">(where it appears)</span>
              </Label>
              <select
                id="room"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="music-room">🎵 Music Room</option>
                <option value="studio">🎙️ Studio</option>
                <option value="bedroom">🛏️ Bedroom</option>
                <option value="photo-gallery">🖼️ Photo Gallery</option>
                <option value="merch-shop">🛍️ Merch Shop</option>
                <option value="playroom">🎮 Playroom (Dark)</option>
                <option value="featured">⭐ Featured/Homepage</option>
                <optgroup label="Club Hollywood">
                  <option value="club-main-stage">🎭 Main Stage (Live Performances)</option>
                  <option value="club-vip">💎 VIP Lounge</option>
                  <option value="club-dance-floor">🕺 Dance Floor</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">Content will display in this room when users visit</p>
            </div>

            {/* Content Type */}
            <div>
              <Label htmlFor="contentType" className="text-gray-300">
                Content Type *
              </Label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="video">Video</option>
                <option value="audio">Audio Mix</option>
                <option value="live">Live Session</option>
                <option value="story">Story Panel</option>
              </select>
            </div>

            {/* Access Level */}
            <div>
              <Label htmlFor="accessLevel" className="text-gray-300">
                Access Level *
              </Label>
              <select
                id="accessLevel"
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="public">Public</option>
                <option value="premium">Premium Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration" className="text-gray-300">
                Duration (MM:SS)
              </Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="42:18"
                className="bg-black/50 border-cyan-500/30 text-white"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-gray-300">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="ambient, night session, exclusive"
                className="bg-black/50 border-cyan-500/30 text-white"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isLive"
                  checked={formData.isLive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                Live Stream
              </label>
            </div>

            {/* Live Stream URL */}
            {formData.isLive && (
              <div>
                <Label htmlFor="liveStreamUrl" className="text-gray-300">
                  Live Stream URL
                </Label>
                <Input
                  id="liveStreamUrl"
                  name="liveStreamUrl"
                  value={formData.liveStreamUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="bg-black/50 border-cyan-500/30 text-white"
                />
              </div>
            )}

            {/* Media File Upload */}
            {!formData.isLive && (
              <div>
                <Label htmlFor="mediaFile" className="text-gray-300">
                  Media File * (Video/Audio)
                </Label>
                <input
                  type="file"
                  id="mediaFile"
                  accept="video/*,audio/*,.mp4,.mp3,.wav,.m4a,.webm,.ogg,.aac,.flac"
                  onChange={(e) => handleFileChange(e, "media")}
                  required
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                />
                {mediaFile && (
                  <p className="text-xs text-cyan-400 mt-1">{mediaFile.name}</p>
                )}
              </div>
            )}

            {/* Thumbnail Upload */}
            <div>
              <Label htmlFor="thumbnailFile" className="text-gray-300">
                Thumbnail Image (optional)
              </Label>
              <input
                type="file"
                id="thumbnailFile"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
              />
              {thumbnailFile && (
                <p className="text-xs text-cyan-400 mt-1">{thumbnailFile.name}</p>
              )}
            </div>

            {/* Status Message */}
            {uploadStatus && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                  uploadStatus.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : uploadStatus.type === "error"
                    ? "bg-red-500/20 text-red-400"
                    : uploadStatus.type === "warning"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-cyan-500/20 text-cyan-400"
                }`}
              >
                {uploadStatus.type === "success" && <Check className="w-5 h-5" />}
                {uploadStatus.type === "error" && <AlertCircle className="w-5 h-5" />}
                {uploadStatus.type === "warning" && <AlertCircle className="w-5 h-5" />}
                {uploadStatus.type === "loading" && (
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                )}
                <span className="text-sm">{uploadStatus.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
            >
              {isUploading ? "Uploading..." : "Upload Content"}
            </Button>
          </form>
        </div>
      </details>
    </motion.div>
  );
}
