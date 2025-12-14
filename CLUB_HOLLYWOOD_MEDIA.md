# Club Hollywood - Media Player Guide

## What's New

### MediaPlayer Component (`src/components/MediaPlayer.jsx`)

**Unified player supporting both audio and video content:**

#### Audio Controls
- ✅ **Play/Pause Button** - Start/stop playback
- ✅ **Progress Bar** - Clickable scrubber to jump to any position
  - Smooth gradient (cyan → purple)
  - Hover shows white dot indicator
  - Displays current time / total duration
- ✅ **Volume Controls**:
  - Mute/unmute button (🔇 🔉 🔊 icons)
  - Horizontal slider (0-100%)
  - Live percentage display
- ✅ **Time Display** - Shows `0:00 / 5:30` format

#### Visual Modes
1. **Audio Mode** (when `hasVideo: false`):
   - Animated emoji visualization
   - Pulsing scale effect when playing
   - Mix name and description overlay
   
2. **Video Mode** (when `hasVideo: true`):
   - Full video playback
   - Controls overlay on bottom
   - Video fills frame completely

#### Live Mode
- Controls are **locked** during live streams
- Red "LIVE" badge with pulse animation
- Auto-plays on mount
- Users can only adjust volume, no seeking

## Mix Configuration

### Current Setup (Audio Mixes)
Located in `ClubHollywoodWorld.jsx`:

```javascript
{
  id: "mix-1",
  name: "Chill Lounge",
  emoji: "🌙",
  description: "Relaxed downtempo beats",
  duration: "45:30",
  hasVideo: false,               // Audio only
  audioSource: "https://..."     // Your audio URL
}
```

### Adding Video Mixes (Future)
Simply uncomment and update:

```javascript
{
  id: "video-mix-1",
  name: "Visual Vibes",
  emoji: "🎬",
  description: "Music with stunning visuals",
  duration: "30:00",
  hasVideo: true,                // Enable video
  videoSource: "https://..."     // Your video URL
}
```

### Adding Live Streams
Set `isLive={true}` in `ClubHollywoodWorld.jsx`:

```javascript
<MediaPlayer 
  activeMix={activeMix} 
  isLive={true}  // Locks controls, auto-plays
/>
```

## Features Preserved

✅ Background image with video framing (`/ClubHollywod.png`)  
✅ Three-column layout (MixSelector | Video | User Windows)  
✅ Audience Rail with reactions  
✅ User profile windows (8-30 users)  
✅ Real-time presence indicator  
✅ Reaction animations (👍 👏 ❤️ 🔥)  
✅ Global auth with wallet connect  

## To Replace URLs

**Audio Files:**
Replace placeholder URLs in `mixes` array:
```javascript
audioSource: "https://your-cdn.com/audio/chill-lounge.mp3"
```

**Video Files (when ready):**
```javascript
videoSource: "https://your-cdn.com/video/visual-vibes.mp4"
```

**Live Streams:**
```javascript
videoSource: "https://stream-url.com/live/hls.m3u8"
```

## Foundation Ready ✅

All components are modular and production-ready:
- Swap audio URLs anytime
- Add video mixes by setting `hasVideo: true`
- Enable live mode with `isLive` prop
- Controls automatically adapt to mode

Nothing needs to change structurally - just update content URLs when ready! 🎵🎬
