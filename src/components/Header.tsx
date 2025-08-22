
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";

interface HeaderProps {
  currentView: 'modules' | 'lessons' | 'lesson' | 'dashboard';
  onDashboardClick: () => void;
}

export const Header = ({ currentView, onDashboardClick }: HeaderProps) => {
  if (currentView === 'lesson') {
    return null; // Header is handled by LessonHeader in lesson view
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground">
            Academia Jurídica
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDashboardClick}
            className="gap-2 hover:bg-muted/80 transition-colors duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Progresso</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
