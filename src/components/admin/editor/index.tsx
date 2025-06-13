import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as fabric from 'fabric';

import { useCanvasStore } from '@/core/canvasStore';
import { useThemeStore, initializeSystemThemeListener } from '@/core/themeStore';

import Toolbar from './Toolbar';
import Settings from './settings';
import BulkObjectCreator from './bulkCreator';
import { addRectangleFn } from './shapes/Rect';
import { addCircleFn } from './shapes/Circle';
import { addTextFn } from './shapes/Text';
import { addPolygonFn, cancelPolygonDrawing, isPolygonDrawing } from './shapes/Polygon';
import styles from './canvas.module.css';
import { CloseIcon, HamburgerIcon } from '../common/ui/icons';

interface EditorProps {
  onSave?: (canvasData: string) => void;
  onExit?: () => void;
  initialData?: string;
}

export default function CanvasEditor({ onSave, onExit, initialData }: EditorProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { initializeTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Zustand store
  const {
    canvas,
    selectedTool,
    hasUnsavedChanges,
    setSelectedTool,
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

    const cleanup = initializeSystemThemeListener();
    return cleanup;
  }, [initializeTheme]);

  // 초기 캔버스 생성
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current, initialData);

      // 리사이즈 이벤트 등록
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        disposeCanvas();
      };
    }
  }, [initialData, initializeCanvas, handleResize, disposeCanvas]);

  // 캔버스 마우스 이벤트 처리
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (opt: fabric.TEvent) => {
      const pointer = canvas.getPointer(opt.e);
      if (!pointer) return;

      const { x, y } = pointer;

      switch (selectedTool) {
        case 'rect':
          addRectangleFn(canvas, x, y, setSelectedTool);
          break;
        case 'circle':
          addCircleFn(canvas, x, y, setSelectedTool);
          break;
        case 'text':
          addTextFn(canvas, x, y, '변수 string', setSelectedTool);
          break;
        case 'polygon':
          addPolygonFn(canvas, x, y, setSelectedTool);
          break;
        default:
          break;
      }
    };

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
    };
  }, [canvas, selectedTool, setSelectedTool]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvas) {
        deleteSelectedObjects();
      }

      if (event.key === 'Escape' && canvas) {
        if (isPolygonDrawing()) {
          cancelPolygonDrawing(canvas, setSelectedTool);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, deleteSelectedObjects, setSelectedTool, isMobileMenuOpen]);

  // 페이지 떠날 때 확인
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 저장 핸들러
  const handleSave = async () => {
    if (!canvas) return;

    const canvasData = saveCanvasData();

    if (onSave) {
      await onSave(canvasData);
      setHasUnsavedChanges(false);
    }
    setIsMobileMenuOpen(false);
  };

  // 나가기 핸들러
  const handleExit = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?',
      );
      if (!confirmed) return;
    }

    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  };

  // 저장 후 나가기 핸들러
  const handleSaveAndExit = async () => {
    await handleSave();
    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 오버레이 클릭시 메뉴 닫기
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.editor}>
      {/* 모바일 메뉴 오버레이 */}
      <div 
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={handleOverlayClick}
      />

      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleExit} className={styles.exitButton}>
            ← 나가기
          </button>
          <h1 className={styles.title}>콘서트장 에디터</h1>
          {hasUnsavedChanges && (
            <span className={styles.unsavedIndicator}>● 저장되지 않음</span>
          )}
        </div>

        <div className={styles.headerCenter}>
          <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
          {canvas && !(canvas instanceof HTMLCanvasElement) && (
            <BulkObjectCreator canvas={canvas} />
          )}
        </div>

        <div className={styles.headerRight}>
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={handleSaveAndExit} className={styles.saveExitButton}>
            저장 후 나가기
          </button>
          <button 
            className={`${styles.hamburgerButton} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuTitle}>도구</div>
            <div className={styles.mobileToolbar}>
              <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            </div>
          </div>

          {canvas && !(canvas instanceof HTMLCanvasElement) && (
            <div className={styles.mobileMenuSection}>
              <div className={styles.mobileMenuTitle}>대량 생성</div>
              <div className={styles.mobileBulkCreator}>
                <BulkObjectCreator canvas={canvas} />
              </div>
            </div>
          )}

          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuTitle}>작업</div>
            <div className={styles.mobileActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                저장
              </button>
              <button onClick={handleSaveAndExit} className={styles.saveExitButton}>
                저장 후 나가기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 캔버스 영역 */}
      <div className={styles.canvasContainer}>
        <canvas
          id='canvas'
          ref={canvasRef}
          tabIndex={0}
          onClick={() => canvasRef.current?.focus()}
          className={styles.canvas}
        />

        {/* 사이드 패널 */}
        {canvas && !(canvas instanceof HTMLCanvasElement) && (
          <div className={styles.sidePanels}>
            <Settings canvas={canvas} />
          </div>
        )}

        {/* 폴리곤 그리기 안내 */}
        {selectedTool === 'polygon' && (
          <div className={styles.polygonGuide}>
            폴리곤 그리기: 클릭으로 점 추가, 첫 점 근처 클릭으로 완성, ESC로 취소
          </div>
        )}
      </div>
    </div>
  );
}