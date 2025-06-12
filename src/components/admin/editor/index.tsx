import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as fabric from 'fabric';

import Toolbar from './Toolbar';
import Settings from './settings';
import BulkObjectCreator from './bulkCreator';
import { addRectangleFn } from './shapes/Rect';
import { addCircleFn } from './shapes/Circle';
import { addTextFn } from './shapes/Text';
import { addPolygonFn, cancelPolygonDrawing, isPolygonDrawing } from './shapes/Polygon';
import styles from './canvas.module.css';
import ThemeToggle from '../common/ui/theme/ThemeToggle';

interface FullscreenEditorProps {
  onSave?: (canvasData: string) => void;
  onExit?: () => void;
  initialData?: string;
}

export default function FullscreenEditor({
  onSave,
  onExit,
  initialData,
}: FullscreenEditorProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const selectedToolRef = useRef<'rect' | 'circle' | 'text' | 'group' | 'polygon' | null>(
    null,
  );
  const [selectedTool, setSelectedTool] = useState<
    'rect' | 'circle' | 'text' | 'group' | 'polygon' | null
  >(null);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  // 초기 캔버스 생성
  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 60, // 헤더 높이 제외
        selection: true,
      });

      initCanvas.backgroundColor = '#dfdfdf';

      // 초기 데이터가 있으면 로드
      if (initialData) {
        initCanvas.loadFromJSON(initialData, () => {
          initCanvas.renderAll();
        });
      } else {
        initCanvas.renderAll();
      }

      setCanvas(initCanvas);

      // 변경사항 감지
      const handleCanvasChange = () => {
        setHasUnsavedChanges(true);
      };

      initCanvas.on('object:added', handleCanvasChange);
      initCanvas.on('object:removed', handleCanvasChange);
      initCanvas.on('object:modified', handleCanvasChange);

      const handleResize = () => {
        initCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 60,
        });
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        initCanvas.dispose();
        canvasRef.current = null;
      };
    }
  }, [initialData]);

  // 캔버스 이벤트 처리
  useEffect(() => {
    if (canvas) {
      const handleMouseDown = (opt: fabric.TEvent) => {
        const pointer = canvas.getPointer(opt.e);
        if (!pointer) return;

        const { x, y } = pointer;

        switch (selectedToolRef.current) {
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

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete' && canvas) {
          const activeObject = canvas.getActiveObject();
          if (!activeObject) return;

          if (activeObject.type === 'activeSelection') {
            (activeObject as fabric.ActiveSelection).getObjects().forEach((obj) => {
              canvas.remove(obj);
            });
          } else {
            canvas.remove(activeObject);
          }

          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }

        if (event.key === 'Escape' && canvas) {
          if (isPolygonDrawing()) {
            cancelPolygonDrawing(canvas, setSelectedTool);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      canvas.on('mouse:down', handleMouseDown);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [canvas]);

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

  const handleSave = async () => {
    if (!canvas) return;

    const canvasData = JSON.stringify(canvas.toJSON());

    if (onSave) {
      await onSave(canvasData);
      setHasUnsavedChanges(false);
    }
  };

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

  const handleSaveAndExit = async () => {
    await handleSave();
    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.editor}>
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
        </div>

        <div className={styles.headerRight}>
          <ThemeToggle />
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={handleSaveAndExit} className={styles.saveExitButton}>
            저장 후 나가기
          </button>
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

        {/* 사이드 패널들 */}
        {canvas && !(canvas instanceof HTMLCanvasElement) && (
          <div className={styles.sidePanels}>
            <Settings canvas={canvas} />
            <BulkObjectCreator canvas={canvas} />
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
