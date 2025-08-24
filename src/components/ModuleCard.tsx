
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { Module } from "@/types/course";
import { Play, Clock, CheckCircle2, BookOpen, Star } from "lucide-react";

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
  
  // Use capaModulos from first lesson, fallback to capa
  const moduleCover = module.lessons[0]?.capaModulos || module.lessons[0]?.capa || '/placeholder.svg';
  
  // Calculate total estimated duration (15 min per lesson)
  const estimatedDuration = module.lessons.length * 15;
  
  // Get module display name
  const moduleDisplayName = module.moduleArea || module.lessons[0]?.Area || `Módulo ${module.day}`;
  
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-medium animate-scale-in">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Concluído
        </Badge>
      );
    }
    if (isStarted) {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30 font-medium animate-scale-in">
          <Play className="h-3 w-3 mr-1" />
          Em Andamento
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-medium animate-scale-in">
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
    <div className="animate-fade-in">
      <Card 
        className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.03] animate-scale-in"
        style={{ animationDelay: `${Math.random() * 200}ms` }}
        onClick={onClick}
      >
        {/* Cover Image - Enhanced with better gradients */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={moduleCover}
            alt={`${moduleDisplayName}`}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${getGradientOverlay()} transition-all duration-500`} />
          
          {/* Play Button with Enhanced Animation */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
            <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 sm:p-6 transform scale-50 group-hover:scale-100 transition-all duration-700 shadow-2xl animate-pulse">
              <Play className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground fill-current" />
            </div>
          </div>
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4 transition-all duration-500 group-hover:scale-110">
            {getStatusBadge()}
          </div>

          {/* Progress Indicator - Top Left */}
          {isStarted && (
            <div className="absolute top-4 left-4 transition-all duration-500 group-hover:scale-110">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium animate-pulse">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          )}

          {/* Module Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 transition-all duration-500 group-hover:translate-y-[-4px]">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-white flex-shrink-0 transition-all duration-500 group-hover:scale-110" />
              <h3 className="font-bold text-xl sm:text-2xl text-white transition-all duration-500 group-hover:text-primary-foreground line-clamp-2">
                {moduleDisplayName}
              </h3>
            </div>
            
            {/* Quick Stats on Cover */}
            <div className="flex items-center gap-4 text-white/80 text-sm transition-all duration-500 group-hover:text-white">
              <div className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                <span>{module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>~{Math.ceil(estimatedDuration)} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Enhanced Layout */}
        <div className="p-6 transition-all duration-500 group-hover:bg-accent/5">
          {/* Progress Section - Enhanced */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Progresso</span>
              <span className="text-sm font-bold text-foreground bg-accent px-2 py-1 rounded transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                {completedCount}/{module.lessons.length}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-muted transition-all duration-500 group-hover:h-4"
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {Math.round(progressPercentage)}% concluído
              </span>
              {isCompleted && (
                <span className="text-green-400 font-medium flex items-center gap-1 animate-scale-in">
                  <CheckCircle2 className="h-3 w-3" />
                  Parabéns!
                </span>
              )}
            </div>
          </div>

          {/* Next lesson preview - Enhanced */}
          {!isCompleted && (
            <div className="pt-4 border-t border-border transition-all duration-500 group-hover:border-primary/30">
              <div className="text-xs text-muted-foreground mb-1 font-medium transition-colors duration-300 group-hover:text-foreground">
                {isStarted ? 'Continue com:' : 'Comece com:'}
              </div>
              <div className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed transition-all duration-300 group-hover:text-primary">
                {module.lessons.find(lesson => !completedLessons.has(lesson.id?.toString() || ''))?.Tema || module.lessons[0]?.Tema}
              </div>
              {isStarted && (
                <div className="mt-2 text-xs text-primary font-medium transition-all duration-300 group-hover:scale-105 inline-block">
                  Continue de onde parou →
                </div>
              )}
            </div>
          )}

          {/* Completion celebration */}
          {isCompleted && (
            <div className="pt-4 border-t border-green-500/20 animate-fade-in">
              <div className="text-center">
                <div className="text-green-400 font-semibold text-sm mb-1 animate-scale-in">
                  🎉 Módulo Concluído!
                </div>
                <div className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  Excelente trabalho! Continue sua jornada.
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
