
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/useProgress";
import { Trophy, Clock, Target, Flame, BookOpen, Play } from "lucide-react";

export const ProgressDashboard = () => {
  const { completedLessons, totalWatchTime, streak, getTotalLessons } = useProgress();
  
  const totalLessons = getTotalLessons();
  const completedCount = completedLessons.size;
  const overallProgress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const hoursStudied = Math.floor(totalWatchTime / 3600);
  const minutesStudied = Math.floor((totalWatchTime % 3600) / 60);

  return (
    <Card className="bg-surface-elevated border-border shadow-elevated p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Progress - Mobile Priority */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Progresso Geral
              </div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">
            {completedCount} de {totalLessons} aulas
          </div>
        </div>

        {/* Time Studied */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-foreground">
              {hoursStudied}h {minutesStudied}m
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Tempo de Estudo
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-foreground">
              {streak}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Dias seguidos
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-foreground">
              {Math.floor(completedCount / 5)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Conquistas
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges - Mobile Responsive */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {hoursStudied >= 1 && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Clock className="h-3 w-3 mr-1" />
              Primeira Hora
            </Badge>
          )}
          {streak >= 3 && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <Flame className="h-3 w-3 mr-1" />
              Streak de 3 dias
            </Badge>
          )}
          {completedCount >= 5 && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Play className="h-3 w-3 mr-1" />
              5 Aulas Completas
            </Badge>
          )}
          {overallProgress >= 25 && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Target className="h-3 w-3 mr-1" />
              25% do Curso
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
