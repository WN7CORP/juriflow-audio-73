
import { useState, useEffect } from "react";
import { Play, Clock, CheckCircle2, Calendar, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lesson } from "@/types/course";
import { useProgressByIP } from "@/hooks/useProgressByIP";

interface LessonListProps {
  lessons: Lesson[];
  searchTerm: string;
  selectedArea: string;
  onLessonSelect: (lesson: Lesson) => void;
}

export const LessonList = ({ lessons, searchTerm, selectedArea, onLessonSelect }: LessonListProps) => {
  const { getCompletionRate, isCompleted, getLessonProgress } = useProgressByIP();
  const [progressData, setProgressData] = useState<Map<string, number>>(new Map());

  // Load progress for all lessons
  useEffect(() => {
    const loadProgress = async () => {
      const newProgressData = new Map<string, number>();
      
      for (const lesson of lessons) {
        if (lesson.id) {
          const progress = await getLessonProgress(lesson.id.toString());
          const rate = progress ? progress.progress_percent : 0;
          newProgressData.set(lesson.id.toString(), rate);
        }
      }
      
      setProgressData(newProgressData);
    };

    if (lessons.length > 0) {
      loadProgress();
    }
  }, [lessons, getLessonProgress]);

  const formatDuration = (duration: number = 900) => {
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.Tema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.conteudo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "Todas" || lesson.Area === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="grid gap-6 md:gap-8">
      {filteredLessons.map((lesson) => {
        const lessonId = lesson.id?.toString() || '';
        const progressPercent = progressData.get(lessonId) || 0;
        const completed = progressPercent >= 90;

        return (
          <Card 
            key={lesson.id} 
            className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-background via-background to-muted/30 hover:from-primary/5 hover:to-primary/10 animate-fade-in overflow-hidden"
            onClick={() => onLessonSelect(lesson)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Large Cover Image */}
                <div className="lg:w-80 lg:h-64 h-48 relative overflow-hidden">
                  {lesson.capa ? (
                    <img 
                      src={lesson.capa} 
                      alt={lesson.Tema}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary/60" />
                    </div>
                  )}
                  
                  {/* Progress Overlay */}
                  {progressPercent > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-sm mb-1">
                        <span>{Math.round(progressPercent)}% assistido</span>
                        {completed && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <Progress 
                        value={progressPercent} 
                        className="h-1.5 bg-white/20" 
                      />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {lesson.Area && lesson.Area !== 'Área não informada' && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1">
                            <BookOpen className="h-3 w-3 mr-1.5" />
                            {lesson.Area}
                          </Badge>
                        )}
                        {completed && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-3 py-1">
                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                            Concluída
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {lesson.Tema}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{lesson.Aula}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{formatDuration()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {lesson.conteudo && (
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed line-clamp-3 mb-4">
                      {lesson.conteudo}
                    </p>
                  )}

                  {/* Progress Bar (for lessons in progress) */}
                  {progressPercent > 0 && progressPercent < 90 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Progresso</span>
                        <span className="text-sm font-bold text-primary">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma aula encontrada</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
};
