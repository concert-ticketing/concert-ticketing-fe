import React, { useState } from 'react';

import Button from '../../../common/ui/Button';
import { Icons } from '../../../common/ui/Icons';
import styles from './rowManager.module.css';

interface Seat {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'disabled';
  price: number;
}

interface RowManagerProps {
  availableRows: string[];
  selectedRow: string;
  seats: Seat[];
  onRowsChange: (rows: string[]) => void;
  onSelectedRowChange: (row: string) => void;
  onSeatsChange: (seats: Seat[]) => void;
}

export default function RowManager({
  availableRows,
  selectedRow,
  seats,
  onRowsChange,
  onSelectedRowChange,
  onSeatsChange,
}: RowManagerProps) {
  const [newRowName, setNewRowName] = useState('');
  const [isAddingRow, setIsAddingRow] = useState(false);

  // 행별 좌석 통계 계산
  const getRowStats = (rowName: string) => {
    const rowSeats = seats.filter((seat) => seat.row === rowName);
    return {
      total: rowSeats.length,
      available: rowSeats.filter((seat) => seat.status === 'available').length,
      occupied: rowSeats.filter((seat) => seat.status === 'occupied').length,
      disabled: rowSeats.filter((seat) => seat.status === 'disabled').length,
    };
  };

  // 새 행 추가
  const handleAddRow = () => {
    const trimmedName = newRowName.trim().toUpperCase();

    if (!trimmedName) {
      alert('행 이름을 입력해주세요.');
      return;
    }

    if (trimmedName.length > 3) {
      alert('행 이름은 3글자 이하로 입력해주세요.');
      return;
    }

    if (availableRows.includes(trimmedName)) {
      alert('이미 존재하는 행 이름입니다.');
      return;
    }

    // 알파벳/숫자 검증
    if (!/^[A-Z0-9]+$/.test(trimmedName)) {
      alert('행 이름은 영문 대문자와 숫자만 사용 가능합니다.');
      return;
    }

    const newRows = [...availableRows, trimmedName].sort();
    onRowsChange(newRows);
    onSelectedRowChange(trimmedName);
    setNewRowName('');
    setIsAddingRow(false);
  };

  // 행 삭제
  const handleRemoveRow = (rowName: string) => {
    const rowSeats = seats.filter((seat) => seat.row === rowName);

    if (rowSeats.length > 0) {
      const confirmMessage = `${rowName}행에 ${rowSeats.length}개의 좌석이 있습니다.\n행과 좌석을 모두 삭제하시겠습니까?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }

      // 해당 행의 좌석들 삭제
      const remainingSeats = seats.filter((seat) => seat.row !== rowName);
      onSeatsChange(remainingSeats);
    }

    // 행 삭제
    const newRows = availableRows.filter((row) => row !== rowName);
    onRowsChange(newRows);

    // 선택된 행이 삭제된 경우 다른 행 선택
    if (selectedRow === rowName && newRows.length > 0) {
      onSelectedRowChange(newRows[0]);
    }
  };

  // 빠른 행 생성 (A-Z)
  const handleQuickAddRows = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newRows = alphabet
      .filter((letter) => !availableRows.includes(letter))
      .slice(0, 5);

    if (newRows.length === 0) {
      alert('더 이상 추가할 수 있는 알파벳 행이 없습니다.');
      return;
    }

    const updatedRows = [...availableRows, ...newRows].sort();
    onRowsChange(updatedRows);

    if (newRows.length > 0) {
      onSelectedRowChange(newRows[0]);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRow();
    } else if (e.key === 'Escape') {
      setNewRowName('');
      setIsAddingRow(false);
    }
  };

  return (
    <div className={styles.rowManager}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h4 className={styles.title}>
            <Icons.Layers size={18} />행 관리
          </h4>
          <span className={styles.subtitle}>
            총 {availableRows.length}개 행 · 선택된 행: <strong>{selectedRow}</strong>
          </span>
        </div>
        <div className={styles.headerRight}>
          <Button
            size='small'
            variant='secondary'
            icon={<Icons.Zap />}
            onClick={handleQuickAddRows}
          >
            빠른 추가
          </Button>
          <Button
            size='small'
            variant='primary'
            icon={<Icons.Plus />}
            onClick={() => setIsAddingRow(true)}
          >
            행 추가
          </Button>
        </div>
      </div>

      {/* 행 추가 입력 */}
      {isAddingRow && (
        <div className={styles.addRowSection}>
          <div className={styles.addRowInput}>
            <input
              type='text'
              value={newRowName}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) => setNewRowName(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder='행 이름 (예: A, B1, VIP)'
              className={styles.rowInput}
              maxLength={3}
            />
            <Button
              size='small'
              variant='success'
              icon={<Icons.Check />}
              onClick={handleAddRow}
              disabled={!newRowName.trim()}
            >
              추가
            </Button>
            <Button
              size='small'
              variant='neutral'
              icon={<Icons.X />}
              onClick={() => {
                setNewRowName('');
                setIsAddingRow(false);
              }}
            >
              취소
            </Button>
          </div>
          <div className={styles.addRowHint}>
            <Icons.Info size={14} />
            영문 대문자와 숫자만 사용 가능 (최대 3글자)
          </div>
        </div>
      )}

      {/* 행 목록 */}
      <div className={styles.rowList}>
        {availableRows.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎪</div>
            <p className={styles.emptyText}>아직 생성된 행이 없습니다.</p>
            <p className={styles.emptySubtext}>
              위의 행 추가 버튼을 클릭하여 시작하세요.
            </p>
          </div>
        ) : (
          <div className={styles.rowGrid}>
            {availableRows.map((row) => {
              const stats = getRowStats(row);
              const isSelected = selectedRow === row;
              const hasSeats = stats.total > 0;

              return (
                <div
                  key={row}
                  className={`${styles.rowCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSelectedRowChange(row)}
                >
                  {/* 행 헤더 */}
                  <div className={styles.rowHeader}>
                    <div className={styles.rowName}>
                      <Icons.Target size={16} />
                      {row}행
                    </div>
                    <div className={styles.rowActions}>
                      {isSelected && (
                        <span className={styles.selectedBadge}>
                          <Icons.CheckCircle size={12} />
                          선택됨
                        </span>
                      )}
                      <button
                        type='button'
                        className={styles.removeButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveRow(row);
                        }}
                        title={`${row}행 삭제`}
                      >
                        <Icons.X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 좌석 통계 */}
                  <div className={styles.rowStats}>
                    <div className={styles.statItem}>
                      <Icons.Grid size={14} />
                      <span className={styles.statLabel}>총 좌석</span>
                      <span className={styles.statValue}>{stats.total}</span>
                    </div>
                    {hasSeats && (
                      <>
                        <div className={styles.statItem}>
                          <span className={`${styles.statDot} ${styles.available}`} />
                          <span>{stats.available}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={`${styles.statDot} ${styles.occupied}`} />
                          <span>{stats.occupied}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={`${styles.statDot} ${styles.disabled}`} />
                          <span>{stats.disabled}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 상태 표시 */}
                  <div className={styles.rowStatus}>
                    {!hasSeats ? (
                      <span className={styles.statusEmpty}>
                        <Icons.AlertCircle size={12} />
                        좌석 없음
                      </span>
                    ) : (
                      <span className={styles.statusActive}>
                        <Icons.CheckCircle size={12} />
                        활성 · {stats.available}석 예약 가능
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 도움말 */}
      <div className={styles.helpSection}>
        <h5 className={styles.helpTitle}>
          <Icons.Info size={16} />
          사용 팁
        </h5>
        <ul className={styles.helpList}>
          <li>행을 클릭하면 해당 행이 선택되어 새 좌석이 그 행에 생성됩니다</li>
          <li>행 삭제 시 해당 행의 모든 좌석도 함께 삭제됩니다</li>
          <li>빠른 추가로 A-Z 중 5개 행을 한번에 추가할 수 있습니다</li>
          <li>행 이름은 영문 대문자와 숫자만 사용 가능합니다 (예: A, B1, VIP)</li>
        </ul>
      </div>
    </div>
  );
}
