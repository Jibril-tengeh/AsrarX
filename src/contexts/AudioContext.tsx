import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export type Track = {
  id: string;
  title: string;
  url: string;
  artist: string;
  coverImage?: string;
  backgroundImage?: string;
  isCollection?: boolean;
  subTracks?: Track[];
  isQuranVerse?: boolean;
  surahNumber?: number;
  ayahNumber?: number;
};

export type LoopMode = 'off' | 'track' | 'playlist';
export type AudioEffect = 'normal' | 'slow' | 'echo' | 'clarity';

interface AudioContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  currentSubIndex: number;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
  loopMode: LoopMode;
  setLoopMode: (mode: LoopMode) => void;
  currentEffect: AudioEffect;
  setAudioEffect: (effect: AudioEffect) => void;
  playTrack: (track: Track) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  clear: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  quranRepeatCount: number;
  setQuranRepeatCount: (count: number) => void;
  quranRangeRepeatCount: number;
  setQuranRangeRepeatCount: (count: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSubIndex, setCurrentSubIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [currentEffect, setCurrentEffect] = useState<AudioEffect>('normal');
  const [quranRepeatCount, setQuranRepeatCountState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_quran_repeat_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const setQuranRepeatCount = (count: number) => {
    setQuranRepeatCountState(count);
    try {
      localStorage.setItem('asrarhub_quran_repeat_count', String(count));
    } catch (e) {
      console.warn("Failed to save repeat count", e);
    }
  };

  const [quranRangeRepeatCount, setQuranRangeRepeatCountState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_quran_range_repeat_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const setQuranRangeRepeatCount = (count: number) => {
    setQuranRangeRepeatCountState(count);
    try {
      localStorage.setItem('asrarhub_quran_range_repeat_count', String(count));
    } catch (e) {
      console.warn("Failed to save range repeat count", e);
    }
  };
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const webAudioInitialized = useRef(false);
  const globalRepeatLeftRef = useRef<number>(0);
  const globalRangeRepeatLeftRef = useRef<number>(0);

  useEffect(() => {
    globalRepeatLeftRef.current = quranRepeatCount > 0 ? quranRepeatCount - 1 : 0;
  }, [quranRepeatCount]);

  useEffect(() => {
    globalRangeRepeatLeftRef.current = quranRangeRepeatCount > 0 ? quranRangeRepeatCount - 1 : 0;
  }, [quranRangeRepeatCount]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use refs for state accessed in event listeners
  const stateRef = useRef({ playlist, currentIndex, loopMode, currentSubIndex, currentTrack, quranRepeatCount, quranRangeRepeatCount });

  const initWebAudio = () => {
    if (webAudioInitialized.current || !audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;
      
      // Create nodes
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.3;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.3;
      
      delay.connect(feedback);
      feedback.connect(delay);
      
      delayNodeRef.current = delay;
      feedbackNodeRef.current = feedback;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = 3000;
      filter.Q.value = 1.5;
      filter.gain.value = 5;
      
      filterNodeRef.current = filter;
      
      // Default connection
      source.connect(ctx.destination);
      
      webAudioInitialized.current = true;
    } catch (e) {
      console.warn("Web Audio API not supported or failed to init", e);
    }
  };

  const applyEffect = (effect: AudioEffect) => {
    if (!audioRef.current) return;
    
    // Always init context if possible when setting effect
    if (!webAudioInitialized.current) {
      initWebAudio();
    }
    
    const ctx = audioContextRef.current;
    const source = sourceNodeRef.current;
    const delay = delayNodeRef.current;
    const filter = filterNodeRef.current;
    
    // Playback rate for slow
    if (effect === 'slow') {
      audioRef.current.playbackRate = 0.75;
    } else {
      audioRef.current.playbackRate = 1.0;
    }
    
    if (!ctx || !source || !delay || !filter) return;
    
    // Disconnect everything
    source.disconnect();
    delay.disconnect();
    filter.disconnect();
    
    // Reconnect based on effect
    if (effect === 'echo') {
      source.connect(delay);
      delay.connect(ctx.destination);
      source.connect(ctx.destination); // original audio + echo
    } else if (effect === 'clarity') {
      source.connect(filter);
      filter.connect(ctx.destination);
    } else {
      // Normal or slow (just playbackRate)
      source.connect(ctx.destination);
    }
  };

  useEffect(() => {
    stateRef.current = { playlist, currentIndex, loopMode, currentSubIndex, currentTrack, quranRepeatCount, quranRangeRepeatCount };
  }, [playlist, currentIndex, loopMode, currentSubIndex, currentTrack, quranRepeatCount, quranRangeRepeatCount]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      const { playlist: currentPlaylist, currentIndex: currentIdx, loopMode: currentLoopMode, currentSubIndex: currSubIdx, currentTrack: currTrack, quranRepeatCount: currentRepeatCount } = stateRef.current;
      
      if (globalRepeatLeftRef.current > 0) {
        globalRepeatLeftRef.current -= 1;
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
        return;
      }

      if (currentLoopMode === 'track') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (currTrack?.isCollection && currTrack.subTracks && currSubIdx < currTrack.subTracks.length - 1) {
        setCurrentSubIndex(currSubIdx + 1);
      } else if (currentIdx < currentPlaylist.length - 1) {
        const newIndex = currentIdx + 1;
        setCurrentIndex(newIndex);
        setCurrentSubIndex(currentPlaylist[newIndex]?.isCollection ? 0 : -1);
        setCurrentTrack(currentPlaylist[newIndex]);
        globalRepeatLeftRef.current = currentRepeatCount > 0 ? currentRepeatCount - 1 : 0;
      } else if (globalRangeRepeatLeftRef.current > 0) {
        globalRangeRepeatLeftRef.current -= 1;
        setCurrentIndex(0);
        setCurrentSubIndex(currentPlaylist[0]?.isCollection ? 0 : -1);
        setCurrentTrack(currentPlaylist[0]);
        globalRepeatLeftRef.current = currentRepeatCount > 0 ? currentRepeatCount - 1 : 0;
      } else if (currentLoopMode === 'playlist' && currentPlaylist.length > 0) {
        setCurrentIndex(0);
        setCurrentSubIndex(currentPlaylist[0]?.isCollection ? 0 : -1);
        setCurrentTrack(currentPlaylist[0]);
      } else {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    let fallbackAttempted = false;

    if (!audioRef.current || !currentTrack) return;

    globalRepeatLeftRef.current = quranRepeatCount > 0 ? quranRepeatCount - 1 : 0;

    const activeUrl = (currentTrack.isCollection && currentTrack.subTracks) 
      ? (currentTrack.subTracks[currentSubIndex]?.url || (currentTrack.subTracks[currentSubIndex] as any)?.audioUrl || (currentTrack.subTracks[currentSubIndex] as any)?.file || (currentTrack.subTracks[currentSubIndex] as any)?.src || currentTrack.url)
      : currentTrack.url;

    if (!activeUrl) return;

    const tryFallbackToCache = async () => {
      if (fallbackAttempted || !audioRef.current) return;
      fallbackAttempted = true;
      try {
        const cache = await caches.open('quran-audio-cache');
        const matched = await cache.match(activeUrl);
        if (matched) {
          const blob = await matched.blob();
          objectUrl = URL.createObjectURL(blob);
          console.log("[AudioContext] Serving audio from fallback Cache Storage blob:", activeUrl);
          if (audioRef.current) {
            audioRef.current.src = objectUrl;
            audioRef.current.play().catch(playErr => {
              console.error("[AudioContext] Cache blob playback fallback failed:", playErr);
            });
          }
        } else {
          console.warn("[AudioContext] No cached audio found in quran-audio-cache for fallback:", activeUrl);
        }
      } catch (cacheErr) {
        console.warn("[AudioContext] Offline cache fallback failed:", cacheErr);
      }
    };

    const handleError = () => {
      const error = audioRef.current?.error;
      if (error && !fallbackAttempted) {
        console.warn("[AudioContext] Audio element error encountered:", error.code, error.message);
        tryFallbackToCache();
      }
    };

    const loadAudio = async () => {
      try {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }

        // 1. Check if this track is saved in Cache Storage (for offline playback)
        try {
          const cache = await caches.open('quran-audio-cache');
          const matched = await cache.match(activeUrl);
          if (matched) {
            const blob = await matched.blob();
            objectUrl = URL.createObjectURL(blob);
            console.log("[AudioContext] Serving downloaded audio from Cache Storage:", activeUrl);
            if (audioRef.current) {
              audioRef.current.src = objectUrl;
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(e => {
                  console.warn("[AudioContext] Cache blob playback warning:", e);
                });
              }
            }
            return;
          }
        } catch (cacheErr) {
          console.warn("[AudioContext] Cache Storage check failed:", cacheErr);
        }

        // 2. Device is offline and track is not downloaded
        if (!navigator.onLine) {
          console.warn("[AudioContext] Device is offline and track is not cached:", activeUrl);
          setIsPlaying(false);
          window.dispatchEvent(new CustomEvent('asrarhub_offline_audio_missing', {
            detail: { title: currentTrack?.title || 'Audios' }
          }));
          return;
        }

        // 3. Device is online: play via network
        const resolvedSrc = activeUrl;

        if (audioRef.current) {
          audioRef.current.src = resolvedSrc;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              if (e.name !== 'AbortError' && e.name !== 'NotSupportedError') {
                console.warn("[AudioContext] Standard playback failed, trying cache fallback...", e);
                tryFallbackToCache();
              }
            });
          }
        }
      } catch (error) {
        console.error("Audio playback error:", error);
        tryFallbackToCache();
      }
    };

    audioRef.current.addEventListener('error', handleError);
    loadAudio();

    // Media Session API Setup
    if ('mediaSession' in navigator && currentTrack) {
      const activeTitle = (currentTrack.isCollection && currentTrack.subTracks)
        ? (currentTrack.subTracks[currentSubIndex]?.title || currentTrack.title)
        : currentTrack.title;
        
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeTitle || 'Unknown Title',
        artist: currentTrack.artist || 'AsrarHub',
        artwork: [
          { src: currentTrack.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500', sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack, currentSubIndex]);

  // Setup Media Session action handlers whenever next/prev/pause/resume are stable or updated
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current && currentTrack) {
          audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      });
      
      const handleNext = () => {
        const { playlist: currentPlaylist, currentIndex: currentIdx, currentSubIndex: currSubIdx, currentTrack: currTrack } = stateRef.current;
        if (currTrack?.isCollection && currTrack.subTracks && currSubIdx < currTrack.subTracks.length - 1) {
          setCurrentSubIndex(currSubIdx + 1);
        } else if (currentIdx < currentPlaylist.length - 1) {
          const newIndex = currentIdx + 1;
          setCurrentIndex(newIndex);
          setCurrentSubIndex(currentPlaylist[newIndex]?.isCollection ? 0 : -1);
          setCurrentTrack(currentPlaylist[newIndex]);
        }
      };
      
      const handlePrev = () => {
        const { playlist: currentPlaylist, currentIndex: currentIdx, currentSubIndex: currSubIdx, currentTrack: currTrack } = stateRef.current;
        if (currTrack?.isCollection && currTrack.subTracks && currSubIdx > 0) {
          setCurrentSubIndex(currSubIdx - 1);
        } else if (currentIdx > 0) {
          const newIndex = currentIdx - 1;
          setCurrentIndex(newIndex);
          setCurrentSubIndex(currentPlaylist[newIndex]?.isCollection ? 0 : -1);
          setCurrentTrack(currentPlaylist[newIndex]);
        }
      };

      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
  }, []);

  const playTrack = (track: Track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    setCurrentSubIndex(track.isCollection ? 0 : -1);
    setCurrentTrack(track);
  };

  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setCurrentSubIndex(tracks[startIndex]?.isCollection ? 0 : -1);
    setCurrentTrack(tracks[startIndex]);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Audio playback error:", e);
          }
        });
      }
    }
  };

  const next = () => {
    if (currentTrack?.isCollection && currentTrack.subTracks && currentSubIndex < currentTrack.subTracks.length - 1) {
      setCurrentSubIndex(currentSubIndex + 1);
      return;
    }
    if (currentIndex < playlist.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentSubIndex(playlist[newIndex]?.isCollection ? 0 : -1);
      setCurrentTrack(playlist[newIndex]);
    } else if (loopMode === 'playlist' && playlist.length > 0) {
      setCurrentIndex(0);
      setCurrentSubIndex(playlist[0]?.isCollection ? 0 : -1);
      setCurrentTrack(playlist[0]);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (currentTrack?.isCollection && currentTrack.subTracks && currentSubIndex > 0) {
      setCurrentSubIndex(currentSubIndex - 1);
      return;
    }
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentSubIndex(playlist[newIndex]?.isCollection ? (playlist[newIndex].subTracks?.length || 1) - 1 : -1);
      setCurrentTrack(playlist[newIndex]);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const clear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentSubIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist || 'Tariqa Tijaniyya',
        artwork: [
          { src: currentTrack.coverImage || '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: currentTrack.coverImage || '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => next());
    }
  }, [currentTrack]);

  return (
    <AudioContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      currentSubIndex,
      progress,
      currentTime,
      duration,
      loopMode,
      setLoopMode,
      currentEffect,
      setAudioEffect: (effect: AudioEffect) => {
        setCurrentEffect(effect);
        applyEffect(effect);
      },
      playTrack,
      playPlaylist,
      pause,
      resume,
      next,
      prev,
      seek,
      clear,
      setVolume,
      volume,
      quranRepeatCount,
      setQuranRepeatCount,
      quranRangeRepeatCount,
      setQuranRangeRepeatCount
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
