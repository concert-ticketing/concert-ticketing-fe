import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface StrokeWidthProps {
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  disabled: boolean;
}

export function StrokeWidth({
  strokeWidth,
  setStrokeWidth,
  selectedObject,
  canvas,
  disabled,
}: StrokeWidthProps) {
  if (selectedObject?.type === 'i-text') return null;

  const handleStrokeWidthChange = (value: number | string) => {
    const parsed = Number(value as string);
    const newStrokeWidth = !isNaN(parsed) && parsed >= 0 ? parsed : 0;

    setStrokeWidth(newStrokeWidth);

    if (selectedObject) {
      if (selectedObject.type === 'group') {
        const group = selectedObject as fabric.Group;
        group.getObjects().forEach((obj) => {
          // 그룹 내 모든 객체에 strokeWidth 적용 (텍스트 제외)
          if (obj.type !== 'i-text') {
            obj.set('strokeWidth', newStrokeWidth);
          }
        });
        group.set('strokeWidth', newStrokeWidth);
      } else if (selectedObject.type !== 'i-text') {
        // 모든 fabric 객체에 strokeWidth 적용 (텍스트 제외)
        selectedObject.set('strokeWidth', newStrokeWidth);
      }

      canvas?.requestRenderAll();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>테두리 두께 (px)</label>
      <input
        type='number'
        value={strokeWidth}
        className={`${styles.input} ${styles.numberInput}`}
        onClick={(e) => e.currentTarget.select()}
        onChange={(e) => handleStrokeWidthChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
