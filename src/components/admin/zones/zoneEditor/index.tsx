import React, { useState, useCallback, useMemo, useRef } from 'react';

import styles from './zoneEditor.module.css';
import Button from '../../common/ui/Button';
import { Icons } from '../../common/ui/Icons';
import SeatGrid from './seatGrid';
import ControlPanel from './controlPanel';
import RowManager from './rowManager';
import BulkModal from './bulkModal';

interface Seat {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'disabled';
  price: number;
  selected?: boolean;
}

interface ZoneEditorProps {
  zoneId?: string;
  initialSeats?: Seat[];
  onSeatUpdate?: (seats: Seat[]) => void;
}

interface BulkCreationConfig {
  type: 'traditional' | 'theater' | 'stadium' | 'arena' | 'custom';
  rows: string[];
  baseSeatsPerRow: number;
  spacing: {
    seatSpacing: number;
    rowSpacing: number;
    blockSpacing?: number;
  };
  layout: {
    curve: number; // 0 = 직선, 0.5 = 약간 곡선, 1 = 강한 곡선
    angle: number; // 각도
    centerGap?: number; // 중앙 통로 간격
  };
  pricing: {
    basePrice: number;
    priceGradient: 'none' | 'distance' | 'row' | 'zone';
    priceMultiplier: number;
  };
}

export default function ZoneEditor({
  zoneId,
  initialSeats = [],
  onSeatUpdate,
}: ZoneEditorProps) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [gridRows, setGridRows] = useState(8);
  const [gridCols, setGridCols] = useState(12);
  const [availableRows, setAvailableRows] = useState<string[]>(['A', 'B', 'C', 'D', 'E']);
  const [selectedRow, setSelectedRow] = useState<string>('A');
  const [draggedSeat, setDraggedSeat] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const dragImageRef = useRef<HTMLDivElement>(null);

  // 좌석 통계 계산
  const seatStats = useMemo(() => {
    const total = seats.length;
    const available = seats.filter((seat) => seat.status === 'available').length;
    const occupied = seats.filter((seat) => seat.status === 'occupied').length;
    const disabled = seats.filter((seat) => seat.status === 'disabled').length;
    const selected = selectedSeats.length;

    return { total, available, occupied, disabled, selected };
  }, [seats, selectedSeats]);

  // 그리드 확장 함수들
  const expandGridRight = useCallback(() => {
    setGridCols((prev) => Math.min(prev + 1, 50));
  }, []);

  const expandGridBottom = useCallback(() => {
    setGridRows((prev) => Math.min(prev + 1, 30));
  }, []);

  const shrinkGridRight = useCallback(() => {
    setGridCols((prev) => Math.max(prev - 1, 5));
  }, []);

  const shrinkGridBottom = useCallback(() => {
    setGridRows((prev) => Math.max(prev - 1, 5));
  }, []);

  // 좌석 클릭 처리
  const handleSeatClick = useCallback((seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId],
    );
  }, []);

  // 좌석 삭제
  const handleSeatDelete = useCallback((seatId: string) => {
    setSeats((prev) => prev.filter((seat) => seat.id !== seatId));
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
  }, []);

  // 그리드 셀 클릭 처리 (좌석 추가)
  const handleGridCellClick = useCallback(
    (row: number, col: number) => {
      const existingSeat = seats.find((seat) => seat.x === col && seat.y === row);
      if (existingSeat) return;

      const existingSeatsInRow = seats.filter((seat) => seat.row === selectedRow);
      const maxNumber =
        existingSeatsInRow.length > 0
          ? Math.max(...existingSeatsInRow.map((seat) => seat.number))
          : 0;

      const newSeat: Seat = {
        id: `seat-${Date.now()}-${row}-${col}`,
        row: selectedRow,
        number: maxNumber + 1,
        x: col,
        y: row,
        status: 'available',
        price: 50000,
      };

      setSeats((prev) => [...prev, newSeat]);
    },
    [seats, selectedRow],
  );

  // 선택된 좌석 삭제
  const handleDeleteSelected = useCallback(() => {
    if (selectedSeats.length === 0) return;

    const confirmDelete = window.confirm(
      `선택된 ${selectedSeats.length}개의 좌석을 삭제하시겠습니까?`,
    );

    if (confirmDelete) {
      setSeats((prev) => prev.filter((seat) => !selectedSeats.includes(seat.id)));
      setSelectedSeats([]);
    }
  }, [selectedSeats]);

  // 선택된 좌석 상태 변경
  const handleChangeSelectedStatus = useCallback(
    (status: Seat['status']) => {
      if (selectedSeats.length === 0) return;

      setSeats((prev) =>
        prev.map((seat) =>
          selectedSeats.includes(seat.id) ? { ...seat, status } : seat,
        ),
      );
    },
    [selectedSeats],
  );

  // 선택된 좌석 가격 변경
  const handleChangeSelectedPrice = useCallback(
    (price: number) => {
      if (selectedSeats.length === 0) return;

      setSeats((prev) =>
        prev.map((seat) => (selectedSeats.includes(seat.id) ? { ...seat, price } : seat)),
      );
    },
    [selectedSeats],
  );

  // 전체 선택/해제
  const handleSelectAll = useCallback(() => {
    setSelectedSeats(seats.map((seat) => seat.id));
  }, [seats]);

  const handleDeselectAll = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  // 드래그 앤 드롭 처리
  const handleDragStart = useCallback((e: React.DragEvent, seatId: string) => {
    setDraggedSeat(seatId);
    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredCell({ row, col });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();

      if (!draggedSeat) return;

      const existingSeat = seats.find((seat) => seat.x === col && seat.y === row);
      if (existingSeat && existingSeat.id !== draggedSeat) return;

      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === draggedSeat ? { ...seat, x: col, y: row } : seat,
        ),
      );

      setDraggedSeat(null);
      setHoveredCell(null);
    },
    [draggedSeat, seats],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedSeat(null);
    setHoveredCell(null);
  }, []);

  // 특정 위치에 좌석이 있는지 확인
  const getSeatAtPosition = useCallback(
    (x: number, y: number) => {
      return seats.find((seat) => seat.x === x && seat.y === y);
    },
    [seats],
  );

  // 획기적인 대량 좌석 생성 함수
  const handleAdvancedBulkCreate = useCallback(
    (config: BulkCreationConfig) => {
      const newSeats: Seat[] = [];
      const { type, rows, baseSeatsPerRow, spacing, layout, pricing } = config;

      switch (type) {
        case 'theater': {
          // 극장식 배치: 앞열일수록 적고, 뒷열일수록 많음
          rows.forEach((rowName, rowIndex) => {
            const seatsInRow = baseSeatsPerRow + Math.floor(rowIndex * 0.5);
            const rowY = Math.floor(gridRows * 0.2) + rowIndex * spacing.rowSpacing;

            // 중앙 정렬을 위한 시작 X 계산
            const totalRowWidth = (seatsInRow - 1) * spacing.seatSpacing;
            const startX = Math.floor(
              (gridCols - totalRowWidth / spacing.seatSpacing) / 2,
            );

            for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
              const seatX = startX + (seatNum - 1) * spacing.seatSpacing;

              // 곡선 효과 적용
              let adjustedY = rowY;
              if (layout.curve > 0) {
                const centerOffset = Math.abs(seatNum - (seatsInRow + 1) / 2);
                const maxOffset = seatsInRow / 2;
                const curveOffset = (centerOffset / maxOffset) * layout.curve * 2;
                adjustedY = Math.max(0, rowY - curveOffset);
              }

              // 가격 계산
              let price = pricing.basePrice;
              if (pricing.priceGradient === 'row') {
                price =
                  pricing.basePrice *
                  (1 + (rows.length - rowIndex - 1) * pricing.priceMultiplier);
              } else if (pricing.priceGradient === 'distance') {
                const distanceFromCenter = Math.abs(seatNum - (seatsInRow + 1) / 2);
                price =
                  pricing.basePrice *
                  (1 - (distanceFromCenter / seatsInRow) * pricing.priceMultiplier);
              }

              if (
                seatX >= 0 &&
                seatX < gridCols &&
                adjustedY >= 0 &&
                adjustedY < gridRows
              ) {
                newSeats.push({
                  id: `bulk-${type}-${rowName}-${seatNum}`,
                  row: rowName,
                  number: seatNum,
                  x: seatX,
                  y: Math.floor(adjustedY),
                  status: 'available',
                  price: Math.round(price),
                });
              }
            }
          });
          break;
        }

        case 'stadium': {
          // 경기장식 배치: 곡선형, 블록 단위
          const blocksPerRow = 3; // 좌측, 중앙, 우측 블록

          rows.forEach((rowName, rowIndex) => {
            const rowY = Math.floor(gridRows * 0.15) + rowIndex * spacing.rowSpacing;

            for (let blockIndex = 0; blockIndex < blocksPerRow; blockIndex++) {
              const seatsInBlock = Math.floor(baseSeatsPerRow / blocksPerRow);
              const blockStartX =
                blockIndex *
                (Math.floor(gridCols / blocksPerRow) + (spacing.blockSpacing || 2));

              for (let seatNum = 1; seatNum <= seatsInBlock; seatNum++) {
                const globalSeatNum = blockIndex * seatsInBlock + seatNum;
                const seatX = blockStartX + (seatNum - 1) * spacing.seatSpacing;

                // 경기장 곡선 효과
                let adjustedY = rowY;
                if (layout.curve > 0) {
                  const totalWidth = gridCols;
                  const relativeX = seatX / totalWidth;
                  const curveHeight = layout.curve * 4;
                  adjustedY = rowY + curveHeight * 4 * relativeX * (1 - relativeX);
                }

                // 블록별 가격 차등
                let price = pricing.basePrice;
                if (blockIndex === 1) {
                  // 중앙 블록
                  price *= 1.3;
                } else {
                  // 측면 블록
                  price *= 0.9;
                }

                if (
                  seatX >= 0 &&
                  seatX < gridCols &&
                  adjustedY >= 0 &&
                  adjustedY < gridRows
                ) {
                  newSeats.push({
                    id: `bulk-${type}-${rowName}-${globalSeatNum}`,
                    row: rowName,
                    number: globalSeatNum,
                    x: seatX,
                    y: Math.floor(adjustedY),
                    status: 'available',
                    price: Math.round(price),
                  });
                }
              }
            }
          });
          break;
        }

        case 'arena': {
          // 아레나식 배치: 원형 또는 타원형
          const centerX = gridCols / 2;
          const centerY = gridRows / 2;
          const radiusX = Math.min(gridCols, gridCols) * 0.4;
          const radiusY = Math.min(gridRows, gridRows) * 0.35;

          rows.forEach((rowName, rowIndex) => {
            const rowRadius = radiusX + rowIndex * spacing.rowSpacing * 0.5;
            const circumference = 2 * Math.PI * rowRadius;
            const seatsInRow = Math.floor(circumference / (spacing.seatSpacing * 2));
            const angleStep = (2 * Math.PI) / seatsInRow;

            for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
              const angle = (seatNum - 1) * angleStep + (layout.angle * Math.PI) / 180;
              const seatX = Math.round(centerX + Math.cos(angle) * rowRadius);
              const seatY = Math.round(
                centerY + Math.sin(angle) * radiusY * (1 + rowIndex * 0.1),
              );

              let price = pricing.basePrice;
              if (pricing.priceGradient === 'row') {
                price *= 1 + (rows.length - rowIndex - 1) * pricing.priceMultiplier;
              }

              if (seatX >= 0 && seatX < gridCols && seatY >= 0 && seatY < gridRows) {
                newSeats.push({
                  id: `bulk-${type}-${rowName}-${seatNum}`,
                  row: rowName,
                  number: seatNum,
                  x: seatX,
                  y: seatY,
                  status: 'available',
                  price: Math.round(price),
                });
              }
            }
          });
          break;
        }

        default: {
          // 기존 traditional 방식
          rows.forEach((rowName, rowIndex) => {
            const rowY = Math.floor(gridRows * 0.2) + rowIndex * spacing.rowSpacing;
            const startX = Math.floor(
              (gridCols - baseSeatsPerRow * spacing.seatSpacing) / 2,
            );

            for (let seatNum = 1; seatNum <= baseSeatsPerRow; seatNum++) {
              const seatX = startX + (seatNum - 1) * spacing.seatSpacing;

              if (seatX >= 0 && seatX < gridCols && rowY >= 0 && rowY < gridRows) {
                newSeats.push({
                  id: `bulk-${type}-${rowName}-${seatNum}`,
                  row: rowName,
                  number: seatNum,
                  x: seatX,
                  y: rowY,
                  status: 'available',
                  price: pricing.basePrice,
                });
              }
            }
          });
        }
      }

      // 기존 좌석과 겹치지 않는 좌석만 추가
      const filteredNewSeats = newSeats.filter(
        (newSeat) =>
          !seats.some(
            (existingSeat) =>
              existingSeat.x === newSeat.x && existingSeat.y === newSeat.y,
          ),
      );

      setSeats((prev) => [...prev, ...filteredNewSeats]);
      setIsBulkModalOpen(false);
    },
    [seats, gridRows, gridCols],
  );

  return (
    <div className={styles.container}>
      {/* 투명 드래그 이미지 */}
      <div ref={dragImageRef} className={styles.dragImage} />

      {/* 상단 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>좌석 배치 에디터</h2>
          {zoneId && <span className={styles.zoneId}>Zone: {zoneId}</span>}
        </div>

        <div className={styles.headerRight}>
          <Button
            variant='success'
            icon={<Icons.Save />}
            onClick={() => onSeatUpdate?.(seats)}
          >
            저장
          </Button>
        </div>
      </div>

      {/* 행 관리 컴포넌트 */}
      <RowManager
        availableRows={availableRows}
        selectedRow={selectedRow}
        seats={seats}
        onRowsChange={setAvailableRows}
        onSelectedRowChange={setSelectedRow}
        onSeatsChange={setSeats}
      />

      {/* 메인 에디터 영역 */}
      <div className={styles.editorArea}>
        {/* 좌측 컨트롤 패널 */}
        <ControlPanel
          seatStats={seatStats}
          selectedSeats={selectedSeats}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onDeleteSelected={handleDeleteSelected}
          onChangeSelectedStatus={handleChangeSelectedStatus}
          onChangeSelectedPrice={handleChangeSelectedPrice}
          onOpenBulkModal={() => setIsBulkModalOpen(true)}
        />

        {/* 좌석 그리드 */}
        <SeatGrid
          gridRows={gridRows}
          gridCols={gridCols}
          seats={seats}
          selectedSeats={selectedSeats}
          draggedSeat={draggedSeat}
          hoveredCell={hoveredCell}
          onGridCellClick={handleGridCellClick}
          onSeatClick={handleSeatClick}
          onSeatDelete={handleSeatDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onExpandRight={expandGridRight}
          onExpandBottom={expandGridBottom}
          onShrinkRight={shrinkGridRight}
          onShrinkBottom={shrinkGridBottom}
          getSeatAtPosition={getSeatAtPosition}
        />
      </div>

      {/* 범례 */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.available}`} />
          <span>사용 가능</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.occupied}`} />
          <span>예약됨</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.disabled}`} />
          <span>사용 불가</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selected}`} />
          <span>선택됨</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.empty}`} />
          <span>빈 공간</span>
        </div>
      </div>

      {/* 획기적인 대량 생성 모달 */}
      {isBulkModalOpen && (
        <BulkModal
          availableRows={availableRows}
          onClose={() => setIsBulkModalOpen(false)}
          onBulkCreate={handleAdvancedBulkCreate}
        />
      )}
    </div>
  );
}
