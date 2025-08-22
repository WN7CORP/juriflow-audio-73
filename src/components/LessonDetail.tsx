
import { useState, useEffect } from "react";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import { LessonHeader } from "./lesson/LessonHeader";
import { LessonInfo } from "./lesson/LessonInfo";
import { LessonNavigation } from "./lesson/LessonNavigation";
import { Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

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
  const { completedLessons, getLessonProgress, getCompletionRate } = useProgress();
  const [lessonDuration, setLessonDuration] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const lessonKey = lesson.id?.toString() || '';
  const isCompleted = completedLessons.has(lessonKey);
  const progressPercent = getCompletionRate(lessonKey);

  const handleVideoComplete = () => {
    console.log('Video completed, hasNext:', hasNext);
    if (hasNext) {
      console.log('Starting auto-advance timer');
      const timer = setTimeout(() => {
        console.log('Auto-advancing to next lesson');
        handleNextClick();
      }, 3000);
      setAutoAdvanceTimer(timer);
    }
  };

  const handleDurationChange = (duration: number) => {
    setLessonDuration(duration);
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
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [lesson.id]);

  // Clear timer when user manually navigates
  const handleManualNavigation = (navigationFn: () => void) => {
    console.log('Manual navigation triggered');
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setIsTransitioning(true);
    
    // Small delay for smooth transition
    setTimeout(() => {
      navigationFn();
    }, 100);
  };

  const handleNextClick = () => {
    console.log('Next button clicked, hasNext:', hasNext);
    if (hasNext) {
      handleManualNavigation(onNextLesson);
    }
  };

  const handlePreviousClick = () => {
    console.log('Previous button clicked, hasPrevious:', hasPrevious);
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
            />
          </div>

          {/* Video Info - Mobile Optimized */}
          <LessonInfo
            lesson={lesson}
            duration={lessonDuration}
            progressPercent={progressPercent}
            isCompleted={isCompleted}
          />
        </div>

        {/* Sidebar - Mobile Bottom Sheet Style */}
        <LessonNavigation
          lesson={lesson}
          progressPercent={progressPercent}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isCompleted={isCompleted}
          autoAdvanceTimer={!!autoAdvanceTimer}
          onNext={handleNextClick}
          onPrevious={handlePreviousClick}
        />
      </div>
    </div>
  );
};
