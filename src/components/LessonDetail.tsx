
import { useState, useEffect } from "react";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import { StudyMaterialButton } from "./StudyMaterialButton";
import { LessonHeader } from "./lesson/LessonHeader";
import { LessonInfo } from "./lesson/LessonInfo";
import { LessonNavigation } from "./lesson/LessonNavigation";
import { Lesson } from "@/types/course";
import { useProgressByIP } from "@/hooks/useProgressByIP";

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const LessonDetail = ({
  lesson,
  onBack,
  onNextLesson,
  onPreviousLesson,
  hasNext,
  hasPrevious,
}: LessonDetailProps) => {
  const { getCompletionRate, isCompleted } = useProgressByIP();
  const [lessonDuration, setLessonDuration] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const lessonKey = lesson.id?.toString() || '';

  // Load progress when lesson changes
  useEffect(() => {
    const loadProgress = async () => {
      const progress = getCompletionRate(lessonKey);
      const complete = isCompleted(lessonKey);
      setProgressPercent(progress);
      setCompleted(complete);
    };

    loadProgress();
  }, [lessonKey, getCompletionRate, isCompleted]);

  const handleVideoComplete = () => {
    setCompleted(true);
    if (hasNext) {
      const timer = setTimeout(() => {
        handleNextClick();
      }, 3000);
      setAutoAdvanceTimer(timer);
    }
  };

  const handleDurationChange = (duration: number) => {
    setLessonDuration(duration);
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleTimeUpdate = (time: number, playing: boolean) => {
    setCurrentTime(time);
    setIsPlaying(playing);
  };

  // Clear auto-advance timer when component unmounts or lesson changes
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer, lesson.id]);

  // Reset transition state when lesson changes
  useEffect(() => {
    setIsTransitioning(false);
    setCurrentTime(0);
    setIsPlaying(false);
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [lesson.id]);

  // Clear timer when user manually navigates
  const handleManualNavigation = (navigationFn: () => void) => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setIsTransitioning(true);
    
    setTimeout(() => {
      navigationFn();
    }, 100);
  };

  const handleNextClick = () => {
    if (hasNext) {
      handleManualNavigation(onNextLesson);
    }
  };

  const handlePreviousClick = () => {
    if (hasPrevious) {
      handleManualNavigation(onPreviousLesson);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <LessonHeader lesson={lesson} onBack={onBack} isMobile={true} />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Video Section - Mobile First */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <LessonHeader lesson={lesson} onBack={onBack} isMobile={false} />
          </div>

          {/* Video Player Container with transition */}
          <div className={`relative bg-black transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <EnhancedVideoPlayer
              key={`${lesson.id}-${lesson.video}`}
              videoUrl={lesson.video || ''}
              lessonKey={lessonKey}
              onVideoEnd={handleVideoComplete}
              onVideoStart={() => console.log('Video started:', lesson.Tema)}
              title={lesson.Tema}
              autoPlay={true}
              onDurationChange={handleDurationChange}
              playbackSpeed={playbackSpeed}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Video Info - Mobile Optimized */}
          <LessonInfo
            lesson={lesson}
            duration={lessonDuration}
            progressPercent={progressPercent}
            isCompleted={completed}
            playbackSpeed={playbackSpeed}
            onPlaybackSpeedChange={handlePlaybackSpeedChange}
            currentTime={currentTime}
            isPlaying={isPlaying}
          />
        </div>

        {/* Sidebar - Mobile Bottom Sheet Style */}
        <LessonNavigation
          lesson={lesson}
          progressPercent={progressPercent}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isCompleted={completed}
          autoAdvanceTimer={!!autoAdvanceTimer}
          onNext={handleNextClick}
          onPrevious={handlePreviousClick}
        />
      </div>

      {/* Study Material Button - Floating above professor chat */}
      <StudyMaterialButton 
        materialUrl={lesson.material}
        lessonTitle={lesson.Tema}
      />
    </div>
  );
};
