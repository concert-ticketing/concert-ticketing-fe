import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

import styles from "./styles.module.css";

import Toolbar from "./Toolbar";
import Settings from "./Settings";

export default function FabricEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const selectedToolRef = useRef<"rect" | "circle" | "text" | null>(null);
  const [selectedTool, setSelectedTool] = useState<
    "rect" | "circle" | "text" | null
  >(null);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  const addRectangle = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: 60,
          height: 60,
          fill: "#4CAF50",
          stroke: "#333",
          strokeWidth: 0,
          selectable: true,
        }) as fabric.Rect & { id: string };
        rect.id = `rect-${Date.now()}`;
        canvas.add(rect);
        canvas.renderAll();
        setSelectedTool(null);
      }
    },
    [canvas]
  );

  const addCircle = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: 30,
          fill: "#2196F3",
          stroke: "#333",
          strokeWidth: 0,
          selectable: true,
        }) as fabric.Circle & { id: string };
        circle.id = `circle-${Date.now()}`;
        canvas.add(circle);
        canvas.renderAll();
        setSelectedTool(null);
      }
    },
    [canvas]
  );

  const addText = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const text = new fabric.Text("텍스트 입력", {
          left: x,
          top: y,
          fontSize: 16,
          fill: "#000",
          selectable: true,
          editable: true,
          lockScalingX: true,
          lockScalingY: true,
        }) as fabric.Text & { id: string };
        text.id = `text-${Date.now()}`;
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        setSelectedTool(null);
      }
    },
    [canvas]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        selection: true,
      });
      initCanvas.backgroundColor = "#dfdfdf";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      const handleResize = () => {
        initCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        initCanvas.dispose();
        canvasRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      const handleMouseDown = (opt: any) => {
        const pointer = canvas.getPointer(opt.e);
        if (!pointer) return;

        const { x, y } = pointer;

        switch (selectedToolRef.current) {
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

      canvas.on("mouse:down", handleMouseDown);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
      };
    }
  }, [canvas, addRectangle, addCircle, addText]);

  return (
    <div className={styles.canvas}>
      <Toolbar setSelectedTool={setSelectedTool} />
      <canvas id="canvas" ref={canvasRef} />
      {canvas && !(canvas instanceof HTMLCanvasElement) && (
        <Settings canvas={canvas} />
      )}
    </div>
  );
}
