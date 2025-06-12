import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface AngleProps {
  angle: number;
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  setAngle: (angle: number) => void;
  disabled: boolean;
}

export function Angle({ angle, selectedObject, canvas, setAngle, disabled }: AngleProps) {
  // selectedObject가 circle이면서 정비율(scaleX === scaleY)이면 각도 입력 숨김
  if (
    selectedObject?.type === 'circle' ||
    (selectedObject?.type === 'group' && selectedObject.scaleX === selectedObject.scaleY)
  ) {
    return null;
  }

  const handleAngleChange = (value: number) => {
    if (selectedObject && canvas) {
      selectedObject.set({
        originX: 'center',
        originY: 'center',
        angle: value,
      });
      canvas.requestRenderAll();
      setAngle(value);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>각도 (˚)</label>
      <input
        type='number'
        value={angle.toFixed()}
        className={`${styles.input} ${styles.numberInput}`}
        onClick={(e) => e.currentTarget.select()}
        onChange={(e) => handleAngleChange(parseFloat(e.target.value))}
        disabled={disabled}
      />
    </div>
  );
}
