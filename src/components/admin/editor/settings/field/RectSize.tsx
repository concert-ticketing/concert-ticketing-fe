import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface RectSizeProps {
  selectedObject: fabric.Object | null;
  width: string | number;
  height: string | number;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  isLocked: boolean;
  canvas: fabric.Canvas;
}

export function RectSize({
  selectedObject,
  width,
  height,
  setWidth,
  setHeight,
  isLocked,
  canvas,
}: RectSizeProps) {
  // 객체 너비
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setWidth(result);

    if (selectedObject) {
      if (selectedObject.type === 'group') {
        const group = selectedObject as fabric.Group;
        group.getObjects().forEach((obj) => {
          if (obj.type === 'rect') {
            obj.set({ width: result });
          }
        });
        group.set({ width: result });
        group.set({ scaleY: 1, scaleX: 1 });
      } else if (selectedObject.type === 'rect') {
        selectedObject.set({ width: result });
      }
      canvas.requestRenderAll();
    }
  };

  // 객체 높이
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setHeight(result);

    if (selectedObject) {
      if (selectedObject.type === 'group') {
        const group = selectedObject as fabric.Group;
        group.getObjects().forEach((obj) => {
          if (obj.type === 'rect') {
            obj.set({ height: intValue });
          }
        });
        group.set({ height: intValue });
        group.set({ scaleY: 1, scaleX: 1 });
      } else if (selectedObject.type === 'rect') {
        selectedObject.set({ height: intValue });
      }
      canvas.requestRenderAll();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelWithIcon}>📐 크기</div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>너비 (px)</label>
          <input
            type='number'
            value={width}
            onClick={(e) => e.currentTarget.select()}
            onChange={handleWidthChange}
            disabled={isLocked}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>높이 (px)</label>
          <input
            type='number'
            value={height}
            onClick={(e) => e.currentTarget.select()}
            onChange={handleHeightChange}
            disabled={isLocked}
          />
        </div>
      </div>
    </div>
  );
}
