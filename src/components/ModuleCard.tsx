import { Card, CardContent } from "@/components/ui/card";
import { Module } from "@/types/course";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard = ({ module, onClick }: ModuleCardProps) => {
  const progressPercentage = module.totalLessons > 0 
    ? Math.round((module.completedLessons / module.totalLessons) * 100) 
    : 0;
  
  const isCompleted = module.completedLessons === module.totalLessons;

  return (
    <Card 
      className="cursor-pointer hover:shadow-elevated transition-all duration-200 hover:scale-105 border-border bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Módulo {module.day}
              </h3>
              <p className="text-sm text-muted-foreground">
                {module.totalLessons} aula{module.totalLessons !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Progresso</span>
            <span className="text-xs text-muted-foreground">
              {module.completedLessons}/{module.totalLessons}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Lesson Preview */}
        <div className="space-y-2">
          {module.lessons.slice(0, 3).map((lesson, index) => (
            <div key={lesson.id} className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                module.completedLessons > index ? 'bg-primary' : 'bg-muted'
              }`} />
              <span className="text-muted-foreground truncate">
                {lesson.Tema}
              </span>
            </div>
          ))}
          
          {module.lessons.length > 3 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>+{module.lessons.length - 3} mais aulas</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};