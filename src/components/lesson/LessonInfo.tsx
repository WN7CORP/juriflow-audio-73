
import { Clock, CheckCircle, Play, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaybackSpeedControl } from "@/components/PlaybackSpeedControl";
import { QuestionsButton } from "@/components/QuestionsButton";
import { Lesson } from "@/types/course";
import { useState } from "react";
import { QuestionsModal } from "@/components/QuestionsModal";

interface LessonInfoProps {
  lesson: Lesson;
  duration: number;
  progressPercent: number;
  isCompleted: boolean;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  hasQuestions?: boolean;
  questions?: any[];
  answeredQuestions?: Set<number>;
  canAnswerQuestions?: boolean;
  onQuestionSelect?: (questionId: number) => boolean;
}

export const LessonInfo = ({ 
  lesson, 
  duration, 
  progressPercent, 
  isCompleted, 
  playbackSpeed, 
  onPlaybackSpeedChange,
  hasQuestions = false,
  questions = [],
  answeredQuestions = new Set(),
  canAnswerQuestions = false,
  onQuestionSelect
}: LessonInfoProps) => {
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOpenQuestions = () => {
    setShowQuestionsModal(true);
  };

  const handleQuestionSelect = (questionId: number) => {
    if (onQuestionSelect) {
      const success = onQuestionSelect(questionId);
      if (success) {
        setShowQuestionsModal(false);
      }
      return success;
    }
    return false;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Progress Bar - Always visible and prominent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso da aula</span>
          <span className="font-medium text-primary">{Math.round(progressPercent || 0)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${Math.max(progressPercent || 1, 1)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
            {/* 80% Mark for Questions */}
            <div className="absolute left-[80%] top-0 w-0.5 h-full bg-orange-500 opacity-70"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className="text-orange-600">80% (questões)</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-4">
        {/* Duration */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{duration > 0 ? formatDuration(duration) : 'Carregando...'}</span>
        </div>

        {/* Completion Status */}
        {isCompleted && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluída
          </Badge>
        )}

        {/* In Progress */}
        {progressPercent > 0 && progressPercent < 90 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Play className="h-3 w-3 mr-1" />
            Em andamento
          </Badge>
        )}

        {/* Questions Available */}
        {hasQuestions && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <HelpCircle className="h-3 w-3 mr-1" />
            Com questões
          </Badge>
        )}
      </div>

      {/* Lesson Title and Description */}
      <div className="space-y-2">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground line-clamp-2">
          {lesson.Tema || lesson.Nome}
        </h1>
        
        {lesson.Descricao && (
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed line-clamp-3 lg:line-clamp-4">
            {lesson.Descricao}
          </p>
        )}
      </div>

      {/* Questions Button - Always visible but conditional behavior */}
      {hasQuestions && questions.length > 0 && (
        <div className="flex justify-center">
          <QuestionsButton
            canAnswerQuestions={canAnswerQuestions}
            totalQuestions={questions.length}
            answeredQuestions={answeredQuestions.size}
            onOpenQuestions={handleOpenQuestions}
            videoProgress={progressPercent}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Aula {lesson.Aula} • Dia {lesson.Dia}
        </div>
        
        <PlaybackSpeedControl
          currentSpeed={playbackSpeed}
          onSpeedChange={onPlaybackSpeedChange}
        />
      </div>

      {/* Module Information */}
      {lesson.conteudo && (
        <Card className="bg-accent/50 border-accent">
          <CardContent className="p-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Conteúdo:</span> {lesson.conteudo}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Modal */}
      <QuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => setShowQuestionsModal(false)}
        questions={questions}
        answeredQuestions={answeredQuestions}
        canAnswerQuestions={canAnswerQuestions}
        onQuestionSelect={handleQuestionSelect}
      />
    </div>
  );
};
