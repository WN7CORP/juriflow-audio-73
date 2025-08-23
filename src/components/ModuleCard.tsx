
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { Module } from "@/types/course";
import { Play, Clock, CheckCircle2, BookOpen, Star, ArrowRight } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard = ({ module, onClick }: ModuleCardProps) => {
  const { completedLessons } = useProgress();
  
  const completedCount = module.lessons.filter(lesson => 
    completedLessons.has(lesson.id?.toString() || '')
  ).length;
  
  const progressPercentage = module.lessons.length > 0 ? (completedCount / module.lessons.length) * 100 : 0;
  const isCompleted = progressPercentage === 100;
  const isStarted = progressPercentage > 0;
  
  // Use modulo column as cover, fallback to first lesson's capa
  const moduleCover = module.lessons[0]?.modulo || module.lessons[0]?.capa || '/placeholder.svg';
  
  // Calculate total estimated duration (15 min per lesson)
  const estimatedDuration = module.lessons.length * 15;
  
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-medium animate-pulse">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Concluído
        </Badge>
      );
    }
    if (isStarted) {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30 font-medium animate-bounce" style={{ animationDuration: '2s' }}>
          <Play className="h-3 w-3 mr-1" />
          Em Andamento
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-medium animate-pulse">
        <Star className="h-3 w-3 mr-1" />
        Novo
      </Badge>
    );
  };

  const getGradientOverlay = () => {
    if (isCompleted) return "from-green-900/80 via-green-800/40 to-transparent";
    if (isStarted) return "from-primary/80 via-primary/40 to-transparent";
    return "from-amber-900/80 via-amber-800/40 to-transparent";
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 transform hover:scale-[1.05] hover:-translate-y-2 animate-fade-in"
      onClick={onClick}
    >
      {/* Cover Image - Enhanced with better gradients */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={moduleCover}
          alt={`Módulo Dia ${module.day}`}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-1"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${getGradientOverlay()} transition-all duration-700 group-hover:opacity-90`} />
        
        {/* Play Button with Enhanced Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
          <div className="bg-primary/95 backdrop-blur-sm rounded-full p-6 sm:p-8 transform transition-all duration-500 shadow-2xl animate-pulse group-hover:animate-bounce">
            <Play className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground fill-current" />
          </div>
        </div>
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4 animate-slide-in-right">
          {getStatusBadge()}
        </div>

        {/* Progress Indicator - Top Left */}
        {isStarted && (
          <div className="absolute top-4 left-4 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-bold shadow-lg animate-pulse">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        )}

        {/* Module Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-6 w-6 text-white flex-shrink-0 animate-pulse" />
            <h3 className="font-bold text-2xl sm:text-3xl text-white drop-shadow-lg">
              Dia {module.day}
            </h3>
          </div>
          
          {/* Quick Stats on Cover */}
          <div className="flex items-center gap-4 text-white/90 text-sm backdrop-blur-sm bg-black/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Play className="h-4 w-4" />
              <span className="font-medium">{module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <Clock className="h-4 w-4" />
              <span className="font-medium">~{Math.ceil(estimatedDuration)} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Enhanced Layout */}
      <div className="p-6 bg-gradient-to-b from-background to-muted/20">
        {/* Progress Section - Enhanced */}
        <div className="space-y-4 mb-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">Progresso</span>
            <span className="text-sm font-bold text-foreground bg-primary/10 px-3 py-1.5 rounded-full animate-pulse">
              {completedCount}/{module.lessons.length}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-4 bg-muted transition-all duration-1000"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">
              {Math.round(progressPercentage)}% concluído
            </span>
            {isCompleted && (
              <span className="text-green-400 font-bold flex items-center gap-1 animate-bounce">
                <CheckCircle2 className="h-4 w-4" />
                Parabéns! 🎉
              </span>
            )}
          </div>
        </div>

        {/* Next lesson preview - Enhanced */}
        {!isCompleted && (
          <div className="pt-4 border-t border-border animate-fade-in" style={{ animationDelay: '700ms' }}>
            <div className="text-xs text-muted-foreground mb-2 font-semibold flex items-center gap-1">
              {isStarted ? '▶️ Continue com:' : '🚀 Comece com:'}
            </div>
            <div className="text-sm font-semibold text-foreground line-clamp-2 leading-relaxed mb-2">
              {module.lessons.find(lesson => !completedLessons.has(lesson.id?.toString() || ''))?.Tema || module.lessons[0]?.Tema}
            </div>
            {isStarted && (
              <div className="flex items-center gap-2 text-xs text-primary font-bold animate-pulse">
                Continue de onde parou 
                <ArrowRight className="h-3 w-3" />
              </div>
            )}
          </div>
        )}

        {/* Completion celebration */}
        {isCompleted && (
          <div className="pt-4 border-t border-green-500/30 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4">
              <div className="text-green-400 font-bold text-base mb-2 animate-bounce">
                🎉 Módulo Concluído! 🎉
              </div>
              <div className="text-xs text-muted-foreground animate-pulse">
                Excelente trabalho! Continue sua jornada de aprendizado.
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
