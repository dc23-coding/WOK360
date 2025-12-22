// src/context/MediaPlayerContext.jsx
// Global Media Player - Ensures only ONE audio/video plays at a time
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MediaPlayerContext = createContext(null);

export function MediaPlayerProvider({ children }) {
  const [currentMedia, setCurrentMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Play new media (stops any currently playing media)
  const playMedia = (mediaItem) => {
    // Stop current media first
    stopMedia();
    
    // Set new media
    setCurrentMedia(mediaItem);
    setIsPlaying(true);
  };

  // Stop current media
  const stopMedia = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Pause/Resume
  const togglePlayPause = () => {
    if (!currentMedia) return;
    
    const ref = currentMedia.contentType === 'audio' ? audioRef : videoRef;
    if (ref.current) {
      if (isPlaying) {
        ref.current.pause();
        setIsPlaying(false);
      } else {
        ref.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Auto-play when currentMedia changes
  useEffect(() => {
    if (!currentMedia) return;

    const ref = currentMedia.contentType === 'audio' ? audioRef : videoRef;
    if (ref.current && currentMedia.mediaUrl) {
      ref.current.src = currentMedia.mediaUrl;
      ref.current.play().catch(err => {
        console.error('Playback failed:', err);
        setIsPlaying(false);
      });
    }
  }, [currentMedia]);

  return (
    <MediaPlayerContext.Provider
      value={{
        currentMedia,
        isPlaying,
        playMedia,
        stopMedia,
        togglePlayPause,
        audioRef,
        videoRef
      }}
    >
      {children}
      
      {/* Hidden audio/video elements for playback */}
      <audio 
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
        }}
      />
      <video 
        ref={videoRef}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Video error:', e);
          setIsPlaying(false);
        }}
        style={{ display: 'none' }}
      />
    </MediaPlayerContext.Provider>
  );
}

export function useMediaPlayer() {
  const context = useContext(MediaPlayerContext);
  if (!context) {
    throw new Error('useMediaPlayer must be used within MediaPlayerProvider');
  }
  return context;
}
