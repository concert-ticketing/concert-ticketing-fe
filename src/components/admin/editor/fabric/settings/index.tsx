import React, { useState, useEffect } from "react";
import * as fabric from "fabric";

import { LockToggle } from "./LockToggle";
import { ObjectId } from "./ObjectId";
import { Position } from "./Position";
import { Angle } from "./Angle";
import { Opacity } from "./Opacity";
import { StrokeWidth } from "./StrokeWidth";
import { Fill } from "./Fill";
import { StrokeColor } from "./StrokeFill";

import styles from "../canvas.module.css";
import { RectSize } from "./RectSize";
import { CircleDiameter } from "./CircleDiameter";
import { TextObject } from "./TextObject";

interface SettingProps {
  canvas: fabric.Canvas;
}

interface TextState {
  text: string;
  fontSize: number;
}

export default function Settings({ canvas }: SettingProps) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const [diameter, setDiameter] = useState<string | number>("");
  const [color, setColor] = useState<string | fabric.TFiller | null>(null);
  const [text, setText] = useState<Record<string, TextState>>({});
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [angle, setAngle] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<
    string | fabric.TFiller | null
  >(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) =>
        handleObjectSelection(e.selected[0])
      );
      canvas.on("selection:updated", (e) =>
        handleObjectSelection(e.selected[0])
      );
      canvas.on("selection:cleared", () => {
        const active = selectedObject;
        if (active?.type === "text" && active.id) {
          setText((prev) => {
            const newText = { ...prev };
            delete newText[active.id as string];
            return newText;
          });
        }
        clearSettings();
      });
      canvas.on("object:modified", (e) => {
        handleObjectSelection(e.target);
        // 마우스로 편집된 도형의 크기 정보 업데이트
        if (e.target) {
          const obj = e.target;
          if (obj.type === "rect" || obj.type === "group") {
            setWidth(Math.round(obj.width * obj.scaleX));
            setHeight(Math.round(obj.height * obj.scaleY));
          } else if (obj.type === "circle") {
            const circle = obj as fabric.Circle;
            setDiameter(Math.round(circle.radius * 2 * obj.scaleX));
          }
        }
      });
      canvas.on("object:scaling", (e) => handleObjectSelection(e.target));

      // 이동 중에는 크기 정보를 업데이트하지 않음
      canvas.on("object:moving", (e) => {
        handleObjectSelection(e.target, false);
      });
      canvas.on("object:rotating", (e) => handleObjectSelection(e.target));
    }
  }, [canvas, selectedObject]);

  const handleObjectSelection = (
    obj: fabric.Object | undefined,
    updateSize = true
  ) => {
    if (!obj) return;
    setSelectedObject(obj);

    if (obj.type === "activeSelection") {
      const first = (obj as fabric.ActiveSelection).getObjects()[0];
      if (!first) return;
      obj = first;
    }

    const isObjectLocked =
      obj.lockMovementX &&
      obj.lockMovementY &&
      obj.lockRotation &&
      obj.lockScalingX &&
      obj.lockScalingY;

    setIsLocked(isObjectLocked);

    setPosition({ x: obj.left || 0, y: obj.top || 0 });
    setAngle(obj.angle || 0);
    setOpacity(obj.opacity || 1);
    setStrokeWidth(obj.strokeWidth || 0);
    setStrokeColor((obj.stroke as string) || "#000000");

    if (obj.type === "i-text") {
      const textObj = obj as fabric.IText & { id: string };
      setText((prev) => ({
        ...prev,
        [textObj.id]: {
          text: textObj.text || "",
          fontSize: textObj.fontSize || 20,
        },
      }));
      setColor(obj.fill);
    }

    if (updateSize) {
      if (obj.type === "rect" || obj.type === "group") {
        setWidth(Math.round(obj.width * obj.scaleX));
        setHeight(Math.round(obj.height * obj.scaleY));
        setColor(obj.fill);
        setDiameter("");
      } else if (obj.type === "circle") {
        const circle = obj as fabric.Circle;
        setDiameter(Math.round(circle.radius * 2 * obj.scaleX));
        setColor(obj.fill);
        setWidth("");
        setHeight("");
      }
    }
  };

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setColor("");
    setDiameter("");
    setPosition({ x: 0, y: 0 });
    setAngle(0);
    setOpacity(1);
    setStrokeWidth(0);
    setStrokeColor("#000000");
    setIsLocked(false);
    setSelectedObject(null);
  };

  return (
    <div className={styles.settings}>
      {selectedObject && (
        <>
          {/* 잠금 토글 */}
          <LockToggle
            selectedObject={selectedObject}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            canvas={canvas}
          />

          {/* 공통 정보 */}
          <ObjectId objectId={selectedObject.id as string} />

          {/* 위치 좌표 */}
          <Position
            position={position}
            setPosition={setPosition}
            selectedObject={selectedObject}
            disabled={isLocked}
            canvas={canvas}
          />

          {/* 각도 (타원일 경우만 표시) */}
          <Angle
            angle={angle}
            selectedObject={selectedObject}
            setAngle={setAngle}
            disabled={isLocked}
            canvas={canvas}
          />

          {/* 객체 투명도 */}
          <Opacity
            opacity={opacity}
            selectedObject={selectedObject}
            setOpacity={setOpacity}
            disabled={isLocked}
            canvas={canvas}
          />

          {/* 테두리 두께 */}
          <StrokeWidth
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            selectedObject={selectedObject}
            disabled={isLocked}
            canvas={canvas}
          />

          <div className={styles.flexGroup}>
            {/* 배경 색상 */}
            <Fill
              color={color}
              setColor={setColor}
              selectedObject={selectedObject}
              disabled={isLocked}
              canvas={canvas}
            />
            {/* 테두리 색상 */}
            <StrokeColor
              strokeColor={strokeColor}
              setStrokeColor={setStrokeColor}
              selectedObject={selectedObject}
              disabled={isLocked}
              canvas={canvas}
            />
          </div>

          {/* 도형별 고유 설정 */}
          {selectedObject?.type === "group" && (
            <>
              {(selectedObject as fabric.Group)._objects.map((child, index) => (
                <div className={styles.group} key={index}>
                  {child.type === "rect" && (
                    // 사각형
                    <RectSize
                      selectedObject={selectedObject}
                      width={width}
                      height={height}
                      setWidth={setWidth}
                      setHeight={setHeight}
                      isLocked={isLocked}
                      canvas={canvas}
                    />
                  )}
                  {child.type === "circle" && (
                    // 원형
                    <CircleDiameter
                      selectedObject={selectedObject}
                      diameter={diameter}
                      setDiameter={setDiameter}
                      isLocked={isLocked}
                      canvas={canvas}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* 텍스트 객체 */}
          <TextObject
            selectedObject={selectedObject}
            text={text}
            setText={setText}
            isLocked={isLocked}
            canvas={canvas}
          />
        </>
      )}
    </div>
  );
}
