
import { useState, useEffect } from "react";
import { ModuleCard } from "./ModuleCard";
import { ProgressDashboard } from "./ProgressDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";
import { BookOpen, Play, Clock } from "lucide-react";

interface CourseModulesProps {
  onModuleClick: (day: string) => void;
}

export const CourseModules = ({ onModuleClick }: CourseModulesProps) => {
  const [modules, setModules] = useState<{ [key: string]: Lesson[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .order("Dia", { ascending: true })
          .order("Aula", { ascending: true });

        if (data) {
          const groupedByDay = data.reduce((acc, lesson) => {
            const day = lesson.Dia;
            if (!acc[day]) acc[day] = [];
            acc[day].push(lesson);
            return acc;
          }, {} as { [key: string]: Lesson[] });

          setModules(groupedByDay);
        }
      } catch (error) {
        console.error("Erro ao carregar módulos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const moduleEntries = Object.entries(modules);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-primary text-primary-foreground px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Seu Curso Jurídico Premium
          </h1>
          <p className="text-base sm:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Aprenda direito de forma estruturada e prática. Cada módulo foi pensado para sua evolução profissional.
          </p>
          
          {/* Quick stats - Mobile friendly */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{moduleEntries.length}</div>
              <div className="text-xs sm:text-sm opacity-80">Módulos</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">
                {Object.values(modules).flat().length}
              </div>
              <div className="text-xs sm:text-sm opacity-80">Aulas</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">30h+</div>
              <div className="text-xs sm:text-sm opacity-80">Conteúdo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard - Mobile Responsive */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <ProgressDashboard />
      </div>

      {/* Modules Grid - Fully Responsive */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Play className="h-6 w-6 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Módulos do Curso
            </h2>
          </div>

          {/* Mobile-first grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {moduleEntries.map(([day, lessons]) => (
              <ModuleCard
                key={day}
                day={day}
                lessons={lessons}
                onClick={() => onModuleClick(day)}
              />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-12 text-center">
            <div className="bg-card rounded-2xl border p-6 sm:p-8 max-w-2xl mx-auto">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Comece sua jornada hoje
              </h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Cada aula foi estruturada para maximizar seu aprendizado. 
                Clique em um módulo para começar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
