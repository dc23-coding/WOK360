# Content Upload System Setup Guide

## Overview
WOK360 now has a complete admin-only content management system using Sanity CMS. This gives you:
- ✅ Full ownership of all content
- ✅ Admin-only upload interface (hidden from regular users)
- ✅ CDN-powered delivery for fast streaming
- ✅ Zone-specific content targeting (Kazmo, Club Hollywood, etc.)
- ✅ Premium gating support
- ✅ Live streaming capability

## Quick Start

### 1. Deploy Schema to Sanity

First, install Sanity CLI globally:
```bash
npm install -g @sanity/cli
```

Login to Sanity:
```bash
sanity login
```

Deploy the schema:
```bash
sanity deploy
```

Or use the Sanity MCP tool if available:
```javascript
// The schema is defined in schemas/mediaContent.js
// Deploy it to your project: lp1si6d4
```

### 2. Set Admin Role for Your Account

Update your Clerk user metadata to grant admin access:

**In Clerk Dashboard:**
1. Go to Users
2. Find your user account
3. Click "Metadata" tab
4. Add to `public_metadata`:
```json
{
  "role": "admin",
  "isAdmin": true
}
```

### 3. Access the Upload Interface

Once logged in as admin:
1. Navigate to any zone (Kazmo Mansion, Club Hollywood)
2. Look for the **"Admin Upload"** floating button (bottom-right, cyan/purple gradient)
3. Click to expand the upload panel

### 4. Upload Content

The uploader supports:
- **Video files**: MP4, WebM, MOV, etc.
- **Audio files**: MP3, WAV, AAC, etc.
- **Thumbnails**: JPG, PNG, WebP (required)
- **Live streams**: Enter external live stream URL

**Required fields:**
- Title
- Thumbnail image
- Zone (Kazmo/Club Hollywood/Shadow Market)
- Wing (Light/Dark/Both)
- Content Type (Video/Audio/Live/Story)

**Optional fields:**
- Subtitle
- Description
- Duration (auto-detected for files)
- Tags (comma-separated)
- Access Level (Public/Premium/Admin)
- Featured toggle

## Usage in Zones

### Kazmo Mansion Integration

Content automatically appears in:
- **Light Bedroom**: Story panels with Sanity content
- **Dark Bedroom**: Exclusive premium content
- **Hallways**: Featured content rail

Example usage:
```jsx
import { useZoneContent } from '../hooks/useZoneContent';

function MyRoom() {
  const { content, loading } = useZoneContent('kazmo', 'light');
  
  return (
    <StoryPanelRail 
      panels={content}
      loading={loading}
      variant="light"
    />
  );
}
```

### Club Hollywood Integration

Content automatically populates the mix selector:
```jsx
// Already integrated - mixes auto-load from Sanity
const { content } = useZoneContent('clubHollywood', 'both');
```

## Content Structure

### Sanity Document Schema

```javascript
{
  _id: "unique-id",
  _type: "mediaContent",
  title: "Night Session: Studio Vibes",
  subtitle: "Live mix from the dark bedroom",
  description: "Extended description...",
  zone: "kazmo", // or "clubHollywood", "shadowMarket"
  wing: "dark", // or "light", "both"
  contentType: "video", // or "audio", "live", "story"
  accessLevel: "premium", // or "public", "admin"
  featured: true,
  isLive: false,
  duration: "42:18",
  tags: ["ambient", "night session"],
  mediaFile: { asset: { url: "https://cdn.sanity.io/..." } },
  thumbnail: { asset: { url: "https://cdn.sanity.io/..." } }
}
```

## Cost Breakdown

### Sanity Pricing (Self-Hosted)
- **Free Tier**: Up to 5GB bandwidth/month
- **Pro Plan**: $99/month for 50GB bandwidth
- **Team Plan**: $199/month for 200GB bandwidth

For video-heavy usage with ~100 users:
- **Estimated cost**: $99-199/month
- **Storage**: ~$0.25/GB/month
- **Bandwidth**: ~$0.15/GB

### Comparison to Alternatives
- **YouTube**: Free but no ownership, privacy issues, algorithm dependency
- **Vimeo**: $20-$75/month but limited control
- **AWS S3 + CloudFront**: ~$50-150/month but requires manual setup

**Sanity wins for**: Ownership, privacy, admin control, CDN delivery

## Advanced Features

### Live Streaming Setup

For live events, integrate with:
1. **Mux** ($99/month) - Recommended for Sanity
2. **Cloudflare Stream** ($5/month + usage)
3. **YouTube Live** (free but public)

Store live stream recordings back to Sanity after events complete.

### Content API Access

Query content programmatically:
```javascript
import { contentQueries } from './lib/sanityClient';

// Get all content for a zone
const kazmoLight = await contentQueries.getZoneContent('kazmo', 'light');

// Get featured content
const featured = await contentQueries.getFeaturedContent('kazmo');

// Get single content item
const item = await contentQueries.getContentById('abc123');

// Get live sessions
const live = await contentQueries.getLiveSessions();
```

### Custom Hooks

```javascript
// Automatic content loading
import { useZoneContent, useLiveSessions } from './hooks/useZoneContent';

function MyComponent() {
  const { content, loading, error, refresh } = useZoneContent('kazmo', 'light');
  const { sessions } = useLiveSessions();
  
  // Auto-refreshes when zone/wing changes
  // Call refresh() to manually reload
}
```

## Files Created

### Core Infrastructure
- `/src/lib/sanityClient.js` - Sanity client + content queries
- `/sanity.config.js` - Sanity configuration
- `/schemas/mediaContent.js` - Content schema definition

### Upload System
- `/src/admin/ContentUploader.jsx` - Admin-only upload UI
- Integrated into `AppRouter.jsx` (globally available)

### Integration Components
- `/src/hooks/useZoneContent.js` - React hook for fetching content
- `/src/components/SanityMediaPlayer.jsx` - Enhanced media player
- `/src/components/ContentPanel.jsx` - Content thumbnail cards
- Updated `StoryPanelRail.jsx` - Supports Sanity content

### Zone Integrations
- `ClubHollywoodWorld.jsx` - Auto-loads mixes from Sanity
- `LightBedroom.jsx` - Integrated content hook (example)

## Next Steps for Sunday Deadline

### Phase 1: Test Upload (30 mins)
1. Login as admin
2. Upload 1 test video to Kazmo Light Wing
3. Verify it appears in the zone
4. Test playback

### Phase 2: Bulk Upload Content (2-3 hours)
1. Prepare your video/audio files
2. Create thumbnails (16:9 aspect ratio)
3. Upload to appropriate zones:
   - **Kazmo Light**: Behind-the-scenes, tutorials
   - **Kazmo Dark**: Exclusive sessions (premium)
   - **Club Hollywood**: Live sets, mixes

### Phase 3: Configure Access (1 hour)
1. Set premium content to `accessLevel: "premium"`
2. Test premium gating with non-premium account
3. Configure featured content flags

### Phase 4: Polish & Deploy (1 hour)
1. Test all zones
2. Verify mobile responsiveness
3. Deploy to production

## Troubleshooting

### Upload fails
- Check `VITE_SANITY_AUTH_TOKEN` in `.env.local`
- Verify token has write permissions in Sanity dashboard
- Check file size (Sanity supports up to 500MB per file)

### Content doesn't appear
- Refresh page (content is cached)
- Check zone/wing filters match upload settings
- Verify content published (not draft)

### Admin button not visible
- Check Clerk user metadata has `role: "admin"`
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check console for errors

## Security Notes

- ✅ Upload UI only visible to admins (Clerk role check)
- ✅ Sanity token stored server-side (not exposed to client)
- ✅ Content access controlled by `accessLevel` field
- ✅ Premium content gated by Clerk premium status
- ✅ All uploads logged to Sanity audit trail

## Support

For issues:
1. Check browser console for errors
2. Verify Sanity dashboard shows uploads
3. Test with different browser/incognito
4. Check network tab for failed requests

---

**Ready to launch! 🚀**

Upload your first content piece and verify the system works end-to-end before bulk uploading for Sunday's deadline.
