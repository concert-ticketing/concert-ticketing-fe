import * as potrace from "potrace";

export const PNG2SVG = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        const img = new Image();
        img.src = imageData;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);

          const pngData = canvas.toDataURL("image/png");

          potrace.trace(pngData, (err, svg) => {
            if (err) {
              reject(err);
            } else {
              resolve(svg);
            }
          });
        };
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
