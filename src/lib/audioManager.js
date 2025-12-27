// Global audio manager to prevent overlapping audio playback
// Ensures only one audio element plays at a time across the entire app

class AudioManager {
  constructor() {
    this.currentAudio = null;
  }

  /**
   * Play audio file, stopping any currently playing audio
   * @param {string} src - Audio file path or URL
   * @param {Object} options - Playback options (volume, loop, etc.)
   * @returns {Promise<HTMLAudioElement>} The audio element
   */
  play(src, options = {}) {
    // Stop any currently playing audio
    this.stop();

    // Create new audio element
    const audio = new Audio(src);
    
    // Apply options
    audio.volume = options.volume ?? 0.4;
    audio.loop = options.loop ?? false;

    // Store reference
    this.currentAudio = audio;

    // Clean up reference when audio ends
    audio.addEventListener('ended', () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null;
      }
    });

    // Start playback
    return audio.play()
      .then(() => audio)
      .catch(err => {
        console.warn('Audio playback failed:', err.message);
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        throw err;
      });
  }

  /**
   * Stop currently playing audio
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Pause currently playing audio (can be resumed)
   */
  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  /**
   * Resume paused audio
   */
  resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(err => {
        console.warn('Audio resume failed:', err.message);
      });
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying() {
    return this.currentAudio && !this.currentAudio.paused;
  }

  /**
   * Get current audio element
   */
  getCurrentAudio() {
    return this.currentAudio;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
