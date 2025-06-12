import React, { useState, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';

import { getColorString } from '@/utils/getColorString';

import styles from './settings.module.css';
import {
  Angle,
  CircleDiameter,
  Fill,
  LockToggle,
  ObjectId,
  Opacity,
  Position,
  RectSize,
  StrokeColor,
  StrokeWidth,
  TextColor,
  TextObject,
} from './field';

interface SettingProps {
  canvas: fabric.Canvas;
}

interface TextState {
  text: string;
  fontSize: number;
}

export default function Settings({ canvas }: SettingProps) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [width, setWidth] = useState<string | number>('');
  const [height, setHeight] = useState<string | number>('');
  const [diameter, setDiameter] = useState<string | number>('');
  const [color, setColor] = useState<string>('#ffffff');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [text, setText] = useState<Record<string, TextState>>({});
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [angle, setAngle] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [strokeColor, setStrokeColor] = useState<string>('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 값 초기화
  const clearSettings = useCallback(() => {
    setWidth('');
    setHeight('');
    setColor('#ffffff');
    setTextColor('#000000');
    setDiameter('');
    setPosition({ x: 0, y: 0 });
    setAngle(0);
    setOpacity(1);
    setStrokeWidth(0);
    setStrokeColor('#000000'); // 테두리색도 검은색으로 초기화
    setSelectedObject(null);
  }, []);

  // 객체 잠금 상태 확인
  const checkObjectLockState = useCallback((obj: fabric.Object): boolean => {
    return Boolean(
      obj.lockMovementX &&
        obj.lockMovementY &&
        obj.lockRotation &&
        obj.lockScalingX &&
        obj.lockScalingY,
    );
  }, []);

  // 텍스트 객체 처리
  const handleTextObject = useCallback((obj: fabric.Object) => {
    const textObj = obj as fabric.IText & { id: string };
    setText((prev) => ({
      ...prev,
      [textObj.id]: {
        text: textObj.text || '',
        fontSize: textObj.fontSize || 20,
      },
    }));
    setColor((obj.fill as string) || '#ffffff');
  }, []);

  // 원의 지름 계산 함수
  const calculateCircleDiameter = useCallback(
    (circle: fabric.Circle, group?: fabric.Group) => {
      if (!circle || !circle.radius) return 0;

      const circleScale = circle.scaleX || 1;
      const groupScale = group ? group.scaleX || 1 : 1;
      const effectiveRadius = circle.radius * circleScale * groupScale;

      return Math.round(effectiveRadius * 2);
    },
    [],
  );

  // 그룹 객체 처리
  const handleGroupObject = useCallback(
    (obj: fabric.Object, updateDiameter: boolean = true) => {
      if (obj.type === 'group') {
        const group = obj as fabric.Group;

        // 그룹 내에서 Circle과 Rect 찾기
        const circle = group
          .getObjects()
          .find((o) => o.type === 'circle') as fabric.Circle;
        const rect = group.getObjects().find((o) => o.type === 'rect') as fabric.Rect;

        if (circle && updateDiameter) {
          const calculatedDiameter = calculateCircleDiameter(circle, group);
          setDiameter(calculatedDiameter);
        }

        if (rect) {
          // Rect가 있으면 크기 설정
          setWidth(
            Math.round((rect.width || 0) * (rect.scaleX || 1) * (group.scaleX || 1)),
          );
          setHeight(
            Math.round((rect.height || 0) * (rect.scaleY || 1) * (group.scaleY || 1)),
          );
        }

        // 그룹의 배경색 처리 - 그룹 내 첫 번째 도형의 색상 가져오기
        const firstShape = circle || rect;
        if (firstShape && firstShape.fill) {
          setColor(getColorString(firstShape.fill));
        }
      }
    },
    [calculateCircleDiameter],
  );

  // 메인 객체 선택 핸들러 (크기 업데이트 포함)
  const handleObjectSelection = useCallback(
    (obj: fabric.Object | undefined, updateSizes: boolean = true) => {
      if (!obj) return;

      setSelectedObject(obj);

      // ActiveSelection 처리
      let targetObject = obj;
      if (obj.type === 'activeSelection') {
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
      if (targetObject.type === 'i-text') {
        setTextColor(getColorString(targetObject.fill));
      } else {
        setColor(getColorString(targetObject.fill));
      }

      // 객체 타입별 처리
      switch (targetObject.type) {
        case 'i-text':
          handleTextObject(targetObject);
          break;
        case 'rect':
          if (updateSizes) {
            setWidth(Math.round((targetObject.width || 0) * (targetObject.scaleX || 1)));
            setHeight(
              Math.round((targetObject.height || 0) * (targetObject.scaleY || 1)),
            );
          }
          break;
        case 'circle':
          if (updateSizes) {
            const circle = targetObject as fabric.Circle;
            const calculatedDiameter = calculateCircleDiameter(circle);
            setDiameter(calculatedDiameter);
          }
          break;
        case 'group':
          handleGroupObject(targetObject, updateSizes);
          break;
        default:
          if (updateSizes) {
            setWidth('');
            setHeight('');
            setDiameter('');
          }
          setText({});
          break;
      }
    },
    [checkObjectLockState, handleTextObject, handleGroupObject, calculateCircleDiameter],
  );

  // 위치/각도만 업데이트하는 핸들러 (크기는 업데이트하지 않음)
  const handleObjectPositionChange = useCallback((obj: fabric.Object | undefined) => {
    if (!obj) return;

    // 위치와 각도만 업데이트
    setPosition({ x: obj.left || 0, y: obj.top || 0 });
    setAngle(obj.angle || 0);
  }, []);

  // 선택 해제 처리
  const handleSelectionCleared = useCallback(() => {
    const active = selectedObject;
    if (active?.type === 'i-text' && (active as fabric.IText & { id: string }).id) {
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
      handleObjectSelection(e.target, true); // 크기 업데이트 포함

      if (e.target) {
        const obj = e.target;
        if (obj.type === 'group') {
          const group = obj as fabric.Group;
          const circle = group
            .getObjects()
            .find((o) => o.type === 'circle') as fabric.Circle;
          if (circle) {
            const calculatedDiameter = calculateCircleDiameter(circle, group);
            setDiameter(calculatedDiameter);
          }
        }
      }
    },
    [handleObjectSelection, calculateCircleDiameter],
  );

  // 스케일링 처리
  const handleObjectScaling = useCallback(
    (e: { target?: fabric.Object }) => {
      const obj = e.target;
      if (!obj) return;

      if (obj.type === 'rect' || obj.type === 'group') {
        setWidth(Math.round((obj.width || 0) * (obj.scaleX || 1)));
        setHeight(Math.round((obj.height || 0) * (obj.scaleY || 1)));

        if (obj.type === 'group') {
          const group = obj as fabric.Group;
          const circle = group
            .getObjects()
            .find((o) => o.type === 'circle') as fabric.Circle;
          if (circle) {
            const calculatedDiameter = calculateCircleDiameter(circle, group);
            setDiameter(calculatedDiameter);
          }
        }
      } else if (obj.type === 'circle') {
        const circle = obj as fabric.Circle;
        const calculatedDiameter = calculateCircleDiameter(circle);
        setDiameter(calculatedDiameter);
      }

      canvas.requestRenderAll();
    },
    [canvas, calculateCircleDiameter],
  );

  // 더블클릭 처리 (텍스트 편집)
  const handleDoubleClick = useCallback(
    (e: { target?: fabric.Object; subTargets?: fabric.Object[] }) => {
      const { target } = e;

      if (target instanceof fabric.Group && target.subTargetCheck && e.subTargets) {
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
    [canvas],
  );

  // 캔버스 이벤트 리스너 설정
  useEffect(() => {
    if (!canvas) return;

    const selectionCreatedHandler = (e: { selected: fabric.Object[] }) => {
      handleObjectSelection(e.selected[0], true);
    };
    const selectionUpdatedHandler = (e: { selected: fabric.Object[] }) => {
      handleObjectSelection(e.selected[0], true);
    };
    const objectMovingHandler = (e: { target?: fabric.Object }) => {
      handleObjectPositionChange(e.target); // 위치만 업데이트
    };
    const objectRotatingHandler = (e: { target?: fabric.Object }) => {
      handleObjectPositionChange(e.target); // 위치와 각도만 업데이트
    };

    // 이벤트 리스너 등록
    canvas.on('selection:created', selectionCreatedHandler);
    canvas.on('selection:updated', selectionUpdatedHandler);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:scaling', handleObjectScaling);
    canvas.on('object:moving', objectMovingHandler);
    canvas.on('object:rotating', objectRotatingHandler);
    canvas.on('mouse:dblclick', handleDoubleClick);

    // 클린업 함수
    return () => {
      canvas.off('selection:created', selectionCreatedHandler);
      canvas.off('selection:updated', selectionUpdatedHandler);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:scaling', handleObjectScaling);
      canvas.off('object:moving', objectMovingHandler);
      canvas.off('object:rotating', objectRotatingHandler);
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [
    canvas,
    handleObjectSelection,
    handleObjectPositionChange,
    handleSelectionCleared,
    handleObjectModified,
    handleObjectScaling,
    handleDoubleClick,
  ]);

  // 그룹 내 자식 객체 렌더링
  const renderGroupChildren = useCallback(() => {
    if (selectedObject?.type !== 'group') return null;

    const group = selectedObject as fabric.Group;

    return group.getObjects().map((child) => (
      <div className={styles.group} key={child.id}>
        {child.type === 'rect' && (
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
        {child.type === 'circle' && (
          <CircleDiameter
            selectedObject={selectedObject}
            diameter={diameter}
            setDiameter={setDiameter}
            isLocked={isLocked}
            canvas={canvas}
          />
        )}
        {child.type === 'i-text' && (
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
        {selectedObject && selectedObject.type !== 'i-text' && (
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

        {selectedObject && selectedObject.type === 'i-text' && (
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
