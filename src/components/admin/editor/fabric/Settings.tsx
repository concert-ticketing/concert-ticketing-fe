import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import styles from "./styles.module.css";
import Image from "next/image";
import { lockIcon, unlockIcon } from "@public/icons";

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

  // 객체 사각형 너비
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setWidth(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "rect") {
            obj.set({ width: result });
          }
        });
        group.set({ width: result });
      } else if (selectedObject.type === "rect") {
        selectedObject.set({ width: result });
      }
      canvas.requestRenderAll();
    }
  };

  // 객체 사각형 높이
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setHeight(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "rect") {
            obj.set({ height: intValue });
          }
        });
        group.set({ height: intValue });
      } else if (selectedObject.type === "rect") {
        selectedObject.set({ height: intValue });
      }
      canvas.requestRenderAll();
    }
  };

  // 객체 원 지름
  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setDiameter(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "circle") {
            obj.set({ radius: result });
          }
        });
        group.set({
          radius: result,
        });
      } else if (selectedObject.type === "circle") {
        selectedObject.set({ radius: result });
      }
      canvas.requestRenderAll();
    }
  };

  // 객체 색상
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      selection.getObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set("fill", "#000000");
        } else {
          obj.set("fill", value);
        }
      });
    } else if (activeObject.type === "group") {
      const group = activeObject as fabric.Group;
      group._objects.forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set("fill", "#000000");
        } else {
          obj.set("fill", value);
        }
      });
    } else {
      if (activeObject.type === "i-text") {
        activeObject.set("fill", "#000000");
      } else {
        activeObject.set("fill", value);
      }
    }
    canvas.requestRenderAll();
  };

  // 객체 텍스트
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      const id = activeObject.id as string;
      setText((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          text: value,
        },
      }));
      activeObject.set("i-text", value);
      canvas.requestRenderAll();
    }
  };

  // 객체 텍스트 글자 크기
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "i-text" && intValue > 0) {
      const id = activeObject.id as string;
      setText((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          fontSize: intValue,
        },
      }));
      activeObject.set("fontSize", intValue);
      canvas.requestRenderAll();
    }
  };

  // 객체 위치 좌표 (x, y)
  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (selectedObject) {
      selectedObject.set(axis === "x" ? "left" : "top", value);
      canvas.requestRenderAll();
      setPosition((prev) => ({ ...prev, [axis]: value }));
    }
  };

  // 객체 각도
  const handleAngleChange = (value: number) => {
    if (selectedObject) {
      // 회전 중심점을 중앙으로 설정
      selectedObject.set({
        originX: "center",
        originY: "center",
        angle: value,
      });
      canvas.requestRenderAll();
      setAngle(value);
    }
  };

  // 객체 투명도
  const handleOpacityChange = (value: number) => {
    if (selectedObject) {
      selectedObject.set("opacity", value);
      canvas.requestRenderAll();
      setOpacity(value);
    }
  };

  // 객체 테두리 두께
  const handleStrokeWidthChange = (value: number | string) => {
    const parsed = parseInt(value as string);
    const strokeWidth = !isNaN(parsed) && parsed >= 0 ? parsed : 0;

    setStrokeWidth(strokeWidth);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set("strokeWidth", strokeWidth);
          }
        });
        group.set("strokeWidth", strokeWidth);
      } else if (
        selectedObject instanceof fabric.Rect ||
        selectedObject instanceof fabric.Circle
      ) {
        selectedObject.set("strokeWidth", strokeWidth);
      }
      canvas?.requestRenderAll();
    }
  };

  // 객체 테두리 색상
  const handleStrokeColorChange = (value: string) => {
    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set("stroke", value);
          }
        });
      } else {
        selectedObject.set("stroke", value);
      }
      canvas.requestRenderAll();
      setStrokeColor(value);
    }
  };

  // 객체 잠금
  const handleLockToggle = () => {
    if (selectedObject) {
      const lock = !isLocked;

      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "i-text") {
            obj.set("editable", !lock);
          }
          obj.set({
            lockMovementX: lock,
            lockMovementY: lock,
            lockRotation: lock,
            hasControls: !lock,
          });
        });
      } else {
        selectedObject.set({
          lockMovementX: lock,
          lockMovementY: lock,
          lockRotation: lock,
          editable: !lock,
          hasControls: !lock,
        });
      }

      canvas.requestRenderAll();
      setIsLocked(lock);
    }
  };

  return (
    <div className={styles.settings}>
      {selectedObject && (
        <>
          {/* 잠금 토글 */}
          <div className={styles.locked}>
            <button onClick={handleLockToggle}>
              <Image
                src={isLocked ? lockIcon : unlockIcon}
                alt={isLocked ? "lock" : "unlock"}
                priority
              />
            </button>
          </div>

          {/* 공통 정보 */}
          <label>객체 ID</label>
          <input
            type="text"
            value={(selectedObject.id as string) || ""}
            readOnly
          />

          <label>위치 (X, Y)</label>
          <div className={styles.flexGroup}>
            <input
              type="number"
              value={position.x.toFixed()}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                handlePositionChange("x", parseFloat(e.target.value))
              }
              disabled={isLocked}
            />
            <input
              type="number"
              value={position.y.toFixed()}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                handlePositionChange("y", parseFloat(e.target.value))
              }
              disabled={isLocked}
            />
          </div>

          {/* 각도 (타원일 경우만 표시) */}
          {!(
            selectedObject?.type === "circle" &&
            selectedObject.scaleX === selectedObject.scaleY
          ) && (
            <>
              <label>각도 (˚)</label>
              <input
                type="number"
                value={angle.toFixed()}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) => handleAngleChange(parseFloat(e.target.value))}
                disabled={isLocked}
              />
            </>
          )}

          <label>투명도(%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={Math.round(opacity * 100)}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              const normalized = Math.min(Math.max(value, 0), 100) / 100;
              handleOpacityChange(normalized);
            }}
            disabled={isLocked}
          />

          {selectedObject.type !== "i-text" && (
            <>
              <label>테두리 두께 (px)</label>
              <input
                type="number"
                value={strokeWidth}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) => handleStrokeWidthChange(e.target.value)}
                disabled={isLocked}
              />
            </>
          )}

          <div className={styles.flexGroup}>
            <label>배경 색</label>
            <input
              type="color"
              value={typeof color === "string" ? color : "#000000"}
              onChange={handleColorChange}
              disabled={isLocked}
            />
            {strokeWidth > 0 && selectedObject.type !== "i-text" && (
              <>
                <label>테두리 색</label>
                <input
                  type="color"
                  value={
                    typeof strokeColor === "string" ? strokeColor : "#000000"
                  }
                  onChange={(e) => handleStrokeColorChange(e.target.value)}
                  disabled={isLocked}
                />
              </>
            )}
          </div>

          {/* 도형별 고유 설정 */}
          {selectedObject.type === "group" && (
            <>
              {(selectedObject as fabric.Group)._objects.map((child, index) => (
                <div className={styles.group} key={index}>
                  {child.type === "rect" && (
                    <>
                      <label>너비 (px)</label>
                      <input
                        type="number"
                        value={width}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={handleWidthChange}
                        disabled={isLocked}
                      />
                      <label>높이 (px)</label>
                      <input
                        type="number"
                        value={height}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={handleHeightChange}
                        disabled={isLocked}
                      />
                    </>
                  )}
                  {child.type === "circle" && (
                    <>
                      <label>지름</label>
                      <input
                        type="number"
                        value={diameter}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={handleDiameterChange}
                        disabled={isLocked}
                      />
                    </>
                  )}
                </div>
              ))}
            </>
          )}
          {selectedObject.type === "i-text" && (
            <>
              <label>텍스트 내용</label>
              <input
                type="text"
                value={text[selectedObject.id as string]?.text || ""}
                onClick={(e) => e.currentTarget.select()}
                onChange={handleTextChange}
                placeholder="텍스트 입력"
                disabled={isLocked}
              />
              <label>글자 크기</label>
              <input
                type="number"
                value={text[selectedObject.id as string]?.fontSize || ""}
                onClick={(e) => e.currentTarget.select()}
                onChange={handleFontSizeChange}
                placeholder="글자 크기 입력"
                disabled={isLocked}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
