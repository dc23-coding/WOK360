# Broadcast Control Strategy - WOK360

## The Problem

**Current State:**
- Content is uploaded and assigned to rooms via Control Room (Dark Hallway)
- Each room's player queries Sanity by `room` field to fetch content
- Players show pre-recorded content (VOD - Video on Demand)
- No real-time broadcast control or live stream orchestration

**What's Missing:**
- **Live broadcast control**: Ability to push a live stream to multiple rooms simultaneously
- **Real-time switching**: Change what users see/hear instantly across zones
- **Centralized control panel**: DJ/Host control over active broadcasts
- **Live feed management**: Stream one source to multiple destinations

---

## Architecture Options

### 🎯 **Option 1: Broadcast Channel System (RECOMMENDED)**

**Concept:** Create virtual "broadcast channels" that rooms can tune into. The Control Room manages which channels are active and what content they're broadcasting.

```
Control Room (Broadcaster)
    ↓
Broadcast Channels (Live Stream URLs + Metadata)
    ↓
Room Players (Receivers) → Listen to assigned channel
    ↓
User Experience (Synchronized viewing)
```

#### Implementation:

**1. Add Broadcast Channel Schema**
```javascript
// schemas/broadcastChannel.js
{
  name: 'broadcastChannel',
  type: 'document',
  fields: [
    {
      name: 'channelId',
      type: 'string',
      title: 'Channel ID',
      // e.g., 'live-main-stage', 'live-vip-lounge'
    },
    {
      name: 'isLive',
      type: 'boolean',
      title: 'Broadcasting Live',
    },
    {
      name: 'liveStreamUrl',
      type: 'url',
      title: 'Live Stream URL',
      // HLS, YouTube Live, Twitch, etc.
    },
    {
      name: 'fallbackContentId',
      type: 'reference',
      to: [{type: 'mediaContent'}],
      title: 'Fallback Content (when not live)',
    },
    {
      name: 'activeRooms',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Broadcasting to Rooms',
      // ['club-main-stage', 'club-vip', 'music-room']
    },
    {
      name: 'metadata',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'text' },
        { name: 'startedAt', type: 'datetime' },
        { name: 'performerName', type: 'string' },
      ]
    }
  ]
}
```

**2. Broadcast Control Panel (in Control Room)**
```jsx
// src/components/BroadcastControl.jsx

- View all channels (Main Stage, VIP, etc.)
- Start/Stop broadcasts
- Assign live stream URL to channel
- Select which rooms receive the broadcast
- Set fallback content for when stream ends
- See viewer count per room
```

**3. Room Player Updates**
```jsx
// src/components/LiveRoomPlayer.jsx

useEffect(() => {
  // Poll for broadcast channel status every 5 seconds
  const interval = setInterval(() => {
    sanityClient.fetch(`
      *[_type == "broadcastChannel" && 
        $roomId in activeRooms][0] {
        isLive,
        liveStreamUrl,
        "fallbackContent": fallbackContentId->{
          title,
          "mediaUrl": mediaFile.asset->url
        },
        metadata
      }
    `, { roomId }).then(channel => {
      if (channel?.isLive) {
        // Switch to live stream
        setCurrentSource(channel.liveStreamUrl);
      } else if (channel?.fallbackContent) {
        // Play fallback content
        setCurrentSource(channel.fallbackContent.mediaUrl);
      }
    });
  }, 5000);
  
  return () => clearInterval(interval);
}, [roomId]);
```

**Benefits:**
✅ Control Room can broadcast to ANY room instantly  
✅ One stream reaches multiple rooms  
✅ Automatic fallback when stream ends  
✅ Works with existing architecture  
✅ Scalable to infinite rooms/zones  

**Cons:**
⚠️ 5-second polling delay (can use Supabase Realtime for instant updates)  
⚠️ Requires new schema deployment  

---

### 🎯 **Option 2: Direct Room Assignment (Current System - Enhanced)**

**Concept:** Keep current system but add live stream support and better Control Room UI.

**Changes Needed:**

**1. Update mediaContent schema to support live URLs**
```javascript
// schemas/mediaContent.js - Add fields:
{
  name: 'isLiveStream',
  type: 'boolean',
},
{
  name: 'liveStreamUrl',
  type: 'url',
  title: 'Live Stream URL (HLS/YouTube/Twitch)'
},
{
  name: 'streamStatus',
  type: 'string',
  options: {
    list: ['offline', 'live', 'ended']
  }
}
```

**2. Control Room Live Switcher**
```jsx
// In AdminContentManager.jsx

// New "Go Live" button per room
<button onClick={() => goLive('club-main-stage', streamUrl)}>
  🔴 Go Live on Main Stage
</button>

// This updates the room's active content to a live stream
async function goLive(roomId, streamUrl) {
  await sanityClient.create({
    _type: 'mediaContent',
    title: 'Live Now',
    isLiveStream: true,
    liveStreamUrl: streamUrl,
    streamStatus: 'live',
    room: roomId,
    featured: true
  });
}
```

**3. Room Players Check for Live Content First**
```javascript
// Modify VibePlayer.jsx query:
`*[_type == "mediaContent" && 
   room == $roomId && 
   streamStatus == "live"] | order(_createdAt desc)[0]
  
  // If no live content, fall back to VOD
  || *[_type == "mediaContent" && 
      room == $roomId && 
      defined(mediaFile.asset)] | order(_createdAt desc)[0]
`
```

**Benefits:**
✅ Minimal changes to existing architecture  
✅ Uses current content system  
✅ Quick to implement  

**Cons:**
⚠️ Not ideal for multi-room broadcasts  
⚠️ Requires creating/deleting content docs frequently  
⚠️ Harder to manage fallback content  

---

### 🎯 **Option 3: Real-Time WebSocket Broadcast (Advanced)**

**Concept:** Use Supabase Realtime channels to push broadcast commands from Control Room to all players instantly.

```
Control Room → Supabase Realtime Channel
    ↓
All Room Players subscribed to channel
    ↓
Receive broadcast commands instantly
```

**Implementation:**
```javascript
// Control Room broadcasts:
supabase.channel('broadcast-control')
  .send({
    type: 'broadcast',
    event: 'start_live',
    payload: {
      streamUrl: 'https://...',
      rooms: ['club-main-stage', 'club-vip'],
      metadata: { title: 'Live Show', performer: 'Artist Name' }
    }
  });

// Room Players listen:
supabase.channel('broadcast-control')
  .on('broadcast', { event: 'start_live' }, (payload) => {
    if (payload.rooms.includes(currentRoomId)) {
      setLiveStream(payload.streamUrl);
      showNotification(payload.metadata.title);
    }
  })
  .subscribe();
```

**Benefits:**
✅ Instant updates (no polling)  
✅ Perfect synchronization across all rooms  
✅ Supports commands (start, stop, switch content)  
✅ Can send chat messages, reactions, etc.  

**Cons:**
⚠️ More complex setup  
⚠️ Requires Supabase Realtime plan  
⚠️ Need to handle reconnections  

---

## 🏆 RECOMMENDED STRATEGY: Hybrid Approach

Combine **Option 1 (Broadcast Channels)** with **Option 3 (Realtime)** for best results:

### Phase 1: Broadcast Channel System (Week 1)
1. **Deploy broadcast channel schema** to Sanity
2. **Build Broadcast Control Panel** in Control Room
3. **Update room players** to query broadcast channels
4. **Test with pre-recorded streams**

### Phase 2: Real-Time Signaling (Week 2)
1. **Add Supabase Realtime** for instant notifications
2. **Push updates** when broadcasts start/stop
3. **Room players react** without polling delay
4. **Add presence indicators** (who's watching where)

### Phase 3: Enhanced Control (Week 3)
1. **Multi-room broadcasting** - One stream to many rooms
2. **Scheduled broadcasts** - Auto-start at specific times
3. **Emergency broadcast system** - Override all rooms
4. **Analytics dashboard** - Viewer counts, engagement

---

## Quick Win: Test Live Streaming Now

**You can test live streaming TODAY without any code changes:**

1. **Upload content to Control Room:**
   - Title: "Live Test"
   - Content Type: Video
   - Assign to: `club-main-stage`
   - Media File: Use a live HLS stream URL like:
     ```
     https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
     ```

2. **Club Hollywood players will pick it up** (they query by `room`)

3. **Limitation:** No real-time switching - need to refresh page

---

## Decision Matrix

| Feature | Option 1 (Channels) | Option 2 (Enhanced) | Option 3 (WebSocket) |
|---------|---------------------|---------------------|----------------------|
| Multi-room broadcast | ✅ Excellent | ⚠️ Manual | ✅ Excellent |
| Real-time updates | ⚠️ 5s delay | ⚠️ Manual refresh | ✅ Instant |
| Ease of implementation | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Easy | ⭐⭐ Complex |
| Scalability | ✅ Excellent | ⚠️ Limited | ✅ Excellent |
| Cost | 💰 Free | 💰 Free | 💰💰 Supabase plan |
| Development time | 2-3 days | 1 day | 4-5 days |

---

## My Recommendation

**Start with Option 1 (Broadcast Channels) + Supabase Realtime notifications.**

This gives you:
- Centralized broadcast control
- Multi-room streaming
- Instant updates via Supabase
- Fallback content management
- Foundation for scheduled broadcasts

**Implementation priority:**
1. ✅ Create broadcast channel schema
2. ✅ Build Control Room broadcast panel
3. ✅ Update Club Hollywood + other room players
4. ✅ Add Supabase Realtime listeners
5. ✅ Test with live stream URLs

Would you like me to start implementing the Broadcast Channel system?
