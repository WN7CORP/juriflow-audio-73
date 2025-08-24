import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Lesson } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from '@/components/Shell';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('CURSO')
          .select('*');

        if (error) {
          console.error('Error fetching courses:', error);
          return;
        }

        if (data) {
          setCourses(data as Course[]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('AULAS')
          .select('*');

        if (error) {
          console.error('Error fetching lessons:', error);
          return;
        }

        if (data) {
          const mappedLessons = mapLessonData(data);
          setLessons(mappedLessons);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  const mapLessonData = (data: any[]): Lesson[] => {
    return data.map(item => ({
      id: item.id,
      Nome: item.Tema || '',
      Tema: item.Tema || '',
      Aula: item.Aula || '',
      Dia: item.Dia || '',
      video: item.video || '',
      capa: item.capa || '',
      conteudo: item.conteudo || '',
      Descricao: item.conteudo || ''
    }));
  };

  const handleLessonClick = (lesson: Lesson) => {
    router.push(`/lessons/${lesson.id}`);
  };

  return (
    <Shell>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} onClick={() => handleLessonClick(lesson)} className="cursor-pointer">
            <CardHeader>
              <CardTitle>{lesson.Tema}</CardTitle>
              <CardDescription>Aula {lesson.Aula} - Dia {lesson.Dia}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{lesson.Descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Shell>
  );
};

export default IndexPage;
