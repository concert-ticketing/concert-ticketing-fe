import React, { useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';

import { Icons } from '../../common/ui/Icons';
import styles from './settings.module.css';

interface SettingsProps {
  canvas: fabric.Canvas;
}

interface SeatObject extends fabric.Rect {
  id?: string;
  price?: number;
}

export default function Settings({ canvas }: SettingsProps) {
  const [selectedObject, setSelectedObject] = useState<SeatObject | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [price, setPrice] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  // 선택된 객체 정보 업데이트
  const updateSelectedObjectInfo = useCallback((obj: fabric.Object | null) => {
    if (!obj) {
      setSelectedObject(null);
      return;
    }

    const seatObj = obj as SeatObject;
    setSelectedObject(seatObj);
    setPosition({
      x: Math.round(seatObj.left || 0),
      y: Math.round(seatObj.top || 0),
    });
    setPrice(seatObj.price || 0);
    setIsLocked(!seatObj.selectable);
  }, []);

  // 캔버스 이벤트 리스너 설정
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e: { selected?: fabric.Object[] }) => {
      const selected = e.selected?.[0] || null;
      updateSelectedObjectInfo(selected);
    };

    const handleSelectionCleared = () => {
      updateSelectedObjectInfo(null);
    };

    const handleObjectModified = (e: { target?: fabric.Object }) => {
      if (e.target === selectedObject) {
        updateSelectedObjectInfo(e.target);
      }
    };

    // 이벤트 리스너 등록
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:moving', handleObjectModified);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:moving', handleObjectModified);
    };
  }, [canvas, selectedObject, updateSelectedObjectInfo]);

  // 가격 변경
  const handlePriceChange = useCallback(
    (newPrice: number) => {
      if (!selectedObject || isLocked) return;

      const seatObj = selectedObject as SeatObject;
      seatObj.price = newPrice;
      setPrice(newPrice);
    },
    [selectedObject, isLocked],
  );

  // 위치 변경
  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      if (!selectedObject || isLocked) return;

      const newPosition = { ...position, [axis]: value };
      setPosition(newPosition);

      selectedObject.set({
        left: newPosition.x,
        top: newPosition.y,
      });
      canvas.renderAll();
    },
    [selectedObject, position, isLocked, canvas],
  );

  // 잠금 토글
  const handleLockToggle = useCallback(() => {
    if (!selectedObject) return;

    const newLocked = !isLocked;
    setIsLocked(newLocked);

    selectedObject.set({
      selectable: !newLocked,
      evented: !newLocked,
    });

    canvas.renderAll();
  }, [selectedObject, isLocked, canvas]);

  // 객체 삭제
  const handleDelete = useCallback(() => {
    if (!selectedObject || isLocked) return;

    const confirmDelete = window.confirm('선택된 좌석을 삭제하시겠습니까?');
    if (confirmDelete) {
      canvas.remove(selectedObject);
      canvas.renderAll();
    }
  }, [selectedObject, isLocked, canvas]);

  // 복제
  const handleDuplicate = useCallback(() => {
    if (!selectedObject || isLocked) return;

    selectedObject.clone((cloned: fabric.Object) => {
      const clonedSeat = cloned as SeatObject;
      clonedSeat.set({
        left: (selectedObject.left || 0) + 20,
        top: (selectedObject.top || 0) + 20,
      });
      clonedSeat.id = `seat_${Date.now()}_copy`;
      canvas.add(clonedSeat);
      canvas.setActiveObject(clonedSeat);
      canvas.renderAll();
    });
  }, [selectedObject, isLocked, canvas]);

  if (!selectedObject) {
    return (
      <div className={styles.settings}>
        <div className={styles.noSelection}>
          <Icons.Settings size={48} />
          <h3>객체를 선택해주세요</h3>
          <p>
            편집할 좌석을 클릭하면 <br />
            설정 패널이 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settings}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h3 className={styles.title}>좌석 설정</h3>
        <button
          onClick={handleLockToggle}
          className={`${styles.lockButton} ${isLocked ? styles.locked : ''}`}
          title={isLocked ? '잠금 해제' : '잠금'}
        >
          {isLocked ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
        </button>
      </div>

      {/* 객체 ID */}
      {selectedObject.id && (
        <div className={styles.section}>
          <div className={styles.objectId}>ID: {selectedObject.id}</div>
        </div>
      )}

      {/* 가격 설정 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>좌석 가격 설정</h4>
        <div className={styles.inputGroup}>
          <label className={styles.label}>좌석 가격 (원)</label>
          <input
            type='number'
            value={price}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            disabled={isLocked}
            className={styles.input}
            min='0'
            step='1000'
          />
        </div>
      </div>

      {/* 위치 설정 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>위치</h4>
        <div className={styles.positionGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>X</label>
            <input
              type='number'
              value={position.x}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              disabled={isLocked}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Y</label>
            <input
              type='number'
              value={position.y}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              disabled={isLocked}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* 객체 정보 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>객체 정보</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>크기</span>
            <span className={styles.infoValue}>
              {selectedObject.width} × {selectedObject.height}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>타입</span>
            <span className={styles.infoValue}>좌석</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>상태</span>
            <span
              className={`${styles.infoValue} ${isLocked ? styles.locked : styles.unlocked}`}
            >
              {isLocked ? '잠김' : '편집 가능'}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>액션</h4>
        <div className={styles.actionButtons}>
          <button
            onClick={handleDuplicate}
            disabled={isLocked}
            className={styles.actionButton}
            title='복제'
          >
            <Icons.Copy size={16} />
            복제
          </button>
          <button
            onClick={handleDelete}
            disabled={isLocked}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title='삭제'
          >
            <Icons.Trash size={16} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
