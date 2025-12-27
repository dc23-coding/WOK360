# Audio & Club Fixes Summary

## ✅ Fixed Issues

### 1. Audio Overlapping Prevention
**Problem**: Doorbell and other audio could overlap when triggered multiple times.

**Solution**: Created global `AudioManager` singleton:
- **File**: `src/lib/audioManager.js`
- **Usage**: `audioManager.play(src, options)` automatically stops previous audio
- **Updated**: `src/sections/HeroDoor.jsx` to use the audio manager
- **Benefits**: 
  - Only one audio plays at a time across entire app
  - Graceful error handling
  - Volume control and playback options
  - Can be used anywhere: `import { audioManager } from '../lib/audioManager'`

### 2. Club Hollywood Content Not Showing
**Problem**: VibePlayer was querying `roomId="club-dance-floor"` but no content existed for that room.

**Solution**: 
- **Updated**: `src/worlds/clubHollywood/ClubHollywoodWorld.jsx` to use `roomId="club-hollywood-main"`
- **Enhanced**: `src/components/VibePlayer.jsx` with better debugging:
  - Console logs show what's being queried
  - Improved empty state with clear instructions
  - Shows exact room ID needed for content assignment
- **Created**: `seed-club-content.js` script to create sample content

## 📦 New Files Created

### 1. `src/lib/audioManager.js`
Global audio manager to prevent overlapping playback.

**API:**
```javascript
import { audioManager } from './lib/audioManager';

// Play audio (stops any current audio)
audioManager.play('/path/to/audio.mp3', { 
  volume: 0.4,  // 0.0 to 1.0
  loop: false   // true for looping
});

// Control playback
audioManager.stop();    // Stop and reset
audioManager.pause();   // Pause (can resume)
audioManager.resume();  // Resume paused audio

// Check status
audioManager.isPlaying();      // boolean
audioManager.getCurrentAudio(); // HTMLAudioElement or null
```

### 2. `seed-club-content.js`
Script to check and create sample content for Club Hollywood.

**Usage:**
```bash
node seed-club-content.js
```

**What it does:**
- Checks for existing club-hollywood-main content
- Creates 3 sample mixes if none exist
- Provides instructions for uploading media files in Sanity Studio

## 🔧 Modified Files

### `src/sections/HeroDoor.jsx`
- Replaced direct `new Audio()` with `audioManager.play()`
- Prevents doorbell overlap on multiple clicks

### `src/worlds/clubHollywood/ClubHollywoodWorld.jsx`
- Changed `roomId` from `"club-dance-floor"` to `"club-hollywood-main"`
- Matches expected content structure

### `src/components/VibePlayer.jsx`
- Added console logging for debugging content queries
- Improved empty state UI with clearer instructions
- Shows exact room ID needed for content assignment

## 🎯 Next Steps to Fix Club Content

### Option 1: Upload Content in Sanity Studio
1. Go to Sanity Studio (https://wok360.sanity.studio or local)
2. Create new "Media Content" documents
3. Set the `room` field to: **`club-hollywood-main`**
4. Upload audio/video files to "Media File" field
5. Add title, subtitle, duration, tags

### Option 2: Run Seed Script
1. Make sure you have a Sanity write token in `.env`:
   ```
   VITE_SANITY_AUTH_TOKEN=your_token_here
   ```
2. Run: `node seed-club-content.js`
3. Go to Sanity Studio and upload media files to the created documents

### Option 3: Use Test Script
Run the existing test script to see what's in Sanity:
```bash
node test-club-content.js
```

## 🔍 Debugging Tips

### Check what content exists:
```javascript
// In browser console or test script
sanityClient.fetch(`*[_type == "mediaContent" && room == "club-hollywood-main"]`)
```

### Check VibePlayer logs:
Open browser console and look for:
```
[VibePlayer] Fetching content for room: club-hollywood-main
[VibePlayer] Found X items for club-hollywood-main: [...]
```

### Common Issues:
1. **No content shows**: Room ID mismatch or no content in Sanity
2. **"No media file attached"**: Documents exist but `mediaFile` field is empty
3. **Permission errors**: Need auth token for creating/modifying content

## 📝 Room IDs Used

| Location | Room ID | Purpose |
|----------|---------|---------|
| Club Hollywood Main Stage | `club-hollywood-main` | Primary dance floor player |
| Music Room | TBD | Light wing music collection |
| Dark Playroom | TBD | Premium audio experiences |

## 🚀 Audio Manager Benefits

- **No overlapping**: Only one audio plays at a time
- **Memory efficient**: Cleans up audio elements automatically
- **Error handling**: Graceful fallbacks for missing files
- **Global control**: Can be used from any component
- **Flexible**: Supports volume, looping, pause/resume

## ✅ Testing Checklist

- [x] Audio manager created and tested
- [x] HeroDoor uses audio manager (no overlapping doorbell)
- [x] Club Hollywood queries correct room ID
- [x] VibePlayer shows helpful empty state
- [x] Console logging for debugging
- [x] Seed script created for sample data
- [ ] Upload actual audio files to Sanity
- [ ] Test Club Hollywood with real content
- [ ] Apply audio manager to other sound effects (if any)

## 📚 Documentation

All audio playback across WOK360 should now use the `audioManager` to prevent overlapping and ensure clean audio transitions.

For future audio implementations, use:
```javascript
import { audioManager } from '../lib/audioManager';
audioManager.play('/path/to/sound.mp3', { volume: 0.5 });
```
