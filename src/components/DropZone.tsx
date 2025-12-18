import { useState, useCallback, DragEvent } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface DropZoneProps {
  onImageDrop: (file: File) => void;
}

export const DropZone = ({ onImageDrop }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onImageDrop(file);
        }
      }
    },
    [onImageDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
          onImageDrop(file);
        }
      }
    },
    [onImageDrop]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        w-full max-w-2xl aspect-square
        rounded-2xl border-2 border-dashed
        bg-card/50 backdrop-blur-sm
        cursor-pointer
        transition-all duration-300 ease-out
        drop-zone-glow
        ${isDragging ? "drop-zone-glow-active border-primary" : "border-border hover:border-muted-foreground"}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className={`flex flex-col items-center gap-6 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
        <div className={`
          p-6 rounded-full 
          bg-secondary/50 
          transition-all duration-300
          ${isDragging ? "bg-primary/20 animate-pulse-glow" : ""}
        `}>
          {isDragging ? (
            <ImageIcon className="w-12 h-12 text-primary" />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragging ? "Drop your image here" : "Drag & drop an image"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse • PNG, JPG, WEBP
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
          <span className="text-xs font-medium text-primary">1024 × 1024</span>
          <span className="text-xs text-muted-foreground">output size</span>
        </div>
      </div>
    </div>
  );
};
