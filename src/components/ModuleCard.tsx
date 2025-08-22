
import { Card, CardContent } from "@/components/ui/card";
import { Module } from "@/types/course";
import { BookOpen, CheckCircle, Clock, Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/useProgress";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard = ({ module, onClick }: ModuleCardProps) => {
  const { completedModules } = useProgress();
  const progressPercentage = module.totalLessons > 0 
    ? Math.round((module.completedLessons / module.totalLessons) * 100) 
    : 0;
  
  const isCompleted = module.completedLessons === module.totalLessons;
  const isModuleCompleted = completedModules.has(module.day);
  const hasStarted = module.completedLessons > 0;
  
  // Use the first lesson's cover image as module cover
  const coverImage = module.lessons[0]?.capa || '';

  return (
    <Card 
      className="group cursor-pointer hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] border-border bg-card overflow-hidden relative"
      onClick={onClick}
    >
      {/* Cover Image Background */}
      <div className="relative h-32 overflow-hidden">
        {coverImage ? (
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url(${coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {module.isNew && (
            <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
              Novo
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              Concluído
            </Badge>
          )}
          {hasStarted && !isCompleted && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
              Em Andamento
            </Badge>
          )}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary/90 rounded-full p-3">
            <Play className="h-6 w-6 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1">
              Módulo {module.day}
            </h3>
            <p className="text-sm text-muted-foreground">
              {module.totalLessons} aula{module.totalLessons !== 1 ? 's' : ''}
              {module.duration && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.round(module.duration / 60)}min
                </span>
              )}
            </p>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Progresso</span>
            <span className="text-xs text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Lesson Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Primeiras Aulas
          </h4>
          {module.lessons.slice(0, 2).map((lesson, index) => (
            <div key={lesson.id} className="flex items-center gap-3 text-xs">
              <div className="relative">
                {lesson.capa ? (
                  <img 
                    src={lesson.capa} 
                    alt={lesson.Tema}
                    className="w-8 h-6 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-6 rounded bg-muted flex items-center justify-center">
                    <Play className="h-2 w-2 text-muted-foreground" />
                  </div>
                )}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                  module.completedLessons > index ? 'bg-primary' : 'bg-muted'
                }`} />
              </div>
              <span className="text-muted-foreground truncate flex-1">
                {lesson.Tema}
              </span>
            </div>
          ))}
          
          {module.lessons.length > 2 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Clock className="w-3 h-3" />
              <span>+{module.lessons.length - 2} mais aulas</span>
            </div>
          )}
        </div>

        {/* Action Hint */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {isCompleted ? 'Revisar módulo' : hasStarted ? 'Continuar estudos' : 'Começar agora'}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
