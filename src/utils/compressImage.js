export function compressImage(
  file,
  maxWidth = 300,
  quality = 0.4
) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize while maintaining aspect ratio
        if (width > maxWidth) {
          const scale = maxWidth / width;

          width = maxWidth;
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        context.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        // Convert to compressed WebP
        const compressedImage =
        canvas.toDataURL(
            "image/webp",
            quality
        );

        resolve(compressedImage);
      };

      img.onerror = () => {
        reject(
          new Error("Failed to load image.")
        );
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(
        new Error("Failed to read image.")
      );
    };

    reader.readAsDataURL(file);
  });
}