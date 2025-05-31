import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

import styles from "./canvas.module.css";

import Toolbar from "./Toolbar";
import Settings from "./settings";
import BulkObjectCreator from "./bulkObjectCreator";

import { addRectangleFn } from "./shapes/Rect";
import { addCircleFn } from "./shapes/Circle";
import { addTextFn } from "./shapes/Text";
import {
  addPolygonFn,
  cancelPolygonDrawing,
  isPolygonDrawing,
} from "./shapes/Polygon";

/**
 * 캔버스 초기 생성, 도구 선택 및 이벤트 처리를 위한 상위 컴포넌트 입니다.
 */

export default function FabricEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const selectedToolRef = useRef<
    "rect" | "circle" | "text" | "group" | "polygon" | null
  >(null);
  const [selectedTool, setSelectedTool] = useState<
    "rect" | "circle" | "text" | "group" | "polygon" | null
  >(null);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

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
            addRectangleFn(canvas, x, y, setSelectedTool);
            break;
          case "circle":
            addCircleFn(canvas, x, y, setSelectedTool);
            break;
          case "text":
            addTextFn(canvas, x, y, "변수 string", setSelectedTool);
            break;
          case "polygon":
            addPolygonFn(canvas, x, y, setSelectedTool);
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

        // esc 키 누르면 폴리곤 그리기 취소
        if (event.key === "Escape" && canvas) {
          if (isPolygonDrawing()) {
            cancelPolygonDrawing(canvas, setSelectedTool);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      canvas.on("mouse:down", handleMouseDown);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [canvas]);

  return (
    <div className={styles.canvas}>
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas
        id="canvas"
        ref={canvasRef}
        tabIndex={0}
        onClick={() => canvasRef.current?.focus()}
      />
      {/* canvas가 있을 경우 렌더링 */}
      {canvas && !(canvas instanceof HTMLCanvasElement) && (
        <>
          <Settings canvas={canvas} />
          <BulkObjectCreator canvas={canvas} />
        </>
      )}
      {/* 폴리곤 그리기 안내 메시지 */}
      {selectedTool === "polygon" && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: "20px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          폴리곤 그리기: 클릭으로 점 추가, 첫 점 근처 클릭으로 완성, ESC로 취소
        </div>
      )}
    </div>
  );
}
