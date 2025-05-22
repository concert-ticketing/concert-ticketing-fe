import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

import styles from "./styles.module.css";

import Toolbar from "./Toolbar";
import Settings from "./Settings";

export default function FabricEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const selectedToolRef = useRef<"rect" | "circle" | "text" | "group" | null>(
    null
  );
  const [selectedTool, setSelectedTool] = useState<
    "rect" | "circle" | "text" | "group" | null
  >(null);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  // 사각형 생성
  const addRectangle = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const rect = new fabric.Rect({
          width: 60,
          height: 60,
          fill: "#ffffff",
          strokeWidth: 1,
          stroke: "#000000",
          strokeUniform: true,
          originX: "center",
          originY: "center",
        }) as fabric.Rect & { id: string };

        const label = new fabric.IText("S1", {
          fontSize: 16,
          fill: "#000000",
          originX: "center",
          originY: "center",
          editable: true,
          selectable: true,
          left: 0,
          top: 0,
        }) as fabric.FabricObject;

        const group = new fabric.Group([rect, label], {
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          selectable: true,
          stroke: "#000000",
          strokeWidth: 1,
          strokeUniform: true,
          subTargetCheck: true,
        }) as fabric.Group & { id: string };

        group.id = `rect-${Date.now()}`;
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        setSelectedTool(null);
      }
    },
    [canvas]
  );

  // 원 생성
  const addCircle = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const circle = new fabric.Circle({
          radius: 30,
          fill: "#ffffff",
          strokeWidth: 1,
          stroke: "#000000",
          strokeUniform: true, // strokeUniform 적용
          originX: "center",
          originY: "center",
        }) as fabric.Circle & { id: string };

        const label = new fabric.IText("S1", {
          fontSize: 16,
          fill: "#000000",
          originX: "center",
          originY: "center",
          editable: true,
          selectable: true,
          left: 0,
          top: 0,
        }) as fabric.FabricObject;

        const group = new fabric.Group([circle, label], {
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          selectable: true,
          subTargetCheck: true,
        }) as fabric.Group & { id: string };

        // 그룹 내부의 객체에 strokeUniform 적용
        group._objects.forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set("strokeUniform", true);
          }
        });

        group.id = `circle-${Date.now()}`;
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        setSelectedTool(null);
      }
    },
    [canvas]
  );

  // 텍스트 생성
  const addText = useCallback(
    (x: number, y: number) => {
      if (canvas) {
        const text = new fabric.IText("텍스트 입력", {
          left: x,
          top: y,
          fontSize: 16,
          fill: "#000000",
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

  // 초기 캔버스 생성 및 리사이즈 핸들링
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

  // 캔버스 도구 선택 및 이벤트 처리
  useEffect(() => {
    if (canvas) {
      const handleMouseDown = (opt: fabric.TEvent) => {
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

      // delete 키 누르면 객체 삭제
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Delete" && canvas) {
          const activeObject = canvas.getActiveObject();

          if (!activeObject) return;

          if (activeObject.type === "activeSelection") {
            // 다중 선택된 객체일 경우 모두 삭제
            (activeObject as fabric.ActiveSelection)
              .getObjects()
              .forEach((obj) => {
                canvas.remove(obj);
              });
          } else {
            // 단일 객체 삭제
            canvas.remove(activeObject);
          }

          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      canvas.on("mouse:down", handleMouseDown);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [canvas, addRectangle, addCircle, addText]);

  return (
    <div className={styles.canvas}>
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas
        id="canvas"
        ref={canvasRef}
        tabIndex={0}
        onClick={() => canvasRef.current?.focus()}
      />
      {canvas && !(canvas instanceof HTMLCanvasElement) && (
        <Settings canvas={canvas} />
      )}
    </div>
  );
}
