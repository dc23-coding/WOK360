# Club Hollywood - Behavioral Guardrails

**Last Updated**: December 13, 2025

## Critical Reset: What This Product IS and IS NOT

### ✅ Allowed
- **Lightweight reactions** (ephemeral, non-persistent)
- **Text chat** (collapsed by default, read-only mode available)
- **Viewer counts** (anonymous aggregates only)
- **Anonymous metrics** (total visitors, peak concurrent, avg session)
- **Content authority** (host-controlled only)
- **Presence display** (peripheral silhouettes)

### ❌ Still Disallowed
- Audio chat
- Direct messages (DMs)
- User tagging (@mentions)
- Reaction spam (rate-limited)
- Persistent chat history by default
- User playback controls
- Screen sharing by viewers
- File uploads
- Any PII exposure beyond what user consents to show

## Design Philosophy

**This is a cinema with human silhouettes, not a collaboration tool.**

- **Content is the stage** (single source, host-controlled)
- **Users are the audience** (visible but not interruptive)
- **Reactions = body language** (not social media engagement)
- **Chat = whispers** (minimal, collapsed by default)
- **Metrics = proof of value** (anonymous, aggregated)

## Implementation Rules

1. **Metrics First**: Build analytics before social features
2. **Anonymous by Default**: No PII unless explicitly required
3. **Collapse UI**: Chat/reactions hidden until needed
4. **Rate Limit Everything**: Prevent spam and chaos
5. **Host Authority**: Content control stays with host only
6. **Peripheral Presence**: Audience should feel located, not listed

## Reaction Guardrails

**Hard cap: 3-5 reactions maximum**
- 👍 (agreement/support)
- 👏 (applause)
- ❤️ (love/appreciation)
- 👀 (attention/interest)
- 🔥 (optional: energy/excitement)

**No custom emojis. No emoji picker. No reaction spam.**

## Chat Guardrails

- Collapsed by default
- Read-only mode available for host
- No persistent history (ephemeral)
- No DMs
- No @mentions
- Rate limited (1 message per 3 seconds)
- Max message length: 200 characters
- Auto-hide after inactivity

## Metrics Tracking (Anonymous Only)

```javascript
{
  roomId: string,
  currentViewers: number,
  totalVisitors: number,
  peakConcurrent: number,
  avgSessionDuration: number,
  contentViews: number,
  // NO usernames, NO PII, NO identifiable data
}
```

---

**Remember**: Presence > Interaction. Cinema > Zoom. Proof of value > Social features.
