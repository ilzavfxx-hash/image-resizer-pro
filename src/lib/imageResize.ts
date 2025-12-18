const TARGET_SIZE = 1024;

export interface ResizeResult {
  resizedUrl: string;
  blob: Blob;
}

export const resizeImage = (file: File): Promise<ResizeResult> => {
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

      // Stretch: draw image to fill exactly 1024x1024
      ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);

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
