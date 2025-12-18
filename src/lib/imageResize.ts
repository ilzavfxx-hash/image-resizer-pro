const TARGET_SIZE = 1024;

export type FitMode = "contain" | "cover" | "stretch";

export interface ResizeResult {
  resizedUrl: string;
  blob: Blob;
}

export const resizeImage = (file: File, fitMode: FitMode = "contain"): Promise<ResizeResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;

      // Fill with white background (for transparent images)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

      let x = 0, y = 0, scaledWidth = TARGET_SIZE, scaledHeight = TARGET_SIZE;

      if (fitMode === "stretch") {
        // Stretch: distort to fill exactly
        x = 0;
        y = 0;
        scaledWidth = TARGET_SIZE;
        scaledHeight = TARGET_SIZE;
      } else if (fitMode === "cover") {
        // Cover: scale to fill, crop overflow
        const scale = Math.max(TARGET_SIZE / img.width, TARGET_SIZE / img.height);
        scaledWidth = img.width * scale;
        scaledHeight = img.height * scale;
        x = (TARGET_SIZE - scaledWidth) / 2;
        y = (TARGET_SIZE - scaledHeight) / 2;
      } else {
        // Contain: scale to fit inside, preserve aspect ratio
        const scale = Math.min(TARGET_SIZE / img.width, TARGET_SIZE / img.height);
        scaledWidth = img.width * scale;
        scaledHeight = img.height * scale;
        x = (TARGET_SIZE - scaledWidth) / 2;
        y = (TARGET_SIZE - scaledHeight) / 2;
      }

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              resizedUrl: URL.createObjectURL(blob),
              blob,
            });
          } else {
            reject(new Error("Could not create blob"));
          }
        },
        "image/png",
        1.0
      );
    };

    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
};

export const downloadImage = (blob: Blob, filename: string = "resized-1024x1024.png") => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
