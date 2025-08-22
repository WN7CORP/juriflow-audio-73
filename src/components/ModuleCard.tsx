
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { Module } from "@/types/course";
import { Play, Clock, CheckCircle2, BookOpen } from "lucide-react";

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
  
  // Get first lesson cover as module cover
  const moduleCover = module.lessons[0]?.capa || '/placeholder.svg';
  
  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Concluído</Badge>;
    }
    if (isStarted) {
      return <Badge className="bg-primary/20 text-primary border-primary/30">Em Andamento</Badge>;
    }
    return <Badge variant="secondary">Novo</Badge>;
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elevated transform hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Cover Image - Mobile Optimized */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={moduleCover}
          alt={`Módulo ${module.day}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground fill-current" />
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>

        {/* Completion Icon */}
        {isCompleted && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content - Mobile Optimized */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
              Dia {module.day}
            </h3>
          </div>
        </div>

        {/* Lessons count and duration */}
        <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            <span>{module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~{Math.ceil(module.lessons.length * 15)} min</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-foreground font-medium">
              {completedCount}/{module.lessons.length}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-muted"
          />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(progressPercentage)}% concluído
          </div>
        </div>

        {/* Next lesson preview - Mobile friendly */}
        {!isCompleted && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Próxima aula:</div>
            <div className="text-sm font-medium text-foreground truncate">
              {module.lessons.find(lesson => !completedLessons.has(lesson.id?.toString() || ''))?.Nome || module.lessons[0]?.Nome}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
