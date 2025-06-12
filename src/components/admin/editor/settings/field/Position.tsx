import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface PositionProps {
  position: { x: number; y: number };
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  disabled?: boolean;
}

export function Position({
  position,
  selectedObject,
  canvas,
  setPosition,
  disabled,
}: PositionProps) {
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (selectedObject && canvas) {
      selectedObject.set(axis === 'x' ? 'left' : 'top', value);
      canvas.requestRenderAll();
      setPosition((prev) => ({ ...prev, [axis]: value }));
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>위치</label>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>X</label>
          <input
            type='number'
            value={position.x.toFixed()}
            className={`${styles.input} ${styles.numberInput}`}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Y</label>
          <input
            type='number'
            value={position.y.toFixed()}
            className={`${styles.input} ${styles.numberInput}`}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
