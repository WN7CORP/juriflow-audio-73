import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface LessonListProps {
  day: string;
  onBack: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

interface ModuleInfo {
  area: string;
  moduleName: string;
}

export const LessonList = ({ day, onBack, onLessonClick }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo>({ area: '', moduleName: '' });
  const { completedLessons, getCompletionRate } = useProgress();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log("Fetching lessons for module:", day);
        
        const { data, error } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .eq("Modulo", day)
          .order("Aula", { ascending: true });

        if (error) {
          console.error("Error fetching lessons:", error);
          return;
        }

        console.log('Raw lessons data:', data);

        if (data && data.length > 0) {
          // Sort lessons by lesson number converted to integer
          const sortedData = [...data].sort((a: any, b: any) => {
            const aulaA = parseInt(a.Aula) || 0;
            const aulaB = parseInt(b.Aula) || 0;
            return aulaA - aulaB;
          });

          // Map Supabase data to Lesson interface
          const mappedLessons: Lesson[] = sortedData.map((item: any, index: number) => ({
            id: item.id,
            Dia: String(index + 1), // Keep for backward compatibility
            Aula: item.Aula || '',
            Tema: item.Tema || `Aula ${item.Aula}`,
            conteudo: item.conteudo || '',
            video: item.video || '',
            capa: item.capa || '',
            modulo: item.Modulo || 'Módulo não informado',
            Modulo: item.Modulo || 'Módulo não informado',
            Nome: item.Tema || `Aula ${item.Aula}`,
            Link: item.video || '',
            Descricao: item.conteudo || 'Conteúdo não disponível',
            Area: item.Area || 'Área não informada',
            capaModulos: item["capa-modulos"] || '',
            material: item.material || ''
          }));
          
          console.log("Mapped lessons:", mappedLessons);
          setLessons(mappedLessons);
          
          // Set module info from first lesson
          const firstLesson = mappedLessons[0];
          setModuleInfo({
            area: firstLesson.Area || 'Área não informada',
            moduleName: `${firstLesson.Area || 'Módulo'} ${firstLesson.Modulo}`
          });
        }
      } catch (error) {
        console.error("Erro ao carregar aulas:", error);
      }
    };
    
    fetchLessons();
  }, [day]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-surface-glass/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {moduleInfo.moduleName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {moduleInfo.area} • {lessons.length} aulas disponíveis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-4 sm:gap-6">
          {lessons.map((lesson) => {
            const lessonKey = lesson.id?.toString() || '';
            const isCompleted = completedLessons.has(lessonKey);
            const progressPercent = getCompletionRate(lessonKey);
            const hasProgress = progressPercent > 0;

            return (
              <Card key={lesson.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in bg-card/90 backdrop-blur">
                <div onClick={() => onLessonClick(lesson)}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-14 sm:w-32 sm:h-20 lg:w-40 lg:h-24 rounded-lg overflow-hidden bg-muted/50">
                          <img
                            src={lesson.capa || '/placeholder.svg'}
                            alt={lesson.Tema}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                            loading="lazy"
                          />
                          
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Play className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                          </div>
                        </div>

                        <Badge className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1">
                          {lesson.Aula}
                        </Badge>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2 lg:space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-base lg:text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                            {lesson.Tema}
                          </h3>
                          
                          {isCompleted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex-shrink-0">
                              <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                              Concluída
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span>~15 min</span>
                          </div>
                          {lesson.Area && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3 lg:h-4 lg:w-4" />
                              <span>{lesson.Area}</span>
                            </div>
                          )}
                        </div>

                        {lesson.Descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {lesson.Descricao}
                          </p>
                        )}

                        {hasProgress && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progresso</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress 
                              value={progressPercent} 
                              className="h-2 bg-secondary" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
