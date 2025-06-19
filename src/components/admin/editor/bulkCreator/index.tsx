import React, { useState, useCallback } from 'react';
import * as fabric from 'fabric';

import { useCanvasStore } from '@/core/canvasStore';
import { GridConfig, PatternConfig, SeatConfig } from '@/types/seat';

import { Icons } from '@/components/admin/common/ui/Icons';
import styles from './bulk.module.css';

interface BulkObjectCreatorProps {
  seatConfig: SeatConfig;
}

type TabType = 'grid' | 'pattern';

export default function BulkObjectCreator({ seatConfig }: BulkObjectCreatorProps) {
  const { canvas } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('grid');

  // 그리드 설정 (통일된 간격)
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 3,
    cols: 3,
    spacingX: 80,
    spacingY: 80,
  });

  // 패턴 설정 (통일된 간격)
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({
    pattern: 'circle',
    count: 6,
    radius: 120,
    angle: 0,
    spacing: 80,
  });

  // 캔버스 중앙 좌표 가져오기
  const getCanvasCenter = useCallback(() => {
    if (!canvas) return { x: 0, y: 0 };
    const center = canvas.getCenter();
    return { x: center.left, y: center.top };
  }, [canvas]);

  // 좌석 객체 생성 함수 (사각형으로 통일)
  const createSeatObject = useCallback(
    (x: number, y: number, index: number) => {
      const id = `seat-${Date.now()}-${index}`;

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
      const x = center.x + Math.cos(angle) * (patternConfig.radius || 120);
      const y = center.y + Math.sin(angle) * (patternConfig.radius || 120);

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
    const spacing = patternConfig.spacing || 80;

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

        {/* 그리드 탭 */}
        {activeTab === 'grid' && (
          <div className={styles.content}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>그리드 설정</h3>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>행 수</label>
                  <input
                    type='number'
                    min='1'
                    max='20'
                    value={gridConfig.rows}
                    onChange={(e) =>
                      setGridConfig((prev) => ({
                        ...prev,
                        rows: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>열 수</label>
                  <input
                    type='number'
                    min='1'
                    max='20'
                    value={gridConfig.cols}
                    onChange={(e) =>
                      setGridConfig((prev) => ({
                        ...prev,
                        cols: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>가로 간격</label>
                  <input
                    type='number'
                    min='60'
                    max='200'
                    value={gridConfig.spacingX}
                    onChange={(e) =>
                      setGridConfig((prev) => ({
                        ...prev,
                        spacingX: parseInt(e.target.value, 10) || 80,
                      }))
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>세로 간격</label>
                  <input
                    type='number'
                    min='60'
                    max='200'
                    value={gridConfig.spacingY}
                    onChange={(e) =>
                      setGridConfig((prev) => ({
                        ...prev,
                        spacingY: parseInt(e.target.value, 10) || 80,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button onClick={handleCreateGrid} className={styles.createButton}>
                <Icons.Plus />
                그리드 생성 ({gridConfig.rows * gridConfig.cols}개)
              </button>
            </div>
          </div>
        )}

        {/* 패턴 탭 */}
        {activeTab === 'pattern' && (
          <div className={styles.content}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>패턴 설정</h3>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>패턴 유형</label>
                  <select
                    value={patternConfig.pattern}
                    onChange={(e) =>
                      setPatternConfig((prev) => ({
                        ...prev,
                        pattern: e.target.value as 'circle' | 'line',
                      }))
                    }
                    className={styles.select}
                  >
                    <option value='circle'>원형</option>
                    <option value='line'>직선</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>객체 수</label>
                  <input
                    type='number'
                    min='2'
                    max='50'
                    value={patternConfig.count}
                    onChange={(e) =>
                      setPatternConfig((prev) => ({
                        ...prev,
                        count: parseInt(e.target.value, 10) || 2,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              {patternConfig.pattern === 'circle' && (
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>반지름</label>
                    <input
                      type='number'
                      min='50'
                      max='300'
                      value={patternConfig.radius}
                      onChange={(e) =>
                        setPatternConfig((prev) => ({
                          ...prev,
                          radius: parseInt(e.target.value, 10) || 120,
                        }))
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              )}

              {patternConfig.pattern === 'line' && (
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>각도</label>
                    <input
                      type='number'
                      min='0'
                      max='360'
                      value={patternConfig.angle}
                      onChange={(e) =>
                        setPatternConfig((prev) => ({
                          ...prev,
                          angle: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>간격</label>
                    <input
                      type='number'
                      min='60'
                      max='200'
                      value={patternConfig.spacing}
                      onChange={(e) =>
                        setPatternConfig((prev) => ({
                          ...prev,
                          spacing: parseInt(e.target.value, 10) || 80,
                        }))
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button onClick={handleCreatePattern} className={styles.createButton}>
                <Icons.Plus />
                패턴 생성 ({patternConfig.count}개)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
