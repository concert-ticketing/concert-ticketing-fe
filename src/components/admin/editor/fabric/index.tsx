import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

import styles from "./style.module.css";

import Toolbar from "./Toolbar";
import Settings from "./Settings";

export default function FabricEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<
    HTMLCanvasElement | fabric.Canvas | null
  >(null);
  const selectedToolRef = useRef<"rect" | "circle" | "text" | null>(null);
  const [selectedTool, setSelectedTool] = useState<
    "rect" | "circle" | "text" | null
  >(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasElement = canvasRef.current as HTMLCanvasElement;

    const initCanvas = new fabric.Canvas(canvasElement, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    initCanvas.backgroundColor = "#f1f1f1";
    initCanvas.renderAll();

    setCanvas(initCanvas);

    const handleMouseDown = (opt: { pointer: { x: number; y: number } }) => {
      const tool = selectedToolRef.current;

      if (!tool || !opt) return;

      const { x, y } = opt.pointer;

      switch (tool) {
        case "rect":
          addRectangle(x, y);
          break;
        case "circle":
          addCircle(x, y);
          break;
        case "text":
          addText(x, y);
          break;
      }
    };

    initCanvas.on("mouse:down", handleMouseDown);

    const handleResize = () => {
      initCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      initCanvas.off("mouse:down", handleMouseDown);
      initCanvas.dispose();
      canvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    // selectedTool을 ref에도 항상 최신화
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  const addRectangle = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !(canvas instanceof fabric.Canvas)) return;

    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: 60,
      height: 60,
      fill: "#4CAF50",
      stroke: "#333",
      strokeWidth: 0,
      selectable: true,
    });
    canvas.add(rect);
  };

  const addCircle = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !(canvas instanceof fabric.Canvas)) return;

    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius: 30,
      fill: "#2196F3",
      stroke: "#333",
      strokeWidth: 0,
      selectable: true,
    });
    canvas.add(circle);
  };

  const addText = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !(canvas instanceof fabric.Canvas)) return;

    const text = new fabric.Text("텍스트 입력", {
      left: x,
      top: y,
      fontSize: 20,
      fill: "#000",
      selectable: true,
    });
    canvas.add(text);
  };

  return (
    <div className={styles.canvas}>
      <Toolbar setSelectedTool={setSelectedTool} />
      <canvas ref={canvasRef} />
      {canvas && <Settings canvas={canvas} />}
    </div>
  );
}
