
import { BookOpen, Trophy, User, Bell } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const { completedLessons, totalWatchTime, streak } = useProgress();
  
  const hoursWatched = Math.floor(totalWatchTime / 3600);
  const totalLessons = 50; // This should come from actual data
  const overallProgress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-glass/95 backdrop-blur supports-[backdrop-filter]:bg-surface-glass/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Seu Curso Premium
              </h1>
              <p className="text-xs text-muted-foreground">
                {completedLessons.size} aulas concluídas
              </p>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="hidden md:flex items-center gap-3 ml-6">
            <div className="w-32">
              <Progress value={overallProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User Stats */}
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">{hoursWatched}h</span>
              <span className="text-muted-foreground">estudadas</span>
            </div>
            
            {streak > 0 && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 gap-1">
                🔥 {streak} dias
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-foreground font-medium">Progresso Geral</span>
          <span className="text-xs text-muted-foreground">{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-1" />
      </div>
    </header>
  );
};
