import { useState, useEffect } from "react";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import { VideoQuestionModal } from "./VideoQuestionModal";
import { LessonHeader } from "./lesson/LessonHeader";
import { LessonInfo } from "./lesson/LessonInfo";
import { LessonNavigation } from "./lesson/LessonNavigation";
import { LessonFooter } from "./lesson/LessonFooter";
import { Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";
import { useVideoQuestions } from "@/hooks/useVideoQuestions";

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const lessonKey = lesson.id?.toString() || '';
  const isCompleted = completedLessons.has(lessonKey);
  const progressPercent = getCompletionRate(lessonKey);

  // Video questions hook
  const {
    currentQuestion,
    showQuestion,
    checkVideoProgress,
    submitAnswer,
    resetQuestionTrigger,
    startQuestionSession,
    hasQuestions
  } = useVideoQuestions(lesson.Aula || '');

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

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    // Check if we should trigger a question
    checkVideoProgress(currentTime, duration);
  };

  const handleQuestionAnswer = (selectedAnswer: string) => {
    const isCorrect = submitAnswer(selectedAnswer);
    
    // Pause the video when question appears
    if (typeof window !== 'undefined' && (window as any).videoPauseForQuestion) {
      (window as any).videoPauseForQuestion();
    }
    
    // Resume video after question is answered (with delay for feedback)
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).videoResumeFromQuestion) {
        (window as any).videoResumeFromQuestion();
      }
    }, 2000);

    return isCorrect;
  };

  // Clear auto-advance timer when component unmounts or lesson changes
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer, lesson.id]);

  // Reset transition state and question trigger when lesson changes
  useEffect(() => {
    setIsTransitioning(false);
    resetQuestionTrigger();
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [lesson.id, resetQuestionTrigger]);

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
    <div className="min-h-screen bg-background pb-20">
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
              onProgressUpdate={handleVideoProgress}
            />
          </div>

          {/* Video Info - Mobile Optimized */}
          <LessonInfo
            lesson={lesson}
            duration={lessonDuration}
            progressPercent={progressPercent}
            isCompleted={isCompleted}
            playbackSpeed={playbackSpeed}
            onPlaybackSpeedChange={handlePlaybackSpeedChange}
            hasQuestions={hasQuestions}
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

      {/* Question Footer Button */}
      <LessonFooter
        hasQuestions={hasQuestions}
        onStartQuestions={startQuestionSession}
      />

      {/* Video Question Modal */}
      <VideoQuestionModal
        question={currentQuestion}
        onAnswer={handleQuestionAnswer}
        isVisible={showQuestion}
      />
    </div>
  );
};
