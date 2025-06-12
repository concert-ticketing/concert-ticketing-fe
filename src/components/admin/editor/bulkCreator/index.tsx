import React, { useState, useCallback, useEffect } from 'react';
import * as fabric from 'fabric';

import { ObjectConfig, GridConfig, PatternConfig, TabType } from '@/types/Bulk';

import ObjectSettings from './options/ObjectSettings';
import GridSettings from './options/GridSettings';
import PatternSettings from './options/PatternSettings';
import styles from './bulk.module.css';

interface BulkObjectCreatorProps {
  canvas: fabric.Canvas;
}

export default function BulkCreator({ canvas }: BulkObjectCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [autoSpacing, setAutoSpacing] = useState(false);

  // 객체 설정
  const [objectConfig, setObjectConfig] = useState<ObjectConfig>({
    type: 'rect',
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 1,
    width: 60,
    height: 60,
    radius: 40,
    borderRadius: 0,
    text: 'Text',
    fontSize: 16,
    // 도형 내 텍스트 설정
    includeText: false,
    textContent: '텍스트',
    textColor: '#ffffff',
    textFontSize: 14,
  });

  // 그리드 설정
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 3,
    cols: 3,
    spacingX: 100,
    spacingY: 100,
    startX: 100,
    startY: 100,
  });

  // 패턴 설정
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({
    pattern: 'circle',
    count: 8,
    centerX: 300,
    centerY: 300,
    radius: 150,
    angle: 0,
    spacing: 80,
    areaWidth: 400,
    areaHeight: 300,
  });

  // 실시간 자동 간격 조정
  useEffect(() => {
    if (!autoSpacing) return;

    const calculateOptimalSpacing = () => {
      let objectWidth = 60;
      let objectHeight = 60;

      // 객체 타입별 크기 계산
      if (objectConfig.type === 'rect') {
        objectWidth = objectConfig.width || 60;
        objectHeight = objectConfig.height || 60;
      } else if (objectConfig.type === 'circle') {
        const diameter = (objectConfig.radius || 40) * 2;
        objectWidth = diameter;
        objectHeight = diameter;
      } else if (objectConfig.type === 'text') {
        const fontSize = objectConfig.fontSize || 16;
        const textLength = objectConfig.text ? objectConfig.text.length : 4;
        objectWidth = Math.max(60, textLength * fontSize * 0.6);
        objectHeight = Math.max(60, fontSize * 1.2);
      }

      // 텍스트 포함시 추가 공간 고려
      if (
        (objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
        objectConfig.includeText
      ) {
        const textContent = objectConfig.textContent || '텍스트';
        const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
        const textHeight = objectConfig.textFontSize * 1.2;

        if (objectConfig.type === 'rect') {
          objectWidth = Math.max(objectWidth, textWidth + 20);
          objectHeight = Math.max(objectHeight, textHeight + 20);
        } else if (objectConfig.type === 'circle') {
          const requiredDiameter = Math.max(textWidth, textHeight) * 1.4;
          objectWidth = Math.max(objectWidth, requiredDiameter);
          objectHeight = Math.max(objectHeight, requiredDiameter);
        }
      }

      // 적응형 여백 계산
      const baseMargin = 30;
      const maxSize = Math.max(objectWidth, objectHeight);
      let marginMultiplier;
      if (maxSize > 200) {
        marginMultiplier = 1.1;
      } else if (maxSize > 100) {
        marginMultiplier = 1.2;
      } else {
        marginMultiplier = 1.3;
      }

      const optimalSpacingX = Math.ceil(objectWidth * marginMultiplier + baseMargin);
      const optimalSpacingY = Math.ceil(objectHeight * marginMultiplier + baseMargin);

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
    };

    calculateOptimalSpacing();
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
  ]);

  // 패턴에도 자동 간격 적용
  useEffect(() => {
    if (!autoSpacing || activeTab !== 'pattern') return;

    const calculatePatternSpacing = () => {
      let objectSize = 60;

      if (objectConfig.type === 'rect') {
        objectSize = Math.max(objectConfig.width || 60, objectConfig.height || 60);
      } else if (objectConfig.type === 'circle') {
        objectSize = (objectConfig.radius || 40) * 2;
      }

      // 텍스트 포함시 크기 증가 고려
      if (
        (objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
        objectConfig.includeText
      ) {
        const textContent = objectConfig.textContent || '텍스트';
        const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
        if (objectConfig.type === 'circle') {
          objectSize = Math.max(objectSize, textWidth * 1.4);
        } else {
          objectSize = Math.max(objectSize, textWidth + 20);
        }
      }

      // 패턴별 최적 간격
      if (patternConfig.pattern === 'circle') {
        const optimalRadius = Math.max(
          patternConfig.radius || 150,
          (objectSize * patternConfig.count) / (2 * Math.PI) + objectSize * 0.5,
        );

        if (Math.abs((patternConfig.radius || 150) - optimalRadius) > 20) {
          setPatternConfig((prev) => ({
            ...prev,
            radius: Math.ceil(optimalRadius),
          }));
        }
      } else if (patternConfig.pattern === 'line') {
        const optimalSpacing = Math.ceil(objectSize * 1.3);

        if (Math.abs((patternConfig.spacing || 80) - optimalSpacing) > 10) {
          setPatternConfig((prev) => ({
            ...prev,
            spacing: optimalSpacing,
          }));
        }
      }
    };

    calculatePatternSpacing();
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
  ]);

  // 객체 생성 함수
  const createObject = useCallback(
    (x: number, y: number, index: number): fabric.FabricObject => {
      const id = `bulk_${objectConfig.type}_${Date.now()}_${index}`;

      if (objectConfig.type === 'text') {
        const textObj = new fabric.IText(`${objectConfig.text || 'Text'} ${index + 1}`, {
          left: x,
          top: y,
          fontSize: objectConfig.fontSize,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
        }) as fabric.IText & { id: string };

        textObj.id = id;
        return textObj as fabric.FabricObject;
      }

      // 도형 객체 생성
      let shape: fabric.FabricObject & { id: string };

      if (objectConfig.type === 'rect') {
        shape = new fabric.Rect({
          left: 0,
          top: 0,
          width: objectConfig.width,
          height: objectConfig.height,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
          rx: objectConfig.borderRadius,
          ry: objectConfig.borderRadius,
          strokeUniform: true,
        }) as fabric.Rect & { id: string };
        shape.id = `${id}_rect`;
      } else {
        shape = new fabric.Circle({
          left: 0,
          top: 0,
          radius: objectConfig.radius,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
          strokeUniform: true,
        }) as fabric.Circle & { id: string };
        shape.id = `${id}_circle`;
      }

      // 텍스트를 포함하지 않는 경우 도형만 반환
      if (!objectConfig.includeText) {
        shape.set({
          left: x,
          top: y,
        });
        shape.id = id;
        return shape;
      }

      // 도형 내부에 텍스트 추가
      const textObj = new fabric.IText(
        `${objectConfig.textContent || '텍스트'}${index + 1}`,
        {
          fontSize: objectConfig.textFontSize,
          fill: objectConfig.textColor,
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          editable: true,
          selectable: true,
          left: 0,
          top: 0,
        },
      ) as fabric.IText & { id: string };

      textObj.id = `${id}_text`;

      // 도형의 중심에 텍스트 배치
      if (objectConfig.type === 'rect') {
        const rectWidth = objectConfig.width || 60;
        const rectHeight = objectConfig.height || 60;
        textObj.set({
          left: rectWidth / 2,
          top: rectHeight / 2,
        });
      } else if (objectConfig.type === 'circle') {
        const circleRadius = objectConfig.radius || 40;
        textObj.set({
          left: circleRadius,
          top: circleRadius,
        });
      }

      // 도형과 텍스트를 그룹으로 묶기
      const group = new fabric.Group([shape, textObj as fabric.FabricObject], {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        selectable: true,
        strokeUniform: true,
        subTargetCheck: true,
      }) as fabric.Group & { id: string };

      group.id = id;

      group.on('mousedblclick', (e: any) => {
        e.e?.preventDefault();
        e.e?.stopPropagation();

        if (group.subTargetCheck && e.subTargets && e.subTargets.length > 0) {
          const subTarget = e.subTargets[0];
          if (subTarget instanceof fabric.IText) {
            canvas.setActiveObject(subTarget as fabric.Object);
            subTarget.enterEditing();
            subTarget.selectAll();
          }
        }
      });

      return group;
    },
    [objectConfig, canvas],
  );

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

  // 그리드 패턴으로 생성
  const createGridObjects = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    let index = 0;

    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        const x = gridConfig.startX + col * gridConfig.spacingX;
        const y = gridConfig.startY + row * gridConfig.spacingY;

        objects.push(createObject(x, y, index));
        index++;
      }
    }

    return objects;
  }, [gridConfig, createObject]);

  // 원형 패턴으로 생성
  const createCirclePattern = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    const angleStep = (2 * Math.PI) / patternConfig.count;

    for (let i = 0; i < patternConfig.count; i++) {
      const angle = i * angleStep;
      const x = patternConfig.centerX + Math.cos(angle) * (patternConfig.radius || 100);
      const y = patternConfig.centerY + Math.sin(angle) * (patternConfig.radius || 100);

      objects.push(createObject(x, y, i));
    }

    return objects;
  }, [patternConfig, createObject]);

  // 직선 패턴으로 생성
  const createLinePattern = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    const angle = ((patternConfig.angle || 0) * Math.PI) / 180;
    const spacing = patternConfig.spacing || 60;

    for (let i = 0; i < patternConfig.count; i++) {
      const distance = i * spacing;
      const x = patternConfig.centerX + Math.cos(angle) * distance;
      const y = patternConfig.centerY + Math.sin(angle) * distance;

      objects.push(createObject(x, y, i));
    }

    return objects;
  }, [patternConfig, createObject]);

  // 패턴별 객체 생성
  const createPatternObjects = useCallback(() => {
    switch (patternConfig.pattern) {
      case 'circle':
        return createCirclePattern();
      case 'line':
        return createLinePattern();
      default:
        return [];
    }
  }, [patternConfig, createCirclePattern, createLinePattern]);

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
    const objects = createGridObjects();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createGridObjects, addObjectsToCanvas]);

  // 패턴 생성 실행
  const handleCreatePattern = useCallback(() => {
    const objects = createPatternObjects();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createPatternObjects, addObjectsToCanvas]);

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
