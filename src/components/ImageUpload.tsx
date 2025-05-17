import React, { useRef } from "react";

interface Props {
  onImageLoad: (img: HTMLImageElement) => void;
}

const ImageUpload: React.FC<Props> = ({ onImageLoad }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => onImageLoad(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;
