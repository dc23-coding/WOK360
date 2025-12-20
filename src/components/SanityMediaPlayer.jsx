// src/components/SanityMediaPlayer.jsx
// Enhanced media player that works with Sanity content
import { useEffect } from 'react';
import MediaPlayer from './MediaPlayer';

export default function SanityMediaPlayer({ content, isLive = false, onReady }) {
  if (!content) return null;

  // Transform Sanity content to MediaPlayer format
  const activeMix = {
    name: content.title,
    description: content.subtitle || content.description,
    source: content.mediaUrl,
    videoSource: content.contentType === 'video' ? content.mediaUrl : null,
    audioSource: content.contentType === 'audio' ? content.mediaUrl : null,
    hasVideo: content.contentType === 'video' || content.isLive,
    duration: content.duration,
    emoji: content.contentType === 'video' ? '🎥' : '🎵'
  };

  return (
    <MediaPlayer 
      activeMix={activeMix}
      isLive={isLive || content.isLive}
      onReady={onReady}
    />
  );
}
