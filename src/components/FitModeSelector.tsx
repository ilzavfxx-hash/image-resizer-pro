import { FitMode } from "@/lib/imageResize";
import { Maximize, Minimize, Move } from "lucide-react";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const modes: { value: FitMode; label: string; icon: typeof Maximize; description: string }[] = [
  { value: "contain", label: "Contain", icon: Minimize, description: "Fit inside" },
  { value: "cover", label: "Cover", icon: Maximize, description: "Fill & crop" },
  { value: "stretch", label: "Stretch", icon: Move, description: "Distort to fit" },
];

export const FitModeSelector = ({ value, onChange }: FitModeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50 backdrop-blur-sm">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${isActive 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
