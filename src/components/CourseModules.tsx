
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ModuleCard } from "./ModuleCard";
import { Lesson, Module } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface CourseModulesProps {
  lessons: Lesson[];
  onDayClick: (day: string) => void;
}

export const CourseModules = ({ lessons, onDayClick }: CourseModulesProps) => {
  const { completedLessons } = useProgress();

  const modules = useMemo(() => {
    const moduleMap = new Map<string, Lesson[]>();
    
    lessons.forEach(lesson => {
      const day = lesson.Dia;
      if (!moduleMap.has(day)) {
        moduleMap.set(day, []);
      }
      // Ensure proper mapping is maintained
      const mappedLesson: Lesson = {
        ...lesson,
        Nome: lesson.Tema || `Aula ${lesson.Aula}`,
        Link: lesson.video || '',
        Descricao: lesson.conteudo || 'Conteúdo não disponível'
      };
      moduleMap.get(day)!.push(mappedLesson);
    });

    return Array.from(moduleMap.entries()).map(([day, dayLessons]) => {
      const completedCount = dayLessons.filter(lesson => 
        completedLessons.has(lesson.id?.toString() || '')
      ).length;

      return {
        day,
        lessons: dayLessons.sort((a, b) => parseInt(a.Aula) - parseInt(b.Aula)),
        totalLessons: dayLessons.length,
        completedLessons: completedCount,
        coverImage: dayLessons[0]?.capa || '/placeholder.svg',
        duration: dayLessons.length * 15, // Estimate 15 min per lesson
        isNew: parseInt(day) <= 3,
      } as Module;
    }).sort((a, b) => parseInt(a.day) - parseInt(b.day));
  }, [lessons, completedLessons]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Módulos do Curso
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Selecione um módulo para começar a aprender
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.day}
              module={module}
              onClick={() => onDayClick(module.day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
