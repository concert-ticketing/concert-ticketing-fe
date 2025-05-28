import React, { useState, useEffect, useCallback } from "react";
import * as fabric from "fabric";

import { LockToggle } from "./LockToggle";
import { ObjectId } from "./ObjectId";
import { Position } from "./Position";
import { Angle } from "./Angle";
import { Opacity } from "./Opacity";
import { StrokeWidth } from "./StrokeWidth";
import { Fill } from "./Fill";
import { StrokeColor } from "./StrokeFill";
import { RectSize } from "./RectSize";
import { CircleDiameter } from "./CircleDiameter";
import { TextObject } from "./TextObject";

import styles from "../canvas.module.css";
import { getColorString } from "@/utils/getColorString";
import { TextColor } from "./TextColor";
// import { normalizeObjectSize } from "@/utils/fabricUtils";

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
  const [color, setColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000"); // 그룹 안에 text color
  const [text, setText] = useState<Record<string, TextState>>({});
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [angle, setAngle] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [strokeColor, setStrokeColor] = useState<string>("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 값 초기화
  const clearSettings = useCallback(() => {
    setWidth("");
    setHeight("");
    setColor("#ffffff");
    setTextColor("#000000");
    setDiameter("");
    setPosition({ x: 0, y: 0 });
    setAngle(0);
    setOpacity(1);
    setStrokeWidth(0);
    setStrokeColor("#ffffff");
    setSelectedObject(null);
  }, []);

  // 객체 잠금 상태 확인
  const checkObjectLockState = useCallback((obj: fabric.Object): boolean => {
    return Boolean(
      obj.lockMovementX &&
        obj.lockMovementY &&
        obj.lockRotation &&
        obj.lockScalingX &&
        obj.lockScalingY
    );
  }, []);

  // 텍스트 객체 처리
  const handleTextObject = useCallback((obj: fabric.Object) => {
    const textObj = obj as fabric.IText & { id: string };
    setText((prev) => ({
      ...prev,
      [textObj.id]: {
        text: textObj.text || "",
        fontSize: textObj.fontSize || 20,
      },
    }));
    setColor((obj.fill as string) || "#ffffff");
  }, []);

  // 사각형/그룹 객체 처리
  const handleRectOrGroupObject = useCallback((obj: fabric.Object) => {
    setWidth(Math.round(obj.width * obj.scaleX));
    setHeight(Math.round(obj.height * obj.scaleY));
    setColor(obj.fill as string);
    setDiameter("");

    if (obj.type === "group") {
      const group = obj as fabric.Group;
      const circle = group
        .getObjects()
        .find((o) => o.type === "circle") as fabric.Circle;

      if (circle) {
        const effectiveRadius =
          (circle.radius || 0) * (circle.scaleX || 1) * (group.scaleX || 1);
        setDiameter(Math.round(effectiveRadius * 2));
      }
    }
  }, []);

  // 원형 객체 처리
  const handleCircleObject = useCallback((obj: fabric.Object) => {
    const circle = obj as fabric.Circle;
    setDiameter(Math.round(circle.radius * 2 * obj.scaleX));
    setColor(obj.fill as string);
    setWidth("");
    setHeight("");
  }, []);

  // 메인 객체 선택 핸들러
  const handleObjectSelection = useCallback(
    (obj: fabric.Object | undefined) => {
      if (!obj) return;

      setSelectedObject(obj);

      // ActiveSelection 처리
      let targetObject = obj;
      if (obj.type === "activeSelection") {
        const first = (obj as fabric.ActiveSelection).getObjects()[0];
        if (!first) return;
        targetObject = first;
      }

      // 공통 속성 설정
      setIsLocked(checkObjectLockState(targetObject));
      setPosition({ x: targetObject.left || 0, y: targetObject.top || 0 });
      setAngle(targetObject.angle || 0);
      setOpacity(targetObject.opacity || 1);
      setStrokeWidth(targetObject.strokeWidth || 0);
      setStrokeColor(getColorString(targetObject.stroke));

      // 텍스트 객체면 textColor에, 나머지는 color에 설정
      if (targetObject.type === "i-text") {
        setTextColor(getColorString(targetObject.fill));
      } else {
        setColor(getColorString(targetObject.fill));
      }

      // 객체 타입별 처리
      switch (targetObject.type) {
        case "i-text":
          handleTextObject(targetObject);
          break;
        case "rect":
        case "group":
          handleRectOrGroupObject(targetObject);
          break;
        case "circle":
        case "group":
          handleCircleObject(targetObject);
          break;
        default:
          setWidth("");
          setHeight("");
          setDiameter("");
          setText({});
          break;
      }
    },
    [
      checkObjectLockState,
      handleTextObject,
      handleRectOrGroupObject,
      handleCircleObject,
    ]
  );

  // 선택 해제 처리
  const handleSelectionCleared = useCallback(() => {
    const active = selectedObject;
    if (
      active?.type === "i-text" &&
      (active as fabric.IText & { id: string }).id
    ) {
      setText((prev) => {
        const newText = { ...prev };
        delete newText[(active as fabric.IText & { id: string }).id];
        return newText;
      });
    }
    clearSettings();
  }, [selectedObject, clearSettings]);

  // 객체 수정 처리
  const handleObjectModified = useCallback(
    (e: { target?: fabric.Object }) => {
      handleObjectSelection(e.target);

      if (e.target) {
        const obj = e.target;
        if (obj.type === "group") {
          const group = obj as fabric.Group;
          const circle = group._objects.find(
            (o) => o.type === "circle"
          ) as fabric.Circle;
          if (circle) {
            setDiameter(Math.round(circle.radius * 2 * (circle.scaleX || 1)));
          }
        } else if (obj.type === "circle") {
          const circle = obj as fabric.Circle;
          setDiameter(Math.round(circle.radius * 2 * obj.scaleX));
        }
      }
    },
    [handleObjectSelection]
  );

  // 스케일링 처리
  const handleObjectScaling = useCallback(
    (e: { target?: fabric.Object }) => {
      const obj = e.target;
      if (!obj) return;

      if (obj.type === "rect" || obj.type === "group") {
        setWidth(Math.round(obj.width * obj.scaleX));
        setHeight(Math.round(obj.height * obj.scaleY));

        if (obj.type === "group") {
          const group = obj as fabric.Group;
          const circle = group
            .getObjects()
            .find((o) => o.type === "circle") as fabric.Circle;
          if (circle) {
            const effectiveRadius =
              (circle.radius || 0) * (circle.scaleX || 1) * (group.scaleX || 1);
            const calculatedDiameter = Math.round(effectiveRadius * 2);
            setDiameter(calculatedDiameter);
          } else {
            setDiameter("");
          }
        }
      } else {
        setDiameter("");
      }

      // normalizeObjectSize(obj);
      canvas.requestRenderAll();
    },
    [canvas]
  );

  // 더블클릭 처리 (텍스트 편집)
  const handleDoubleClick = useCallback(
    (e: { target?: fabric.Object; subTargets?: fabric.Object[] }) => {
      const target = e.target;

      if (
        target instanceof fabric.Group &&
        target.subTargetCheck &&
        e.subTargets
      ) {
        const subTarget = e.subTargets[0];
        if (subTarget instanceof fabric.IText) {
          canvas.setActiveObject(subTarget as fabric.Object);
          subTarget.enterEditing();
          subTarget.selectAll();
        }
      } else if (target instanceof fabric.IText) {
        target.enterEditing();
        target.selectAll();
      }
    },
    [canvas]
  );

  // 캔버스 이벤트 리스너 설정
  useEffect(() => {
    if (!canvas) return;

    const selectionCreatedHandler = (e: { selected: fabric.Object[] }) => {
      handleObjectSelection(e.selected[0]);
    };
    const selectionUpdatedHandler = (e: { selected: fabric.Object[] }) => {
      handleObjectSelection(e.selected[0]);
    };
    const objectMovingHandler = (e: { target?: fabric.Object }) => {
      handleObjectSelection(e.target);
    };
    const objectRotatingHandler = (e: { target?: fabric.Object }) => {
      handleObjectSelection(e.target);
    };

    // 이벤트 리스너 등록
    canvas.on("selection:created", selectionCreatedHandler);
    canvas.on("selection:updated", selectionUpdatedHandler);
    canvas.on("selection:cleared", handleSelectionCleared);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleObjectScaling);
    canvas.on("object:moving", objectMovingHandler);
    canvas.on("object:rotating", objectRotatingHandler);
    canvas.on("mouse:dblclick", handleDoubleClick);

    // 클린업 함수
    return () => {
      canvas.off("selection:created", selectionCreatedHandler);
      canvas.off("selection:updated", selectionUpdatedHandler);
      canvas.off("selection:cleared", handleSelectionCleared);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleObjectScaling);
      canvas.off("object:moving", objectMovingHandler);
      canvas.off("object:rotating", objectRotatingHandler);
      canvas.off("mouse:dblclick", handleDoubleClick);
    };
  }, [
    canvas,
    handleObjectSelection,
    handleSelectionCleared,
    handleObjectModified,
    handleObjectScaling,
    handleDoubleClick,
  ]);

  // 그룹 내 자식 객체 렌더링
  const renderGroupChildren = useCallback(() => {
    if (selectedObject?.type !== "group") return null;

    const group = selectedObject as fabric.Group;

    return group._objects.map((child, index) => (
      <div className={styles.group} key={index}>
        {child.type === "rect" && (
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
          <CircleDiameter
            selectedObject={selectedObject}
            diameter={diameter}
            setDiameter={setDiameter}
            isLocked={isLocked}
            canvas={canvas}
          />
        )}
        {child.type === "i-text" && (
          <TextObject
            selectedObject={selectedObject}
            text={text}
            setText={setText}
            isLocked={isLocked}
            canvas={canvas}
          />
        )}
      </div>
    ));
  }, [selectedObject, width, height, diameter, text, isLocked, canvas]);

  if (!selectedObject) {
    return <div className={styles.settings} />;
  }

  return (
    <div className={styles.settings}>
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

      {/* 각도 */}
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
        {selectedObject && selectedObject.type !== "i-text" && (
          <>
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
          </>
        )}

        {selectedObject && selectedObject.type === "i-text" && (
          <TextColor
            textColor={textColor}
            setTextColor={setTextColor}
            selectedObject={selectedObject}
            disabled={isLocked}
            canvas={canvas}
          />
        )}
      </div>

      {/* 도형별 고유 설정 */}
      {renderGroupChildren()}

      {/* 단일 텍스트 객체 */}
      <TextObject
        selectedObject={selectedObject}
        text={text}
        setText={setText}
        isLocked={isLocked}
        canvas={canvas}
      />
    </div>
  );
}
