import React, { useEffect, useCallback } from 'react';
import * as fabric from 'fabric';

import {
  useBulkCreatorStore,
  calculateOptimalSpacing,
  calculatePatternSpacing,
  createGridObjects,
  createCirclePattern,
  createLinePattern,
} from '@/core/bulkCreatorStore';

import ObjectSettings from './options/ObjectSettings';
import GridSettings from './options/GridSettings';
import PatternSettings from './options/PatternSettings';
import styles from './bulk.module.css';

interface BulkObjectCreatorProps {
  canvas: fabric.Canvas;
}

export default function BulkCreator({ canvas }: BulkObjectCreatorProps) {
  const {
    isOpen,
    activeTab,
    autoSpacing,
    objectConfig,
    gridConfig,
    patternConfig,
    setIsOpen,
    setActiveTab,
    setAutoSpacing,
    setObjectConfig,
    setGridConfig,
    setPatternConfig,
  } = useBulkCreatorStore();

  // 실시간 자동 간격 조정
  useEffect(() => {
    if (!autoSpacing) return;

    const { optimalSpacingX, optimalSpacingY } = calculateOptimalSpacing(
      objectConfig,
      gridConfig,
    );

    // 현재 간격과 차이가 클 때만 업데이트
    const currentSpacingX = gridConfig.spacingX;
    const currentSpacingY = gridConfig.spacingY;

    if (
      Math.abs(currentSpacingX - optimalSpacingX) > 10 ||
      Math.abs(currentSpacingY - optimalSpacingY) > 10
    ) {
      setGridConfig((prev) => ({
        ...prev,
        spacingX: optimalSpacingX,
        spacingY: optimalSpacingY,
      }));
    }
  }, [
    objectConfig.type,
    objectConfig.width,
    objectConfig.height,
    objectConfig.radius,
    objectConfig.fontSize,
    objectConfig.text,
    objectConfig.includeText,
    objectConfig.textContent,
    objectConfig.textFontSize,
    autoSpacing,
    gridConfig.spacingX,
    gridConfig.spacingY,
    setGridConfig,
    objectConfig,
    gridConfig,
  ]);

  // 패턴에도 자동 간격 적용
  useEffect(() => {
    if (!autoSpacing || activeTab !== 'pattern') return;

    const optimalConfig = calculatePatternSpacing(objectConfig, patternConfig);

    // 패턴별 최적 간격 적용
    if (patternConfig.pattern === 'circle' && optimalConfig.radius) {
      if (Math.abs((patternConfig.radius || 150) - optimalConfig.radius) > 20) {
        setPatternConfig((prev) => ({
          ...prev,
          radius: optimalConfig.radius!,
        }));
      }
    } else if (patternConfig.pattern === 'line' && optimalConfig.spacing) {
      if (Math.abs((patternConfig.spacing || 80) - optimalConfig.spacing) > 10) {
        setPatternConfig((prev) => ({
          ...prev,
          spacing: optimalConfig.spacing!,
        }));
      }
    }
  }, [
    objectConfig.type,
    objectConfig.width,
    objectConfig.height,
    objectConfig.radius,
    objectConfig.includeText,
    objectConfig.textContent,
    objectConfig.textFontSize,
    patternConfig.count,
    patternConfig.pattern,
    patternConfig.radius,
    patternConfig.spacing,
    autoSpacing,
    activeTab,
    setPatternConfig,
    objectConfig,
    patternConfig,
  ]);

  // 텍스트 편집 관련 캔버스 이벤트 핸들러 추가
  useEffect(() => {
    if (!canvas) return;

    // 텍스트 편집 완료 시 그룹 복원 핸들러
    const handleTextEditingExited = (e: any) => {
      const textObj = e.target;
      if (!textObj || !(textObj instanceof fabric.IText)) return;

      // 편집 완료 후 그룹을 다시 선택하도록 처리
      setTimeout(() => {
        const objects = canvas.getObjects();
        const parentGroup = objects.find((obj) => {
          if (obj.type === 'group') {
            const group = obj as fabric.Group;
            return group.getObjects().some((child) => child === textObj);
          }
          return false;
        });

        if (parentGroup) {
          canvas.setActiveObject(parentGroup);
          canvas.renderAll();
        }
      }, 100);
    };

    // 전역 텍스트 편집 완료 이벤트 리스너
    canvas.on('text:editing:exited', handleTextEditingExited);

    return () => {
      canvas.off('text:editing:exited', handleTextEditingExited);
    };
  }, [canvas]);

  // 패턴별 객체 생성
  const createPatternObjects = useCallback(() => {
    switch (patternConfig.pattern) {
      case 'circle':
        return createCirclePattern(objectConfig, patternConfig, canvas);
      case 'line':
        return createLinePattern(objectConfig, patternConfig, canvas);
      default:
        return [];
    }
  }, [objectConfig, patternConfig, canvas]);

  // 객체들을 캔버스에 추가
  const addObjectsToCanvas = useCallback(
    (objects: fabric.FabricObject[]) => {
      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.renderAll();
    },
    [canvas],
  );

  // 그리드 생성 실행
  const handleCreateGrid = useCallback(() => {
    const objects = createGridObjects(objectConfig, gridConfig, canvas);
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [objectConfig, gridConfig, canvas, addObjectsToCanvas, setIsOpen]);

  // 패턴 생성 실행
  const handleCreatePattern = useCallback(() => {
    const objects = createPatternObjects();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createPatternObjects, addObjectsToCanvas, setIsOpen]);

  if (!isOpen) {
    return (
      <div className={styles.container}>
        <button onClick={() => setIsOpen(true)} className={styles.openButton}>
          대량 객체 생성
        </button>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>대량 객체 생성</h2>
          <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('grid')}
            className={`${styles.tab} ${activeTab === 'grid' ? styles.activeTab : ''}`}
          >
            그리드
          </button>
          <button
            onClick={() => setActiveTab('pattern')}
            className={`${styles.tab} ${activeTab === 'pattern' ? styles.activeTab : ''}`}
          >
            패턴
          </button>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className={styles.content}>
          {/* 객체 설정 */}
          <ObjectSettings objectConfig={objectConfig} setObjectConfig={setObjectConfig} />

          {/* 그리드 설정 */}
          {activeTab === 'grid' && (
            <GridSettings
              gridConfig={gridConfig}
              setGridConfig={setGridConfig}
              objectConfig={objectConfig}
              autoSpacing={autoSpacing}
              setAutoSpacing={setAutoSpacing}
            />
          )}

          {/* 패턴 설정 */}
          {activeTab === 'pattern' && (
            <PatternSettings
              patternConfig={patternConfig}
              setPatternConfig={setPatternConfig}
              autoSpacing={autoSpacing}
              setAutoSpacing={setAutoSpacing}
            />
          )}

          {/* 사용법 안내 */}
          {(objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
            objectConfig.includeText && (
              <div className={styles.info}>
                💡 Tip: 생성된 도형을 더블클릭하면 텍스트를 편집할 수 있습니다.
              </div>
            )}
        </div>

        {/* 버튼 영역 (고정) */}
        <div className={styles.footer}>
          <div className={styles.buttonContainer}>
            <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>
              취소
            </button>
            <button
              onClick={activeTab === 'grid' ? handleCreateGrid : handleCreatePattern}
              className={styles.createButton}
            >
              생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
