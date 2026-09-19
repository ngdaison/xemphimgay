"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Minimize, SkipForward, SkipBack, Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quality {
  label: string;
  height: number;
}

const QUALITIES: Quality[] = [
  { label: '4K (2160p)', height: 2160 },
  { label: 'FHD (1080p)', height: 1080 },
  { label: 'HD (720p)', height: 720 },
  { label: 'SD (480p)', height: 480 },
  { label: 'Auto', height: -1 },
];

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, onEnded, onNext, onPrev, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'quality' | 'speed'>('main');
  const [currentQuality, setCurrentQuality] = useState(-1); // auto
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setVideoError(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let hls: Hls | null = null;

    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
          setIsLoading(false);
          setVideoError(true);
        }
      });
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });
    } else {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });
    }

    const handleVideoError = () => {
      setIsLoading(false);
      setVideoError(true);
    };
    video.addEventListener('error', handleVideoError);

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('error', handleVideoError);
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const setQuality = (height: number) => {
    setCurrentQuality(height);
    if (hlsRef.current && height > 0) {
      const levels = hlsRef.current.levels;
      const idx = levels.findIndex(l => l.height === height);
      if (idx >= 0) {
        hlsRef.current.currentLevel = idx;
      }
    } else if (hlsRef.current && height === -1) {
      hlsRef.current.currentLevel = -1; // auto
    }
  };

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, volume]);

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const currentQualityLabel = QUALITIES.find(q => q.height === currentQuality)?.label || 'Auto';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black group overflow-hidden select-none touch-none",
        isFullscreen ? "w-screen h-screen" : "w-full aspect-video rounded-none lg:rounded-3xl border border-white/5 shadow-2xl"
      )}
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.controls-area')) togglePlay();
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* Loading Overlay */}
      {isLoading && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
        </div>
      )}

      {/* Video Error Overlay */}
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 gap-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
            <Play className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Video chưa sẵn sàng</p>
          <p className="text-zinc-600 text-xs max-w-xs text-center">Nguồn video đang được xử lý hoặc chưa được upload. Vui lòng thử lại sau.</p>
          <button 
            onClick={() => { setVideoError(false); setIsLoading(true); if (videoRef.current) videoRef.current.load(); }}
            className="bg-primary-container hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Center Play/Pause Indicator */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {!isPlaying && !isLoading && (
          <div className="w-20 h-20 bg-primary-container/90 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 animate-in zoom-in duration-300">
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </div>
        )}
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-20 right-8 w-56 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden z-50 controls-area"
          onClick={(e) => e.stopPropagation()}>
          {settingsTab === 'main' && (
            <div className="py-2">
              <button
                onClick={() => setSettingsTab('quality')}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                <span>Chất lượng</span>
                <span className="text-zinc-400">{currentQualityLabel}</span>
              </button>
              <button
                onClick={() => setSettingsTab('speed')}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                <span>Tốc độ</span>
                <span className="text-zinc-400">{playbackSpeed}x</span>
              </button>
              <button
                onClick={() => { setShowSettings(false); setSettingsTab('main'); }}
                className="w-full flex items-center justify-center px-4 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 mr-2" /> Đóng
              </button>
            </div>
          )}
          {settingsTab === 'quality' && (
            <div className="py-2">
              <button
                onClick={() => setSettingsTab('main')}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ← Quay lại
              </button>
              {QUALITIES.map(q => (
                <button
                  key={q.height}
                  onClick={() => { setQuality(q.height); setSettingsTab('main'); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <span>{q.label}</span>
                  {currentQuality === q.height && <Check className="w-4 h-4 text-primary-container" />}
                </button>
              ))}
            </div>
          )}
          {settingsTab === 'speed' && (
            <div className="py-2">
              <button
                onClick={() => setSettingsTab('main')}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ← Quay lại
              </button>
              {PLAYBACK_SPEEDS.map(speed => (
                <button
                  key={speed}
                  onClick={() => { setSpeed(speed); setSettingsTab('main'); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <span>{speed}x</span>
                  {playbackSpeed === speed && <Check className="w-4 h-4 text-primary-container" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-all duration-500 controls-area",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        {/* Title Bar */}
        {title && (
          <div className="mb-4">
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
        )}

        {/* Progress Bar */}
        <div className="group/progress relative w-full h-1.5 mb-6 flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container shadow-[0_0_15px_rgba(229,9,20,0.8)] relative"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={togglePlay} className="text-white hover:text-primary-container transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            {onPrev && (
              <button onClick={onPrev} className="text-white hover:text-primary-container transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="text-white hover:text-primary-container transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            )}

            <div className="flex items-center gap-4 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-primary-container transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary-container cursor-pointer overflow-hidden"
              />
            </div>

            <div className="text-white font-mono text-xs font-bold tracking-tight">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-white/40">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/10 backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{currentQualityLabel}</span>
            </div>

            <button
              onClick={() => { setShowSettings(!showSettings); setSettingsTab('main'); }}
              className="text-white hover:text-primary-container transition-colors hover:rotate-90 duration-500"
            >
              <Settings className="w-6 h-6" />
            </button>

            <button onClick={toggleFullscreen} className="text-white hover:text-primary-container transition-colors">
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint (shown briefly) */}
      <div className="absolute top-4 right-4 text-[8px] text-white/30 font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        Space: Play/Pause • F: Fullscreen • ←→: Seek • ↑↓: Volume
      </div>
    </div>
  );
};
