import React, { useState } from "react";

const ImageConverter: React.FC = () => {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const imageData = base64.split(",")[1]; // Base64 데이터 추출

        // API 호출
        const response = await fetch("/api/convert-png-to-svg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        if (response.ok) {
          const svg = await response.text();
          setSvg(svg);
        } else {
          console.error("Failed to convert image");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && <p>Converting...</p>}
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </div>
  );
};

export default ImageConverter;
