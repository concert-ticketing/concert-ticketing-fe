import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface PriceProps {
  price: string | number;
  setPrice: (price: string | number) => void;
  selectedObject: fabric.Object | null;
  disabled?: boolean;
  canvas: fabric.Canvas | null;
}

export function Price({ price, setPrice, selectedObject, disabled, canvas }: PriceProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setPrice(result);

    if (selectedObject && canvas) {
      selectedObject.set({ price: result });
      canvas.requestRenderAll();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>좌석 가격</label>
      <div className={styles.priceInputWrapper}>
        <input
          type='text'
          value={price}
          placeholder='가격을 입력하세요'
          className={`${styles.input} ${styles.priceInput}`}
          onClick={(e) => e.currentTarget.select()}
          onChange={handlePriceChange}
          disabled={disabled}
        />
        <span className={styles.priceUnit}>원</span>
      </div>
    </div>
  );
}
