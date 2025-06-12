import React from 'react';
import * as fabric from 'fabric';

import { getColorString } from '@/utils/getColorString';

import styles from './field.module.css';

interface TextColorProps {
  canvas: fabric.Canvas;
  selectedObject: fabric.Object | null;
  textColor: string;
  setTextColor: (value: string) => void;
  disabled: boolean;
}

export function TextColor({
  canvas,
  selectedObject,
  textColor,
  setTextColor,
  disabled,
}: TextColorProps) {
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!selectedObject) return;

    const applyTextFill = (obj: fabric.Object) => {
      // 텍스트 객체만 처리
      if (obj.type === 'i-text') {
        obj.set('fill', value);
      }
    };

    if (selectedObject.type === 'activeSelection') {
      const selection = selectedObject as fabric.ActiveSelection;
      selection.getObjects().forEach(applyTextFill);
    } else if (selectedObject.type === 'group') {
      const group = selectedObject as fabric.Group;
      group.getObjects().forEach(applyTextFill);
    } else if (selectedObject.type === 'i-text') {
      // 선택된 객체가 텍스트일 때만 적용
      applyTextFill(selectedObject);
    }

    canvas.requestRenderAll();
    setTextColor(value);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>텍스트 색상</label>
      <div className={styles.colorContainer}>
        <input
          type='color'
          value={getColorString(textColor)}
          className={styles.colorInput}
          onChange={handleTextColorChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
