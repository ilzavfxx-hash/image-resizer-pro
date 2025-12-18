import { Download, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  originalUrl: string;
  resizedUrl: string;
  originalSize: { width: number; height: number };
  onReset: () => void;
  onDownload: () => void;
}

export const ImagePreview = ({
  originalUrl,
  resizedUrl,
  originalSize,
  onReset,
  onDownload,
}: ImagePreviewProps) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Original
            </h3>
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-secondary">
              {originalSize.width} × {originalSize.height}
            </span>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border">
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Resized Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4" />
              Resized
            </h3>
            <span className="text-xs text-primary-foreground px-3 py-1 rounded-full bg-primary">
              1024 × 1024
            </span>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-primary/30 shadow-[var(--glow-subtle)]">
            <img
              src={resizedUrl}
              alt="Resized"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="secondary"
          onClick={onReset}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Image
        </Button>
        <Button
          onClick={onDownload}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </div>
  );
};
