import { useState, useRef, useEffect } from 'react';
import { YouTubePlayer } from './YouTubePlayer';
import { isYouTubeUrl, extractYouTubeId } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipForward, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useProgress } from '@/hooks/useProgress';

interface EnhancedVideoPlayerProps {
  videoUrl: string;
  lessonKey: string;
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
  title?: string;
  autoPlay?: boolean;
  onDurationChange?: (duration: number) => void;
}

const DropboxVideoPlayer = ({ 
  videoUrl, 
  lessonKey,
  onVideoEnd, 
  onVideoStart, 
  title, 
  autoPlay = true,
  onDurationChange
}: EnhancedVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { updateLessonProgress, getLessonProgress } = useProgress();

  const getDirectDropboxUrl = (url: string) => {
    if (!url || typeof url !== 'string') {
      console.warn('Invalid video URL provided:', url);
      return '';
    }
    
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    return url;
  };

  // Auto-hide controls when playing
  const hideControlsAfterDelay = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000); // Hide after 3 seconds
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (isPlaying) {
      hideControlsAfterDelay();
    }
  };

  // Reset all states when video URL or lesson changes
  useEffect(() => {
    console.log('Video URL or lesson changed, resetting states');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setCanPlay(false);
    setShowControls(true);
    
    // Clear any existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      
      // Force reload the video source
      const directUrl = getDirectDropboxUrl(videoUrl);
      if (directUrl && video.src !== directUrl) {
        video.src = directUrl;
        video.load();
      }
    }
  }, [videoUrl, lessonKey]);

  // Handle controls auto-hide when playing state changes
  useEffect(() => {
    if (isPlaying) {
      hideControlsAfterDelay();
    } else {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
      setCanPlay(false);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
      setCanPlay(true);
      
      // Immediately try to play when video can play
      if (autoPlay) {
        video.play().then(() => {
          console.log('Auto-play started on canPlay');
          setIsLoading(false);
        }).catch((error) => {
          console.log('Auto-play failed on canPlay:', error);
          setIsLoading(false);
        });
      }
    };

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded');
      const videoDuration = video.duration;
      setDuration(videoDuration);
      onDurationChange?.(videoDuration);
      
      // Resume from saved position
      const lessonProgress = getLessonProgress(lessonKey);
      if (lessonProgress && lessonProgress.lastPosition > 0 && lessonProgress.lastPosition < videoDuration * 0.9) {
        video.currentTime = lessonProgress.lastPosition;
      }
    };

    const handleCanPlayThrough = () => {
      console.log('Video can play through, autoPlay:', autoPlay);
      // Auto-play if enabled and can play
      if (autoPlay) {
        video.play().then(() => {
          console.log('Auto-play started on canPlayThrough');
          setIsLoading(false);
        }).catch((error) => {
          console.log('Auto-play failed on canPlayThrough:', error);
          setIsLoading(false);
        });
      }
    };

    const handleTimeUpdate = () => {
      const currentTimeValue = video.currentTime;
      setCurrentTime(currentTimeValue);
      
      if (duration > 0) {
        const progressPercent = (currentTimeValue / duration) * 100;
        updateLessonProgress(lessonKey, progressPercent, currentTimeValue, duration);
      }
    };

    const handlePlay = () => {
      console.log('Video playing');
      setIsPlaying(true);
      setIsLoading(false);
      onVideoStart?.();
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('Video ended');
      setIsPlaying(false);
      updateLessonProgress(lessonKey, 100, duration, duration);
      onVideoEnd?.();
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [lessonKey, duration, autoPlay, canPlay, updateLessonProgress, getLessonProgress, onVideoStart, onVideoEnd, onDurationChange]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const lessonProgress = getLessonProgress(lessonKey);
  const completionRate = lessonProgress ? (lessonProgress.watchTime / duration) * 100 : 0;

  const directUrl = getDirectDropboxUrl(videoUrl);

  if (!directUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center animate-fade-in">
        <div className="text-white text-center">
          <p className="text-base lg:text-lg mb-2">Vídeo não disponível</p>
          <p className="text-sm text-gray-400">O link do vídeo não foi encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group animate-fade-in cursor-pointer"
      onMouseEnter={showControlsTemporarily}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) {
          hideControlsAfterDelay();
        }
      }}
      onClick={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain transition-opacity duration-300"
        preload="metadata"
        playsInline
        src={directUrl}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-fade-in z-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 lg:h-10 lg:w-10 text-white animate-spin mx-auto mb-2" />
            <p className="text-white text-sm lg:text-base">Carregando vídeo...</p>
          </div>
        </div>
      )}
      
      {/* Progress Bar at Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 z-40">
        <div 
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
        {lessonProgress && (
          <div 
            className="absolute top-0 h-full bg-primary/40"
            style={{ width: `${completionRate}%` }}
          />
        )}
      </div>

      {/* Custom Controls */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 z-30 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${!isLoading ? 'animate-fade-in' : ''}`}>
        {/* Center Play/Pause */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 lg:p-4 transition-all duration-200 hover:scale-110 animate-scale-in"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 lg:h-8 lg:w-8" />
            ) : (
              <Play className="h-5 w-5 lg:h-8 lg:w-8 ml-1" />
            )}
          </Button>

          {/* Skip Controls */}
          <div className="absolute right-3 lg:right-4 flex gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(-10)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
            >
              <RotateCcw className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(10)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
            >
              <SkipForward className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-4">
          <div className="flex items-center gap-1 lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20 transition-colors duration-200 p-1 lg:p-2"
            >
              {isPlaying ? <Pause className="h-3 w-3 lg:h-4 lg:w-4" /> : <Play className="h-3 w-3 lg:h-4 lg:w-4" />}
            </Button>

            <div className="flex-1 flex items-center gap-1 lg:gap-2">
              <span className="text-white text-xs lg:text-sm min-w-[35px] lg:min-w-[45px]">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-white text-xs lg:text-sm min-w-[35px] lg:min-w-[45px]">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-1 lg:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 transition-colors duration-200 p-1 lg:p-2"
              >
                {isMuted ? <VolumeX className="h-3 w-3 lg:h-4 lg:w-4" /> : <Volume2 className="h-3 w-3 lg:h-4 lg:w-4" />}
              </Button>
              
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-10 lg:w-20"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 transition-colors duration-200 p-1 lg:p-2"
              >
                <Maximize className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && (
        <div className={`absolute top-4 left-4 right-4 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        } ${!isLoading ? 'animate-fade-in' : ''}`}>
          <h3 className="text-white text-sm lg:text-lg font-medium drop-shadow-lg line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export const EnhancedVideoPlayer = (props: EnhancedVideoPlayerProps) => {
  // Check if it's a YouTube URL
  if (isYouTubeUrl(props.videoUrl)) {
    const videoId = extractYouTubeId(props.videoUrl);
    if (videoId) {
      return (
        <YouTubePlayer
          videoId={videoId}
          onVideoEnd={props.onVideoEnd || (() => {})}
          onVideoStart={props.onVideoStart || (() => {})}
        />
      );
    }
  }

  // Default to enhanced Dropbox/direct video player - ensure autoPlay is always true
  return <DropboxVideoPlayer {...props} autoPlay={true} />;
};
