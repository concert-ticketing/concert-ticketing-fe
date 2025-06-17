import React, { useState, useCallback, useEffect } from 'react';
import * as fabric from 'fabric';

import { useCanvasStore } from '@/core/canvasStore';
import { useBulkCreatorStore } from '@/core/bulkCreatorStore';

import { Icons } from '@/components/admin/common/ui/icons';
import styles from './bulk.module.css';

interface BulkObjectCreatorProps {
  seatConfig: {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  };
}

export default function BulkObjectCreator({ seatConfig }: BulkObjectCreatorProps) {
  const { canvas } = useCanvasStore();
  const {
    objectConfig,
    gridConfig,
    patternConfig,
    setObjectConfig,
    setGridConfig,
    setPatternConfig,
  } = useBulkCreatorStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'pattern'>('grid');

  // 좌석 설정으로 초기화
  useEffect(() => {
    setObjectConfig({
      ...objectConfig,
      type: 'rect',
      fill: seatConfig.fill,
      stroke: seatConfig.stroke,
      strokeWidth: seatConfig.strokeWidth,
      width: seatConfig.width,
      height: seatConfig.height,
      borderRadius: seatConfig.rx,
      includeText: false,
    });
  }, [seatConfig, setObjectConfig]);

  // 캔버스 중앙 좌표 계산
  const getCanvasCenter = useCallback(() => {
    if (!canvas) return { x: 200, y: 200 };

    const center = canvas.getCenter();
    return { x: center.left, y: center.top };
  }, [canvas]);

  // 좌석 객체 생성 함수
  const createSeatObject = useCallback(
    (x: number, y: number, index: number): fabric.FabricObject => {
      const id = `seat_${Date.now()}_${index}`;

      const seat = new fabric.Rect({
        left: x,
        top: y,
        width: seatConfig.width,
        height: seatConfig.height,
        fill: seatConfig.fill,
        stroke: seatConfig.stroke,
        strokeWidth: seatConfig.strokeWidth,
        rx: seatConfig.rx,
        ry: seatConfig.ry,
        originX: 'center',
        originY: 'center',
        strokeUniform: true,
      }) as fabric.Rect & { id: string };

      seat.id = id;
      return seat;
    },
    [seatConfig],
  );

  // 그리드 생성 함수
  const createGridSeats = useCallback(() => {
    if (!canvas) return [];

    const seats: fabric.FabricObject[] = [];
    const center = getCanvasCenter();

    // 전체 그리드 크기 계산
    const totalWidth = (gridConfig.cols - 1) * gridConfig.spacingX;
    const totalHeight = (gridConfig.rows - 1) * gridConfig.spacingY;

    // 시작 위치 (중앙 기준)
    const startX = center.x - totalWidth / 2;
    const startY = center.y - totalHeight / 2;

    let index = 0;
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        const x = startX + col * gridConfig.spacingX;
        const y = startY + row * gridConfig.spacingY;

        seats.push(createSeatObject(x, y, index));
        index++;
      }
    }

    return seats;
  }, [canvas, gridConfig, getCanvasCenter, createSeatObject]);

  // 원형 패턴 생성 함수
  const createCircleSeats = useCallback(() => {
    if (!canvas) return [];

    const seats: fabric.FabricObject[] = [];
    const center = getCanvasCenter();
    const angleStep = (2 * Math.PI) / patternConfig.count;

    for (let i = 0; i < patternConfig.count; i++) {
      const angle = i * angleStep;
      const x = center.x + Math.cos(angle) * (patternConfig.radius || 100);
      const y = center.y + Math.sin(angle) * (patternConfig.radius || 100);

      seats.push(createSeatObject(x, y, i));
    }

    return seats;
  }, [canvas, patternConfig, getCanvasCenter, createSeatObject]);

  // 직선 패턴 생성 함수
  const createLineSeats = useCallback(() => {
    if (!canvas) return [];

    const seats: fabric.FabricObject[] = [];
    const center = getCanvasCenter();
    const angle = ((patternConfig.angle || 0) * Math.PI) / 180;
    const spacing = patternConfig.spacing || 60;

    for (let i = 0; i < patternConfig.count; i++) {
      const distance = i * spacing;
      const x = center.x + Math.cos(angle) * distance;
      const y = center.y + Math.sin(angle) * distance;

      seats.push(createSeatObject(x, y, i));
    }

    return seats;
  }, [canvas, patternConfig, getCanvasCenter, createSeatObject]);

  // 객체들을 캔버스에 추가
  const addObjectsToCanvas = useCallback(
    (objects: fabric.FabricObject[]) => {
      if (!canvas) return;

      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.renderAll();
    },
    [canvas],
  );

  // 그리드 생성 실행
  const handleCreateGrid = useCallback(() => {
    const objects = createGridSeats();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createGridSeats, addObjectsToCanvas]);

  // 패턴 생성 실행
  const handleCreatePattern = useCallback(() => {
    let objects: fabric.FabricObject[] = [];

    switch (patternConfig.pattern) {
      case 'circle':
        objects = createCircleSeats();
        break;
      case 'line':
        objects = createLineSeats();
        break;
      default:
        break;
    }

    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [patternConfig.pattern, createCircleSeats, createLineSeats, addObjectsToCanvas]);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.openButton}>
        <Icons.Grid />
        대량 좌석 생성
      </button>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>대량 좌석 생성</h2>
          <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
            <Icons.X />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('grid')}
            className={`${styles.tab} ${activeTab === 'grid' ? styles.activeTab : ''}`}
          >
            <Icons.Grid />
            그리드
          </button>
          <button
            onClick={() => setActiveTab('pattern')}
            className={`${styles.tab} ${activeTab === 'pattern' ? styles.activeTab : ''}`}
          >
            패턴
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'grid' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>그리드 생성</h3>

              <div className={styles.inputGroup}>
                <label className={styles.label}>행 개수</label>
                <input
                  type='number'
                  min='1'
                  max='50'
                  value={gridConfig.rows}
                  onChange={(e) =>
                    setGridConfig({
                      ...gridConfig,
                      rows: Number(e.target.value) || 1,
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>열 개수</label>
                <input
                  type='number'
                  min='1'
                  max='50'
                  value={gridConfig.cols}
                  onChange={(e) =>
                    setGridConfig({
                      ...gridConfig,
                      cols: Number(e.target.value) || 1,
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>가로 간격</label>
                <input
                  type='number'
                  min='10'
                  max='200'
                  value={gridConfig.spacingX}
                  onChange={(e) =>
                    setGridConfig({
                      ...gridConfig,
                      spacingX: Number(e.target.value) || 60,
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>세로 간격</label>
                <input
                  type='number'
                  min='10'
                  max='200'
                  value={gridConfig.spacingY}
                  onChange={(e) =>
                    setGridConfig({
                      ...gridConfig,
                      spacingY: Number(e.target.value) || 60,
                    })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.preview}>
                총 {gridConfig.rows * gridConfig.cols}개의 좌석이 생성됩니다.
              </div>

              <button onClick={handleCreateGrid} className={styles.createButton}>
                그리드 생성
              </button>
            </div>
          )}

          {activeTab === 'pattern' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>패턴 생성</h3>

              <div className={styles.inputGroup}>
                <label className={styles.label}>패턴 유형</label>
                <select
                  value={patternConfig.pattern}
                  onChange={(e) =>
                    setPatternConfig({
                      ...patternConfig,
                      pattern: e.target.value as 'circle' | 'line',
                    })
                  }
                  className={styles.select}
                >
                  <option value='circle'>원형</option>
                  <option value='line'>직선</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>개수</label>
                <input
                  type='number'
                  min='1'
                  max='100'
                  value={patternConfig.count}
                  onChange={(e) =>
                    setPatternConfig({
                      ...patternConfig,
                      count: Number(e.target.value) || 1,
                    })
                  }
                  className={styles.input}
                />
              </div>

              {patternConfig.pattern === 'circle' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>반지름</label>
                  <input
                    type='number'
                    min='50'
                    max='500'
                    value={patternConfig.radius || 100}
                    onChange={(e) =>
                      setPatternConfig({
                        ...patternConfig,
                        radius: Number(e.target.value) || 100,
                      })
                    }
                    className={styles.input}
                  />
                </div>
              )}

              {patternConfig.pattern === 'line' && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>각도 (도)</label>
                    <input
                      type='number'
                      min='0'
                      max='360'
                      value={patternConfig.angle || 0}
                      onChange={(e) =>
                        setPatternConfig({
                          ...patternConfig,
                          angle: Number(e.target.value) || 0,
                        })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>간격</label>
                    <input
                      type='number'
                      min='10'
                      max='200'
                      value={patternConfig.spacing || 60}
                      onChange={(e) =>
                        setPatternConfig({
                          ...patternConfig,
                          spacing: Number(e.target.value) || 60,
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </>
              )}

              <div className={styles.preview}>
                {patternConfig.pattern === 'circle'
                  ? `원형으로 ${patternConfig.count}개의 좌석이 생성됩니다.`
                  : `직선으로 ${patternConfig.count}개의 좌석이 생성됩니다.`}
              </div>

              <button onClick={handleCreatePattern} className={styles.createButton}>
                패턴 생성
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
