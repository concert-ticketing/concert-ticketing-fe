import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface OpacityProps {
  opacity: number;
  selectedObject: fabric.Object;
  canvas: fabric.Canvas;
  setOpacity: (value: number) => void;
  disabled: boolean;
}

export function Opacity({
  opacity,
  selectedObject,
  canvas,
  setOpacity,
  disabled,
}: OpacityProps) {
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);

    selectedObject.set({ opacity: newOpacity });
    setOpacity(newOpacity);
    canvas.renderAll();
  };

  return (
    <div className={styles.container}>
      <div className={styles.rangeContainer}>
        <label className={styles.label}>투명도(%)</label>
        <span>{Math.round(opacity * 100)}%</span>
        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={opacity}
          className={styles.range}
          onClick={(e) => e.currentTarget.select()}
          onChange={handleOpacityChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
