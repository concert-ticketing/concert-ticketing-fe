import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as fabric from 'fabric';

import { useCanvasStore } from '@/core/canvasStore';
import { useThemeStore, initializeSystemThemeListener } from '@/core/themeStore';
import { SeatConfig } from '@/types/seat';

import { Icons } from '@/components/admin/common/ui/Icons';
import Settings from './settings';
import BulkObjectCreator from './bulkCreator';
import styles from './editor.module.css';

interface EditorProps {
  onSave?: (canvasData: string) => void;
  onExit?: () => void;
  initialData?: string;
}

// 통일된 좌석 설정
const SEAT_CONFIG: SeatConfig = {
  type: 'rect',
  width: 40,
  height: 40,
  borderRadius: 4,
  fill: '#dddddd',
  stroke: '#ff0000',
  strokeWidth: 2,
  textFontSize: 12,
  rx: 8,
  ry: 8,
};

export default function CanvasEditor({ onSave, onExit, initialData }: EditorProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { initializeTheme } = useThemeStore();

  // Zustand store
  const {
    canvas,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    initializeCanvas,
    disposeCanvas,
    saveCanvasData,
    deleteSelectedObjects,
    handleResize,
  } = useCanvasStore();

  // 라이트모드, 다크모드 감지 클린업 함수
  useEffect(() => {
    initializeTheme();
    return initializeSystemThemeListener();
  }, [initializeTheme]);

  // 초기 캔버스 생성
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current, initialData);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        disposeCanvas();
      };
    }
  }, [initialData, initializeCanvas, handleResize, disposeCanvas]);

  // 단일 좌석 생성 함수
  const createSingleSeat = () => {
    if (!canvas) return;

    const canvasCenter = canvas.getCenter();

    const seat = new fabric.Rect({
      left: canvasCenter.left,
      top: canvasCenter.top,
      width: SEAT_CONFIG.width,
      height: SEAT_CONFIG.height,
      fill: SEAT_CONFIG.fill,
      stroke: SEAT_CONFIG.stroke,
      strokeWidth: SEAT_CONFIG.strokeWidth,
      rx: SEAT_CONFIG.rx,
      ry: SEAT_CONFIG.ry,
      originX: 'center',
      originY: 'center',
      visible: true,
      selectable: true,
    });

    console.log('객체:', seat);

    canvas.add(seat);
    canvas.setActiveObject(seat);
    canvas.renderAll();
    setHasUnsavedChanges(true);
  };

  // 캔버스 이벤트 처리
  useEffect(() => {
    if (!canvas) return;

    const handleObjectModified = () => {
      setHasUnsavedChanges(true);
    };

    const handleObjectAdded = () => {
      setHasUnsavedChanges(true);
    };

    const handleObjectRemoved = () => {
      setHasUnsavedChanges(true);
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, setHasUnsavedChanges]);

  // 저장 함수
  const handleSave = useCallback(() => {
    if (canvas) {
      const canvasData = saveCanvasData();
      if (onSave) {
        onSave(canvasData);
      }
      setHasUnsavedChanges(false);
    }
  }, [canvas, saveCanvasData, onSave, setHasUnsavedChanges]);

  // 나가기 함수
  const handleExit = () => {
    if (hasUnsavedChanges) {
      const confirmExit = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?',
      );
      if (!confirmExit) return;
    }

    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  };

  // 삭제 함수
  const handleDelete = useCallback(() => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      alert('삭제할 객체를 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `선택된 ${activeObjects.length}개의 객체를 삭제하시겠습니까?`,
    );
    if (confirmDelete) {
      deleteSelectedObjects();
    }
  }, [canvas, deleteSelectedObjects]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete 키 또는 Backspace 키로 객체 삭제
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas) {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          handleDelete();
        }
      }

      // Ctrl+S로 저장
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // ESC로 선택 해제
      if (e.key === 'Escape' && canvas) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, handleDelete, handleSave]);

  return (
    <div className={styles.editorContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleExit} className={styles.exitButton}>
            <Icons.ArrowLeft />
            나가기
          </button>
          <h1 className={styles.title}>좌석 배치 에디터</h1>
        </div>

        <div className={styles.headerRight}>
          {hasUnsavedChanges && (
            <span className={styles.unsavedIndicator}>변경사항 있음</span>
          )}
          <button onClick={handleSave} className={styles.saveButton}>
            <Icons.Save />
            저장
          </button>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className={styles.mainContainer}>
        {/* 좌측 컨트롤 패널 */}
        <div className={styles.leftPanel}>
          {/* 객체 생성 버튼들 */}
          <div className={styles.controlSection}>
            <div className={styles.buttonGroup}>
              <button onClick={createSingleSeat} className={styles.primaryButton}>
                <Icons.Plus />
                객체 생성
              </button>
              <BulkObjectCreator seatConfig={SEAT_CONFIG} />
            </div>
          </div>

          {/* 설정 패널 */}
          {canvas && <Settings canvas={canvas} />}
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas} id='fabric-canvas' />
      </div>
    </div>
  );
}
