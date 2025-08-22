import { useState, useRef } from 'react';
import { YouTubePlayer } from './YouTubePlayer';
import { isYouTubeUrl, extractYouTubeId } from '@/lib/utils';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
  title?: string;
}

const DropboxVideoPlayer = ({ videoUrl, onVideoEnd, onVideoStart, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert Dropbox share URL to direct video URL
  const getDirectDropboxUrl = (url: string) => {
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    return url;
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      onVideoStart?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onVideoEnd?.();
  };

  const handleLoadStart = () => {
    setShowControls(true);
  };

  const directUrl = getDirectDropboxUrl(videoUrl);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onPlay={() => {
          setIsPlaying(true);
          onVideoStart?.();
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onLoadStart={handleLoadStart}
        controls
        preload="metadata"
        playsInline
      >
        <source src={directUrl} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      
      {/* Custom Play/Pause Overlay */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-primary/90 rounded-full p-4">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoPlayer = ({ videoUrl, onVideoEnd, onVideoStart, title }: VideoPlayerProps) => {
  // Check if it's a YouTube URL
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return (
        <YouTubePlayer
          videoId={videoId}
          onVideoEnd={onVideoEnd || (() => {})}
          onVideoStart={onVideoStart || (() => {})}
        />
      );
    }
  }

  // Default to Dropbox/direct video player
  return (
    <DropboxVideoPlayer
      videoUrl={videoUrl}
      onVideoEnd={onVideoEnd}
      onVideoStart={onVideoStart}
      title={title}
    />
  );
};