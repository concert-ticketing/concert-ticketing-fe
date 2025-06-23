import React, { useMemo } from 'react';

import Button from '../../../common/ui/Button';
import { Icons } from '../../../common/ui/Icons';
import styles from './seatGrid.module.css';

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

interface SeatGridProps {
  gridRows: number;
  gridCols: number;
  seats: Seat[];
  selectedSeats: string[];
  draggedSeat: string | null;
  hoveredCell: { row: number; col: number } | null;
  onGridCellClick: (row: number, col: number) => void;
  onSeatClick: (seatId: string) => void;
  onSeatDelete: (seatId: string) => void;
  onDragStart: (e: React.DragEvent, seatId: string) => void;
  onDragOver: (e: React.DragEvent, row: number, col: number) => void;
  onDrop: (e: React.DragEvent, row: number, col: number) => void;
  onDragEnd: () => void;
  onExpandRight: () => void;
  onExpandBottom: () => void;
  onShrinkRight: () => void;
  onShrinkBottom: () => void;
  getSeatAtPosition: (x: number, y: number) => Seat | undefined;
}

export default function SeatGrid({
  gridRows,
  gridCols,
  seats,
  selectedSeats,
  draggedSeat,
  hoveredCell,
  onGridCellClick,
  onSeatClick,
  onSeatDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onExpandRight,
  onExpandBottom,
  onShrinkRight,
  onShrinkBottom,
  getSeatAtPosition,
}: SeatGridProps) {
  // 그리드 셀 생성
  const gridCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }, [gridRows, gridCols]);

  const handleDragLeave = () => {
    // 드래그 리브 처리는 부모에서 관리
  };

  return (
    <div className={styles.seatGridContainer}>
      {/* 상단 컨트롤 */}
      <div className={styles.gridControls}>
        <div className={styles.gridInfo}>
          <span className={styles.gridSize}>
            그리드 크기: {gridRows} × {gridCols}
          </span>
          <span className={styles.seatCount}>총 좌석: {seats.length}개</span>
        </div>

        <div className={styles.gridActions}>
          <div className={styles.horizontalControls}>
            <Button
              size='small'
              variant='secondary'
              onClick={onShrinkRight}
              disabled={gridCols <= 5}
              icon={<Icons.Minus />}
            >
              열 축소
            </Button>
            <span className={styles.controlLabel}>가로 {gridCols}</span>
            <Button
              size='small'
              variant='secondary'
              onClick={onExpandRight}
              disabled={gridCols >= 50}
              icon={<Icons.Plus />}
            >
              열 확장
            </Button>
          </div>

          <div className={styles.verticalControls}>
            <Button
              size='small'
              variant='secondary'
              onClick={onShrinkBottom}
              disabled={gridRows <= 5}
              icon={<Icons.Minus />}
            >
              행 축소
            </Button>
            <span className={styles.controlLabel}>세로 {gridRows}</span>
            <Button
              size='small'
              variant='secondary'
              onClick={onExpandBottom}
              disabled={gridRows >= 30}
              icon={<Icons.Plus />}
            >
              행 확장
            </Button>
          </div>
        </div>
      </div>

      {/* 그리드 컨테이너 */}
      <div className={styles.gridWrapper}>
        {/* 메인 그리드 */}
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          }}
        >
          {gridCells.map(({ row, col }) => {
            const seat = getSeatAtPosition(col, row);
            const isSelected = seat && selectedSeats.includes(seat.id);
            const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
            const isDragTarget = draggedSeat && isHovered && !seat;

            return (
              <div
                key={`${row}-${col}`}
                className={`${styles.gridCell} ${
                  seat ? styles.hasSeat : styles.emptySeat
                } ${isDragTarget ? styles.dragTarget : ''}`}
                onClick={() => {
                  if (!seat) {
                    onGridCellClick(row, col);
                  }
                }}
                onDragOver={(e) => onDragOver(e, row, col)}
                onDrop={(e) => onDrop(e, row, col)}
                onDragLeave={handleDragLeave}
              >
                {seat && (
                  <SeatItem
                    seat={seat}
                    isSelected={!!isSelected}
                    isDragging={draggedSeat === seat.id}
                    onSeatClick={onSeatClick}
                    onSeatDelete={onSeatDelete}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 오른쪽 확장 영역 */}
        <div className={styles.rightExpandArea}>
          {Array.from({ length: gridRows }, (_, index) => (
            <div key={`right-${index}`} className={styles.expandCell}>
              {index === Math.floor(gridRows / 2) && (
                <Button
                  size='small'
                  variant='neutral'
                  onClick={onExpandRight}
                  className={styles.expandButton}
                  icon={<Icons.Plus />}
                />
              )}
            </div>
          ))}
        </div>

        {/* 하단 확장 영역 */}
        <div
          className={styles.bottomExpandArea}
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr) auto` }}
        >
          {Array.from({ length: gridCols }, (_, index) => (
            <div key={`bottom-${index}`} className={styles.expandCell}>
              {index === Math.floor(gridCols / 2) && (
                <Button
                  size='small'
                  variant='neutral'
                  onClick={onExpandBottom}
                  className={styles.expandButton}
                  icon={<Icons.Plus />}
                />
              )}
            </div>
          ))}
          {/* 우하단 코너 */}
          <div className={styles.expandCell} />
        </div>
      </div>

      {/* 그리드 안내 */}
      <div className={styles.gridGuide}>
        <div className={styles.guideItem}>
          <span className={styles.guideIcon}>🖱️</span>
          <span>빈 셀 클릭: 좌석 추가</span>
        </div>
        <div className={styles.guideItem}>
          <span className={styles.guideIcon}>↔️</span>
          <span>드래그: 좌석 이동</span>
        </div>
        <div className={styles.guideItem}>
          <span className={styles.guideIcon}>✅</span>
          <span>좌석 클릭: 선택/해제</span>
        </div>
      </div>
    </div>
  );
}

// 개별 좌석 컴포넌트
interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  isDragging: boolean;
  onSeatClick: (seatId: string) => void;
  onSeatDelete: (seatId: string) => void;
  onDragStart: (e: React.DragEvent, seatId: string) => void;
  onDragEnd: () => void;
}

function SeatItem({
  seat,
  isSelected,
  isDragging,
  onSeatClick,
  onSeatDelete,
  onDragStart,
  onDragEnd,
}: SeatItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSeatClick(seat.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSeatDelete(seat.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, seat.id);
  };

  return (
    <div
      className={`${styles.seat} ${styles[seat.status]} ${
        isSelected ? styles.selected : ''
      } ${isDragging ? styles.dragging : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      title={`${seat.row}${seat.number} - ${seat.price.toLocaleString()}원 - ${seat.status}`}
    >
      <button
        type='button'
        className={styles.deleteButton}
        onClick={handleDelete}
        title='좌석 삭제'
      >
        ×
      </button>
      <div className={styles.seatInfo}>
        <span className={styles.seatLabel}>
          {seat.row}
          {seat.number}
        </span>
        <span className={styles.seatPrice}>
          {seat.price >= 10000
            ? `${Math.floor(seat.price / 10000)}만원`
            : `${seat.price.toLocaleString()}원`}
        </span>
      </div>
      {isSelected && <div className={styles.selectedIndicator}>✓</div>}
    </div>
  );
}
