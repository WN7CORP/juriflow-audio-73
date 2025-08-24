
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lesson } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from '@/components/Shell';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Video } from 'lucide-react';

const IndexPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log('Fetching lessons from VIDEO-AULAS-DIAS...');
        const { data, error } = await supabase
          .from('VIDEO-AULAS-DIAS' as any)
          .select('*')
          .order('Dia', { ascending: true });

        if (error) {
          console.error('Error fetching lessons:', error);
          return;
        }

        console.log('Raw lessons data:', data);

        if (data) {
          const mappedLessons: Lesson[] = data.map((item: any) => ({
            id: item.id,
            Tema: item.Tema || '',
            Aula: item.Aula || '',
            Dia: item.Dia || '',
            video: item.video || '',
            capa: item.capa || '',
            conteudo: item.conteudo || '',
            Area: item.Area || ''
          }));
          
          console.log('Mapped lessons:', mappedLessons);
          setLessons(mappedLessons);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/aula/${lesson.id}`);
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const area = lesson.Area || 'Geral';
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando aulas...</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Academia Jurídica</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sua jornada de aprendizado em Direito começa aqui. 
            Videoaulas completas com questões integradas.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>{lessons.length} Aulas</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{Object.keys(groupedLessons).length} Áreas</span>
            </div>
          </div>
        </div>

        {/* Lessons by Area */}
        {Object.entries(groupedLessons).map(([area, areaLessons]) => (
          <div key={area} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-foreground">{area}</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {areaLessons.length} aulas
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areaLessons.map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className="cursor-pointer group hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                  onClick={() => handleLessonClick(lesson)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                          {lesson.Tema}
                        </CardTitle>
                        <CardDescription>
                          Aula {lesson.Aula} • Dia {lesson.Dia}
                        </CardDescription>
                      </div>
                      <Play className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  
                  {lesson.conteudo && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.conteudo}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}

        {lessons.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma aula encontrada</h3>
            <p className="text-muted-foreground">
              As aulas serão carregadas em breve.
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default IndexPage;
