import React, { useState, useCallback, useMemo, useRef } from 'react';

import styles from './zoneEditor.module.css';
import Button from '../../common/ui/Button';
import { Icons } from '../../common/ui/Icons';
import SeatGrid from './seatGrid';
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

interface SimpleBulkConfig {
  rows: string[];
  seatsPerRow: number;
  basePrice: number;
  startRow: number;
  startCol: number;
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

  // 가이드 툴팁 상태
  const [isGuideTooltipVisible, setIsGuideTooltipVisible] = useState(false);

  // 가격 선택 상태
  const [selectedPriceOption, setSelectedPriceOption] = useState('50000');
  const [customPrice, setCustomPrice] = useState('');

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

  // 가격 옵션 변경 핸들러
  const handlePriceOptionChange = useCallback(
    (option: string) => {
      setSelectedPriceOption(option);

      if (option !== 'custom') {
        const price = parseInt(option);
        handleChangeSelectedPrice(price);
      }
    },
    [handleChangeSelectedPrice],
  );

  // 커스텀 가격 변경 핸들러
  const handleCustomPriceChange = useCallback(
    (value: string) => {
      setCustomPrice(value);
      const price = parseInt(value);
      if (!isNaN(price) && price >= 0) {
        handleChangeSelectedPrice(price);
      }
    },
    [handleChangeSelectedPrice],
  );

  // 모든 좌석 가격 저장 (현재 선택된 좌석의 가격을 모든 좌석에 적용)
  const handleSaveAllPrices = useCallback(() => {
    if (selectedSeats.length === 0) {
      alert('가격을 적용할 좌석을 먼저 선택해주세요.');
      return;
    }

    const selectedSeat = seats.find((seat) => selectedSeats.includes(seat.id));
    if (!selectedSeat) return;

    const confirmSave = window.confirm(
      `모든 좌석의 가격을 ${selectedSeat.price.toLocaleString()}원으로 변경하시겠습니까?`,
    );

    if (confirmSave) {
      setSeats((prev) => prev.map((seat) => ({ ...seat, price: selectedSeat.price })));
      alert('모든 좌석의 가격이 변경되었습니다.');
    }
  }, [selectedSeats, seats]);

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

  // 간단한 순차적 대량 좌석 생성 함수
  const handleSimpleBulkCreate = useCallback(
    (config: SimpleBulkConfig) => {
      const newSeats: Seat[] = [];
      const { rows, seatsPerRow, basePrice, startRow, startCol } = config;

      // 간단한 순차적 배치: 시작 위치부터 행별로 차례대로 배치
      rows.forEach((rowName, rowIndex) => {
        const currentRowY = startRow + rowIndex;

        // 그리드 범위를 벗어나면 건너뛰기
        if (currentRowY >= gridRows) return;

        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
          const currentColX = startCol + (seatNum - 1);

          // 그리드 범위를 벗어나면 건너뛰기
          if (currentColX >= gridCols) break;

          newSeats.push({
            id: `bulk-simple-${rowName}-${seatNum}-${Date.now()}`,
            row: rowName,
            number: seatNum,
            x: currentColX,
            y: currentRowY,
            status: 'available',
            price: basePrice,
          });
        }
      });

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
    <div className={styles.compactContainer}>
      {/* 투명 드래그 이미지 */}
      <div ref={dragImageRef} className={styles.dragImage} />

      {/* 컴팩트 헤더 */}
      <div className={styles.compactHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.compactTitle}>좌석 에디터</h2>
          {zoneId && <span className={styles.zoneId}>Zone: {zoneId}</span>}
        </div>

        <div className={styles.compactHeaderControls}>
          <button
            className={`${styles.guideTooltipBtn} ${isGuideTooltipVisible ? styles.active : ''}`}
            onClick={() => setIsGuideTooltipVisible(!isGuideTooltipVisible)}
            title='사용 가이드'
          >
            ❓ 가이드
          </button>

          <Button
            variant='success'
            icon={<Icons.Save />}
            onClick={() => onSeatUpdate?.(seats)}
            size='small'
          >
            저장
          </Button>
        </div>
      </div>

      {/* 가이드 툴팁 */}
      {isGuideTooltipVisible && (
        <div className={styles.guideTooltip}>
          <div className={styles.tooltipHeader}>
            <h3>사용 가이드</h3>
            <button onClick={() => setIsGuideTooltipVisible(false)}>×</button>
          </div>
          <div className={styles.tooltipContent}>
            <div className={styles.guideItem}>
              <strong>좌석 추가:</strong> 빈 셀 클릭
            </div>
            <div className={styles.guideItem}>
              <strong>좌석 이동:</strong> 드래그 & 드롭
            </div>
            <div className={styles.guideItem}>
              <strong>좌석 선택:</strong> 좌석 클릭
            </div>
            <div className={styles.guideItem}>
              <strong>좌석 삭제:</strong> 호버 시 X 버튼
            </div>
            <div className={styles.guideItem}>
              <strong>그리드 확장:</strong> 그리드 가장자리 + 버튼
            </div>
            <div className={styles.guideItem}>
              <strong>대량 작업:</strong> 왼쪽 패널 사용
            </div>
          </div>
        </div>
      )}

      {/* 컴팩트 행 관리 및 그리드 컨트롤 */}
      <div className={styles.compactRowManager}>
        <div className={styles.controlsRow}>
          {/* 행 관리 */}
          <div className={styles.rowSection}>
            <span className={styles.sectionLabel}>행:</span>
            <select
              value={selectedRow}
              onChange={(e) => setSelectedRow(e.target.value)}
              className={styles.rowSelect}
            >
              {availableRows.map((row) => (
                <option key={row} value={row}>
                  {row}
                </option>
              ))}
            </select>
            <input
              type='text'
              placeholder='새 행'
              className={styles.newRowInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const newRow = input.value.trim().toUpperCase();
                  if (newRow && !availableRows.includes(newRow)) {
                    setAvailableRows([...availableRows, newRow]);
                    setSelectedRow(newRow);
                    input.value = '';
                  }
                }
              }}
            />
          </div>

          {/* 그리드 정보 */}
          <div className={styles.gridInfoSection}>
            <span className={styles.gridSize}>
              그리드: {gridRows} × {gridCols}
            </span>
            <span className={styles.seatCount}>좌석: {seats.length}개</span>
          </div>

          {/* 그리드 크기 조절 */}
          <div className={styles.gridControls}>
            <div className={styles.gridControlGroup}>
              <span className={styles.controlLabel}>가로:</span>
              <button
                className={styles.gridButton}
                onClick={shrinkGridRight}
                disabled={gridCols <= 5}
                title='가로 축소'
              >
                -
              </button>
              <span className={styles.gridValue}>{gridCols}</span>
              <button
                className={styles.gridButton}
                onClick={expandGridRight}
                disabled={gridCols >= 50}
                title='가로 확장'
              >
                +
              </button>
            </div>
            <div className={styles.gridControlGroup}>
              <span className={styles.controlLabel}>세로:</span>
              <button
                className={styles.gridButton}
                onClick={shrinkGridBottom}
                disabled={gridRows <= 5}
                title='세로 축소'
              >
                -
              </button>
              <span className={styles.gridValue}>{gridRows}</span>
              <button
                className={styles.gridButton}
                onClick={expandGridBottom}
                disabled={gridRows >= 30}
                title='세로 확장'
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 에디터 영역 */}
      <div className={styles.compactEditorArea}>
        {/* 좌측 고정 컨트롤 패널 */}
        <div className={styles.fixedControlPanel}>
          {/* 통계 */}
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>통계</h3>
            <div className={styles.compactStats}>
              <div className={styles.statChip}>
                <span className={styles.statLabel}>전체</span>
                <span className={styles.statValue}>{seatStats.total}</span>
              </div>
              <div className={styles.statChip}>
                <span className={styles.statLabel}>선택</span>
                <span className={styles.statValue}>{seatStats.selected}</span>
              </div>
              <div className={styles.statChip}>
                <span className={styles.statLabel}>가능</span>
                <span className={styles.statValue}>{seatStats.available}</span>
              </div>
              <div className={styles.statChip}>
                <span className={styles.statLabel}>예약</span>
                <span className={styles.statValue}>{seatStats.occupied}</span>
              </div>
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className={styles.actionsSection}>
            <h3 className={styles.sectionTitle}>빠른 액션</h3>
            {selectedSeats.length > 0 ? (
              <div className={styles.quickActions}>
                <div className={styles.quickActionButtons}>
                  <button
                    className={`${styles.statusBtn} ${styles.available}`}
                    onClick={() => handleChangeSelectedStatus('available')}
                    title='사용 가능으로 만들기'
                  >
                    ✓
                  </button>
                  <button
                    className={`${styles.statusBtn} ${styles.occupied}`}
                    onClick={() => handleChangeSelectedStatus('occupied')}
                    title='예약됨으로 만들기'
                  >
                    ✕
                  </button>
                  <button
                    className={`${styles.statusBtn} ${styles.disabled}`}
                    onClick={() => handleChangeSelectedStatus('disabled')}
                    title='사용 불가로 만들기'
                  >
                    ⛔
                  </button>
                </div>
                <div className={styles.priceInputGroup}>
                  <select
                    className={styles.priceSelect}
                    value={selectedPriceOption}
                    onChange={(e) => handlePriceOptionChange(e.target.value)}
                  >
                    <option value='30000'>30,000원</option>
                    <option value='50000'>50,000원</option>
                    <option value='70000'>70,000원</option>
                    <option value='100000'>100,000원</option>
                    <option value='150000'>150,000원</option>
                    <option value='custom'>직접 입력</option>
                  </select>
                  {selectedPriceOption === 'custom' && (
                    <input
                      type='number'
                      className={styles.customPriceInput}
                      placeholder='가격 입력'
                      value={customPrice}
                      min='0'
                      step='1000'
                      onChange={(e) => handleCustomPriceChange(e.target.value)}
                    />
                  )}
                  <button
                    className={`${styles.priceActionBtn} ${styles.saveAllBtn}`}
                    onClick={handleSaveAllPrices}
                    title='선택된 좌석 가격을 모든 좌석에 적용'
                    disabled={selectedSeats.length === 0}
                  >
                    💾
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.noSelection}>좌석을 선택하세요</p>
            )}
          </div>

          {/* 대량 작업 */}
          <div className={styles.bulkSection}>
            <h3 className={styles.sectionTitle}>대량 작업</h3>
            <div className={styles.bulkActions}>
              <button
                className={styles.bulkButton}
                onClick={() => setIsBulkModalOpen(true)}
              >
                🏢 대량 생성
              </button>
              <button className={styles.bulkButton} onClick={handleSelectAll}>
                ✓ 전체 선택
              </button>
              <button className={styles.bulkButton} onClick={handleDeselectAll}>
                ✕ 선택 해제
              </button>
              <button
                className={styles.bulkButton}
                onClick={handleDeleteSelected}
                disabled={selectedSeats.length === 0}
              >
                🗑️ 선택 삭제
              </button>
            </div>
          </div>
        </div>

        {/* 좌석 그리드 */}
        <div className={styles.compactSeatGridWrapper}>
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
            getSeatAtPosition={getSeatAtPosition}
          />
        </div>
      </div>

      {/* 컴팩트 범례 */}
      <div className={styles.compactLegend}>
        <div className={styles.legendChip}>
          <div className={`${styles.legendDot} ${styles.available}`} />
          <span>가능</span>
        </div>
        <div className={styles.legendChip}>
          <div className={`${styles.legendDot} ${styles.occupied}`} />
          <span>예약</span>
        </div>
        <div className={styles.legendChip}>
          <div className={`${styles.legendDot} ${styles.disabled}`} />
          <span>불가</span>
        </div>
        <div className={styles.legendChip}>
          <div className={`${styles.legendDot} ${styles.selected}`} />
          <span>선택</span>
        </div>
      </div>

      {/* 대량 생성 모달 */}
      {isBulkModalOpen && (
        <BulkModal
          availableRows={availableRows}
          gridRows={gridRows}
          gridCols={gridCols}
          onClose={() => setIsBulkModalOpen(false)}
          onBulkCreate={handleSimpleBulkCreate}
        />
      )}
    </div>
  );
}
