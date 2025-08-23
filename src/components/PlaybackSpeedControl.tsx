
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge } from "lucide-react";

interface PlaybackSpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export const PlaybackSpeedControl = ({ currentSpeed, onSpeedChange, className = "" }: PlaybackSpeedControlProps) => {
  const speedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "1x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 1.75, label: "1.75x" },
    { value: 2, label: "2x" }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Gauge className="h-4 w-4 text-muted-foreground" />
      <Select 
        value={currentSpeed.toString()} 
        onValueChange={(value) => onSpeedChange(parseFloat(value))}
      >
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {speedOptions.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
