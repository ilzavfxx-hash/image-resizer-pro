import { useState, useCallback, useRef } from "react";
import { DropZone } from "@/components/DropZone";
import { ImagePreview } from "@/components/ImagePreview";
import { FitModeSelector } from "@/components/FitModeSelector";
import { resizeImage, downloadImage, ResizeResult, FitMode } from "@/lib/imageResize";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const currentFileRef = useRef<File | null>(null);

  const processImage = useCallback(async (file: File, mode: FitMode) => {
    setIsProcessing(true);
    try {
      const result = await resizeImage(file, mode);
      setResizeResult(result);
      toast.success("Image resized to 1024×1024!");
    } catch (error) {
      toast.error("Failed to resize image");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleImageDrop = useCallback(async (file: File) => {
    currentFileRef.current = file;
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
    setOriginalUrl(img.src);

    processImage(file, fitMode);
  }, [fitMode, processImage]);

  const handleFitModeChange = useCallback((mode: FitMode) => {
    setFitMode(mode);
    if (currentFileRef.current) {
      processImage(currentFileRef.current, mode);
    }
  }, [processImage]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizeResult?.resizedUrl) URL.revokeObjectURL(resizeResult.resizedUrl);
    setOriginalUrl(null);
    setResizeResult(null);
    setOriginalSize({ width: 0, height: 0 });
  }, [originalUrl, resizeResult]);

  const handleDownload = useCallback(() => {
    if (resizeResult?.blob) {
      downloadImage(resizeResult.blob);
      toast.success("Download started!");
    }
  }, [resizeResult]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
          Image <span className="text-primary">Resizer</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Drop an image to resize it to 1024×1024
        </p>
        <FitModeSelector value={fitMode} onChange={handleFitModeChange} />
      </header>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 py-20 animate-fade-in">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Resizing your image...</p>
          </div>
        ) : resizeResult && originalUrl ? (
          <ImagePreview
            originalUrl={originalUrl}
            resizedUrl={resizeResult.resizedUrl}
            originalSize={originalSize}
            onReset={handleReset}
            onDownload={handleDownload}
          />
        ) : (
          <DropZone onImageDrop={handleImageDrop} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
        <p>Images are processed locally in your browser</p>
      </footer>
    </main>
  );
};

export default Index;
