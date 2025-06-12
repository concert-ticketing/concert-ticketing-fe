import React from 'react';
import * as fabric from 'fabric';

import { getColorString } from '@/utils/getColorString';

import styles from './field.module.css';

interface StrokeColorProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
  strokeColor: string | fabric.TFiller | null;
  setStrokeColor: (value: string) => void;
  disabled: boolean;
}

export function StrokeColor({
  canvas,
  selectedObject,
  strokeColor,
  setStrokeColor,
  disabled,
}: StrokeColorProps) {
  if (selectedObject?.type === 'i-text') return null;

  const handleStrokeChange = (value: string) => {
    setStrokeColor(value);
    if (selectedObject) {
      if (selectedObject.type === 'group') {
        const group = selectedObject as fabric.Group;
        group.getObjects().forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set('stroke', value);
          }
        });
        group.set('stroke', value);
      } else {
        selectedObject.set('stroke', value);
      }
      canvas?.requestRenderAll();
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>테두리 색</label>
      <div className={styles.colorContainer}>
        <input
          type='color'
          value={getColorString(strokeColor)}
          className={styles.colorInput}
          onChange={(e) => handleStrokeChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
