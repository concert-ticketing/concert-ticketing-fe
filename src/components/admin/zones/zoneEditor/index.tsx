import React, { useState, useCallback, useMemo, useRef } from 'react';

import styles from './zoneEditor.module.css';
import Button from '../../common/ui/Button';
import { Icons } from '../../common/ui/Icons';

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

interface BulkCreateModal {
  isOpen: boolean;
  rows: string[];
  seatsPerRow: number;
  startPrice: number;
}

export default function ZoneEditor({
  zoneId,
  initialSeats = [],
  onSeatUpdate,
}: ZoneEditorProps) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [gridRows, setGridRows] = useState(5);
  const [gridCols, setGridCols] = useState(10);
  const [availableRows, setAvailableRows] = useState<string[]>([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
  ]);
  const [selectedRow, setSelectedRow] = useState<string>('A'); // 선택된 열
  const [newRowName, setNewRowName] = useState('');
  const [draggedSeat, setDraggedSeat] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(
    null,
  );

  const [bulkModal, setBulkModal] = useState<BulkCreateModal>({
    isOpen: false,
    rows: [],
    seatsPerRow: 10,
    startPrice: 50000,
  });

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
      // 해당 위치에 이미 좌석이 있는지 확인
      const existingSeat = seats.find((seat) => seat.x === col && seat.y === row);
      if (existingSeat) return;

      // 선택된 열의 기존 좌석 번호 중 가장 큰 번호 찾기
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

  // 새 열 추가
  const handleAddRow = useCallback(() => {
    if (!newRowName.trim()) return;
    if (availableRows.includes(newRowName.trim())) {
      alert('이미 존재하는 열 이름입니다.');
      return;
    }

    const newRow = newRowName.trim();
    setAvailableRows((prev) => [...prev, newRow]);
    setSelectedRow(newRow); // 새로 추가된 열을 선택
    setNewRowName('');
  }, [newRowName, availableRows]);

  // 열 삭제
  const handleRemoveRow = useCallback(
    (rowName: string) => {
      // 해당 열에 좌석이 있는지 확인
      const hasSeats = seats.some((seat) => seat.row === rowName);
      if (hasSeats) {
        const confirmDelete = window.confirm(
          `${rowName}열에 좌석이 있습니다. 열과 좌석을 모두 삭제하시겠습니까?`,
        );
        if (!confirmDelete) return;

        // 해당 열의 좌석들도 삭제
        setSeats((prev) => prev.filter((seat) => seat.row !== rowName));
      }

      setAvailableRows((prev) => prev.filter((row) => row !== rowName));
    },
    [seats],
  );

  // 대량 생성 모달 열기
  const handleOpenBulkModal = useCallback(() => {
    setBulkModal((prev) => ({
      ...prev,
      isOpen: true,
      rows: availableRows.slice(0, 3), // 기본적으로 처음 3개 열 선택
    }));
  }, [availableRows]);

  // 대량 생성 실행
  const handleBulkCreate = useCallback(() => {
    const bulkSeats: Seat[] = [];

    // 그리드 방식으로 배치 (각 열별로 연속된 영역에 배치)
    bulkModal.rows.forEach((rowName, rowIndex) => {
      let seatsCreated = 0;

      // 각 열마다 연속된 영역에 좌석 배치
      for (
        let row = rowIndex * 2;
        row < gridRows && seatsCreated < bulkModal.seatsPerRow;
        row++
      ) {
        for (let col = 0; col < gridCols && seatsCreated < bulkModal.seatsPerRow; col++) {
          const existingSeat =
            seats.find((seat) => seat.x === col && seat.y === row) ||
            bulkSeats.find((seat) => seat.x === col && seat.y === row);

          if (!existingSeat) {
            bulkSeats.push({
              id: `bulk-seat-${rowName}-${seatsCreated + 1}`,
              row: rowName,
              number: seatsCreated + 1,
              x: col,
              y: row,
              status: 'available',
              price: bulkModal.startPrice,
            });
            seatsCreated++;
          }
        }
      }
    });

    setSeats((prev) => [...prev, ...bulkSeats]);
    setBulkModal((prev) => ({ ...prev, isOpen: false }));
  }, [bulkModal, seats, gridRows, gridCols]);

  // 드래그 앤 드롭 처리
  const handleDragStart = useCallback((e: React.DragEvent, seatId: string) => {
    setDraggedSeat(seatId);

    // 투명한 드래그 이미지 설정
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

      // 해당 위치에 다른 좌석이 있는지 확인
      const existingSeat = seats.find((seat) => seat.x === col && seat.y === row);
      if (existingSeat && existingSeat.id !== draggedSeat) return;

      // 좌석 위치 업데이트
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

  // 그리드 생성
  const gridCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }, [gridRows, gridCols]);

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

      {/* 툴바 */}
      <div className={styles.toolbar}>
        <div className={styles.toolSection}>
          <span className={styles.toolLabel}>그리드 크기:</span>
          <input
            type='number'
            value={gridRows}
            onChange={(e) => setGridRows(Number(e.target.value))}
            className={styles.gridInput}
            min='5'
            max='30'
            placeholder='행'
          />
          <span>×</span>
          <input
            type='number'
            value={gridCols}
            onChange={(e) => setGridCols(Number(e.target.value))}
            className={styles.gridInput}
            min='5'
            max='50'
            placeholder='열'
          />
        </div>

        <div className={styles.toolSection}>
          <span className={styles.toolLabel}>열 관리:</span>
          <input
            type='text'
            value={newRowName}
            onChange={(e) => setNewRowName(e.target.value)}
            placeholder='새 열 이름'
            className={styles.rowInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddRow();
              }
            }}
          />
          <Button type='button' size='small' onClick={handleAddRow}>
            열 추가
          </Button>
        </div>

        <div className={styles.toolSection}>
          <Button
            type='button'
            size='small'
            variant='secondary'
            onClick={handleOpenBulkModal}
          >
            대량 생성
          </Button>
        </div>
      </div>

      {/* 열 목록 */}
      <div className={styles.rowList}>
        <span className={styles.rowListLabel}>
          사용 가능한 열 (선택된 열: {selectedRow}):
        </span>
        <div className={styles.rowTags}>
          {availableRows.map((row) => (
            <div
              key={row}
              className={`${styles.rowTag} ${selectedRow === row ? styles.selectedRowTag : ''}`}
              onClick={() => setSelectedRow(row)}
            >
              <span>{row}열</span>
              <button
                type='button'
                className={styles.removeRowButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveRow(row);
                }}
                title={`${row}열 삭제`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 에디터 영역 */}
      <div className={styles.editorArea}>
        {/* 좌측 컨트롤 패널 */}
        <div className={styles.controlPanel}>
          <div className={styles.controlSection}>
            <h4 className={styles.controlTitle}>선택 작업</h4>
            <div className={styles.controlButtons}>
              <button
                type='button'
                className={styles.controlButton}
                onClick={handleSelectAll}
              >
                전체 선택 ({seats.length})
              </button>
              <button
                type='button'
                className={styles.controlButton}
                onClick={handleDeselectAll}
              >
                선택 해제
              </button>
              <button
                type='button'
                className={styles.controlButton}
                onClick={handleDeleteSelected}
                disabled={selectedSeats.length === 0}
              >
                선택 삭제 ({selectedSeats.length})
              </button>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className={styles.controlSection}>
              <h4 className={styles.controlTitle}>선택 좌석 설정</h4>
              <div className={styles.statusButtons}>
                <button
                  type='button'
                  className={`${styles.statusButton} ${styles.available}`}
                  onClick={() => handleChangeSelectedStatus('available')}
                >
                  사용 가능
                </button>
                <button
                  type='button'
                  className={`${styles.statusButton} ${styles.occupied}`}
                  onClick={() => handleChangeSelectedStatus('occupied')}
                >
                  예약됨
                </button>
                <button
                  type='button'
                  className={`${styles.statusButton} ${styles.disabled}`}
                  onClick={() => handleChangeSelectedStatus('disabled')}
                >
                  사용 불가
                </button>
              </div>

              <div className={styles.priceControl}>
                <input
                  type='number'
                  placeholder='가격 설정'
                  className={styles.priceInput}
                  min='0'
                  step='1000'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleChangeSelectedPrice(Number(e.currentTarget.value));
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <span className={styles.priceHint}>Enter로 적용</span>
              </div>
            </div>
          )}

          <div className={styles.controlSection}>
            <h4 className={styles.controlTitle}>통계</h4>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>총 좌석</span>
                <span className={styles.statValue}>{seatStats.total}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>선택됨</span>
                <span className={styles.statValue}>{seatStats.selected}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>사용 가능</span>
                <span className={styles.statValue}>{seatStats.available}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>예약됨</span>
                <span className={styles.statValue}>{seatStats.occupied}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>사용 불가</span>
                <span className={styles.statValue}>{seatStats.disabled}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 좌석 그리드 */}
        <div className={styles.seatGrid}>
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
                      handleGridCellClick(row, col);
                    }
                  }}
                  onDragOver={(e) => handleDragOver(e, row, col)}
                  onDrop={(e) => handleDrop(e, row, col)}
                  onDragLeave={() => setHoveredCell(null)}
                >
                  {seat && (
                    <div
                      className={`${styles.seat} ${styles[seat.status]} ${
                        isSelected ? styles.selected : ''
                      } ${draggedSeat === seat.id ? styles.dragging : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, seat.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeatClick(seat.id);
                      }}
                    >
                      <button
                        type='button'
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeatDelete(seat.id);
                        }}
                        title='좌석 삭제'
                      >
                        ×
                      </button>
                      <span className={styles.seatLabel}>
                        {seat.row}
                        {seat.number}
                      </span>
                      <span className={styles.seatPrice}>
                        {seat.price.toLocaleString()}원
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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

      {/* 대량 생성 모달 */}
      {bulkModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>대량 좌석 생성</h3>
              <button
                type='button'
                className={styles.modalCloseButton}
                onClick={() => setBulkModal((prev) => ({ ...prev, isOpen: false }))}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <label className={styles.modalLabel}>생성할 열 선택:</label>
                <div className={styles.rowSelection}>
                  {availableRows.map((row) => (
                    <label key={row} className={styles.checkboxLabel}>
                      <input
                        type='checkbox'
                        checked={bulkModal.rows.includes(row)}
                        onChange={(e) => {
                          setBulkModal((prev) => ({
                            ...prev,
                            rows: e.target.checked
                              ? [...prev.rows, row]
                              : prev.rows.filter((r) => r !== row),
                          }));
                        }}
                      />
                      <span>{row}열</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <label className={styles.modalLabel}>
                  열당 좌석 수: {bulkModal.seatsPerRow}개
                </label>
                <input
                  type='range'
                  min='5'
                  max='30'
                  value={bulkModal.seatsPerRow}
                  onChange={(e) =>
                    setBulkModal((prev) => ({
                      ...prev,
                      seatsPerRow: Number(e.target.value),
                    }))
                  }
                  className={styles.rangeInput}
                />
              </div>

              <div className={styles.modalSection}>
                <label className={styles.modalLabel}>기본 가격:</label>
                <input
                  type='number'
                  value={bulkModal.startPrice}
                  onChange={(e) =>
                    setBulkModal((prev) => ({
                      ...prev,
                      startPrice: Number(e.target.value),
                    }))
                  }
                  className={styles.priceInput}
                  min='0'
                  step='1000'
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type='button'
                className={styles.modalCancelButton}
                onClick={() => setBulkModal((prev) => ({ ...prev, isOpen: false }))}
              >
                취소
              </button>
              <button
                type='button'
                className={styles.modalCreateButton}
                onClick={handleBulkCreate}
                disabled={bulkModal.rows.length === 0}
              >
                생성 ({bulkModal.rows.length}열 × {bulkModal.seatsPerRow}석)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
