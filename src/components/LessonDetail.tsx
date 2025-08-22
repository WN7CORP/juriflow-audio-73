import { useState, useEffect } from "react";
import { Lesson } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Play } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { useProgress } from "@/hooks/useProgress";

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const LessonDetail = ({ 
  lesson, 
  onBack, 
  onNextLesson, 
  onPreviousLesson,
  hasNext,
  hasPrevious 
}: LessonDetailProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const { completedLessons, markAsCompleted } = useProgress();
  
  const lessonKey = `${lesson.Dia}-${lesson.Aula}`;
  const isCompleted = completedLessons.has(lessonKey);
  const hasVideo = lesson.video && lesson.video.trim() !== '';

  const handleVideoStart = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    if (!isCompleted) {
      markAsCompleted(lessonKey);
    }
  };

  const handleMarkCompleted = () => {
    markAsCompleted(lessonKey);
  };

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Aula {lesson.Aula}: {lesson.Tema}
            </h1>
            <p className="text-sm text-muted-foreground">
              Módulo {lesson.Dia}
            </p>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Concluída</span>
          </div>
        )}
      </div>

      {/* Video Player */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {showVideo && hasVideo ? (
              <VideoPlayer
                videoUrl={lesson.video}
                onVideoEnd={handleVideoEnd}
                onVideoStart={handleVideoStart}
                title={lesson.Tema}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card cursor-pointer group"
                onClick={handleVideoClick}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {lesson.Tema}
                  </h3>
                  <p className="text-muted-foreground">
                    Clique para assistir a aula
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      {lesson.conteudo && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Material de Apoio
            </h2>
            <div 
              className="prose prose-invert max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: lesson.conteudo.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {hasPrevious && (
            <Button variant="outline" onClick={onPreviousLesson} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Aula Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {!isCompleted && (
            <Button variant="secondary" onClick={handleMarkCompleted} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Marcar como Concluída
            </Button>
          )}
          
          {hasNext && (
            <Button onClick={onNextLesson} className="gap-2">
              Próxima Aula
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};