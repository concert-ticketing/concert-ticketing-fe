import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import * as fabric from "fabric";

export default function Admin() {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);

  // OpenCV.js 로드 확인
  useEffect(() => {
    const checkOpenCV = () => {
      if (window.cv && window.cv.Mat) {
        setIsOpenCVReady(true);
      } else {
        setTimeout(checkOpenCV, 100);
      }
    };
    checkOpenCV();
  }, []);

  // 초기 fabric canvas 생성
  useEffect(() => {
    if (fabricCanvasRef.current && !fabricCanvas) {
      const canvas = new fabric.Canvas(fabricCanvasRef.current);
      setFabricCanvas(canvas);
    }
  }, [fabricCanvasRef, fabricCanvas]);

  // PNG 업로드 후 렌더링
  const handleImageLoad = (img: HTMLImageElement) => {
    const canvas = inputCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  // OpenCV를 사용하여 객체 분리
  const handleVectorize = () => {
    const canvas = inputCanvasRef.current;
    if (!canvas || !fabricCanvas || !window.cv) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // OpenCV Mat 객체 생성
    const src = new window.cv.Mat(
      canvas.height,
      canvas.width,
      window.cv.CV_8UC4
    );
    src.data.set(new Uint8Array(imageData.data));

    // 그레이스케일로 변환
    const gray = new window.cv.Mat();
    window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);

    // 이진화
    const binary = new window.cv.Mat();
    window.cv.threshold(gray, binary, 128, 255, window.cv.THRESH_BINARY);

    // 윤곽선 검출
    const contours = new window.cv.MatVector();
    const hierarchy = new window.cv.Mat();
    window.cv.findContours(
      binary,
      contours,
      hierarchy,
      window.cv.RETR_EXTERNAL,
      window.cv.CHAIN_APPROX_SIMPLE
    );

    // Fabric.js에 윤곽선 그리기
    fabricCanvas.clear();
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const points = [];
      for (let j = 0; j < contour.data32S.length; j += 2) {
        points.push({ x: contour.data32S[j], y: contour.data32S[j + 1] });
      }

      const polygon = new fabric.Polygon(points, {
        fill: "transparent",
        stroke: "red",
        strokeWidth: 2,
      });
      fabricCanvas.add(polygon);
    }

    // 메모리 해제
    src.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
  };

  return (
    <div>
      <h1 className="text-xl font-bold">PNG → SVG → Fabric 변환 테스트</h1>
      <ImageUpload onImageLoad={handleImageLoad} />
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">원본 PNG → Canvas</h2>
          <canvas ref={inputCanvasRef} className="border" />
          <button
            onClick={handleVectorize}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!isOpenCVReady}
          >
            {isOpenCVReady ? "벡터화 & Fabric에 그리기" : "OpenCV 로드 중..."}
          </button>
        </div>
        <div>
          <h2 className="font-semibold">벡터화된 SVG → Fabric.js</h2>
          <canvas ref={fabricCanvasRef} className="border" />
        </div>
      </div>
    </div>
  );
}
