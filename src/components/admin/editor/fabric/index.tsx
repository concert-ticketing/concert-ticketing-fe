import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { PNG2SVG } from "@/utils/pngToSvg";

const SeatDetectorFabric = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initializeCanvas = () => {
    canvasRef.current = new fabric.Canvas("canvas", {
      width: 800,
      height: 600,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    if (file.type === "image/png") {
      const svgElement = await PNG2SVG(file); // PNG를 SVG로 변환
      console.log(svgElement);
      const svgString = new XMLSerializer().serializeToString(svgElement);
      fabric.loadSVGFromString(svgString, (objects, options) => {
        const svg = fabric.util.groupSVGElements(
          objects,
          options
        ) as fabric.Object;
        canvasRef.current?.add(svg);
      });
    } else if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgData = e.target?.result as string;
        fabric.loadSVGFromString(svgData, (objects, options) => {
          const svg = fabric.util.groupSVGElements(
            objects,
            options
          ) as fabric.Object;
          canvasRef.current?.add(svg);
        });
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div>
      <input type="file" accept=".png,.svg" onChange={handleFileUpload} />
      <canvas
        id="canvas"
        style={{ border: "1px solid", borderRadius: "5px", marginTop: "10px" }}
      />
    </div>
  );
};

export default SeatDetectorFabric;
