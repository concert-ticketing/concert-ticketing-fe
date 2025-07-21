import React, { useMemo } from 'react';

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
    </div>
  );
}
