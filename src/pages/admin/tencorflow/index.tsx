import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import * as fabric from "fabric";
import * as tf from "@tensorflow/tfjs";
import DeepLab from "@tensorflow-models/deeplab"; // 기본 내보내기로 변경

export default function Admin() {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [model, setModel] = useState<DeepLab | null>(null);

  // TensorFlow.js 모델 로드
  useEffect(() => {
    const loadModel = async () => {
      const model = await DeepLab.load();
      setModel(model);
    };
    loadModel();
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

  // TensorFlow.js를 사용하여 객체 분리
  const handleVectorize = async () => {
    const canvas = inputCanvasRef.current;
    if (!canvas || !fabricCanvas || !model) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 이미지 데이터를 Tensor로 변환
    const image = await tf.browser.fromPixels(canvas);
    const resizedImage = tf.image.resizeBilinear(image, [513, 513]);
    const normalizedImage = resizedImage.div(tf.scalar(255));

    // 세그멘테이션 실행
    const segmentation = await model.segment(normalizedImage as tf.Tensor3D);

    // 세그멘테이션 결과를 캔버스에 그리기
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    const maskImageData = new ImageData(
      segmentation.legend,
      canvas.width,
      canvas.height
    );
    maskCtx.putImageData(maskImageData, 0, 0);

    // Fabric.js에 추가
    fabric.Image.fromURL(maskCanvas.toDataURL(), (img) => {
      fabricCanvas.clear();
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    });

    // 메모리 해제
    image.dispose();
    resizedImage.dispose();
    normalizedImage.dispose();
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
            disabled={!model}
          >
            {model ? "벡터화 & Fabric에 그리기" : "모델 로드 중..."}
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
