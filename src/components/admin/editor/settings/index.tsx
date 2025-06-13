import React, { useEffect, useCallback } from 'react';
import * as fabric from 'fabric';

import { getColorString } from '@/utils/getColorString';
import {
  useObjectStore,
  handleObjectSelection,
  handleObjectPositionChange,
  handleSelectionCleared,
  handleObjectModified,
  handleObjectScaling,
  handleDoubleClick,
} from '@/core/objectStore';

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

export default function Settings({ canvas }: SettingProps) {
  const {
    selectedObject,
    width,
    height,
    diameter,
    color,
    textColor,
    text,
    position,
    angle,
    opacity,
    strokeColor,
    strokeWidth,
    isLocked,
    setWidth,
    setHeight,
    setDiameter,
    setText,
    setColor,
    setTextColor,
    setStrokeColor,
    setIsLocked,
    setPosition,
    setAngle,
    setOpacity,
    setStrokeWidth,
  } = useObjectStore();

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
      handleObjectPositionChange(e.target);
    };
    const objectRotatingHandler = (e: { target?: fabric.Object }) => {
      handleObjectPositionChange(e.target);
    };
    const objectModifiedHandler = (e: { target?: fabric.Object }) => {
      handleObjectModified(e);
    };
    const objectScalingHandler = (e: { target?: fabric.Object }) => {
      handleObjectScaling(e, canvas);
    };
    const doubleClickHandler = (e: {
      target?: fabric.Object;
      subTargets?: fabric.Object[];
    }) => {
      handleDoubleClick(e, canvas);
    };

    // 이벤트 리스너 등록
    canvas.on('selection:created', selectionCreatedHandler);
    canvas.on('selection:updated', selectionUpdatedHandler);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', objectModifiedHandler);
    canvas.on('object:scaling', objectScalingHandler);
    canvas.on('object:moving', objectMovingHandler);
    canvas.on('object:rotating', objectRotatingHandler);
    canvas.on('mouse:dblclick', doubleClickHandler);

    // 클린업 함수
    return () => {
      canvas.off('selection:created', selectionCreatedHandler);
      canvas.off('selection:updated', selectionUpdatedHandler);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', objectModifiedHandler);
      canvas.off('object:scaling', objectScalingHandler);
      canvas.off('object:moving', objectMovingHandler);
      canvas.off('object:rotating', objectRotatingHandler);
      canvas.off('mouse:dblclick', doubleClickHandler);
    };
  }, [canvas]);

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
  }, [
    selectedObject,
    width,
    height,
    diameter,
    text,
    isLocked,
    canvas,
    setWidth,
    setHeight,
    setDiameter,
    setText,
  ]);

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
              color={getColorString(color)}
              setColor={setColor}
              selectedObject={selectedObject}
              disabled={isLocked}
              canvas={canvas}
            />
            {/* 테두리 색상 */}
            <StrokeColor
              strokeColor={getColorString(strokeColor)}
              setStrokeColor={setStrokeColor}
              selectedObject={selectedObject}
              disabled={isLocked}
              canvas={canvas}
            />
          </>
        )}

        {selectedObject && selectedObject.type === 'i-text' && (
          <TextColor
            textColor={getColorString(textColor)}
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
