import React from 'react';
import * as fabric from 'fabric';

import styles from './field.module.css';

interface CircleDiameterProps {
  selectedObject: fabric.Object | null;
  diameter: string | number;
  setDiameter: (value: number) => void;
  isLocked: boolean;
  canvas: fabric.Canvas;
}

export function CircleDiameter({
  selectedObject,
  diameter,
  setDiameter,
  isLocked,
  canvas,
}: CircleDiameterProps) {
  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const parsed = parseInt(value, 10);
    const newDiameter = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
    setDiameter(newDiameter); // 로컬 상태 업데이트

    if (selectedObject) {
      if (selectedObject.type === 'circle') {
        // 단일 원형 객체 처리
        const circle = selectedObject as fabric.Circle;
        circle.set({
          radius: newDiameter / 2, // 직접 반경 설정
          scaleX: 1, // 스케일을 1로 재설정하여 radius가 실제 크기 나타내도록 함
          scaleY: 1,
        });
        circle.setCoords(); // 객체 경계 상자 업데이트
      } else if (selectedObject.type === 'group') {
        // 그룹 내 원형 객체 처리
        const group = selectedObject as fabric.Group;
        const circleInGroup = group
          .getObjects()
          .find((obj) => obj.type === 'circle') as fabric.Circle;

        if (circleInGroup) {
          // 현재 원형의 유효 반경 계산 (그룹 및 원형 자체 스케일 모두 고려)
          const currentEffectiveRadius =
            (circleInGroup.radius || 0) *
            (circleInGroup.scaleX || 1) *
            (group.scaleX || 1);

          // 새 유효 반경
          const newEffectiveRadius = newDiameter / 2;

          // 그룹의 스케일 비율 계산
          const scaleRatio = newEffectiveRadius / currentEffectiveRadius;

          // 그룹 전체의 스케일 조정
          group.set({
            scaleX: (group.scaleX || 1) * scaleRatio,
            scaleY: (group.scaleY || 1) * scaleRatio,
          });

          // 그룹의 경계 상자 업데이트
          group.setCoords();
        }
      }
      canvas.requestRenderAll(); // 캔버스 다시 렌더링
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelWithIcon}>⭕ 원 크기</div>
      <div className={styles.field}>
        <label className={styles.label}>지름</label>
        <input
          type='number'
          value={diameter}
          onClick={(e) => e.currentTarget.select()}
          onChange={handleDiameterChange}
          disabled={isLocked}
        />
        <div className={styles.info}>반지름: {Number(diameter) / 2}px</div>
      </div>
    </div>
  );
}
