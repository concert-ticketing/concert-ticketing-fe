import React, { useState } from 'react';

import Button from '../../../common/ui/Button';
import { Icons } from '../../../common/ui/Icons';
import styles from './controlPanel.module.css';

interface SeatStats {
  total: number;
  available: number;
  occupied: number;
  disabled: number;
  selected: number;
}

interface ControlPanelProps {
  seatStats: SeatStats;
  selectedSeats: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onChangeSelectedStatus: (status: 'available' | 'occupied' | 'disabled') => void;
  onChangeSelectedPrice: (price: number) => void;
  onOpenBulkModal: () => void;
}

export default function ControlPanel({
  seatStats,
  selectedSeats,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onChangeSelectedStatus,
  onChangeSelectedPrice,
  onOpenBulkModal,
}: ControlPanelProps) {
  const [priceInput, setPriceInput] = useState('');

  const handlePriceSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const price = Number(priceInput);
      if (price > 0) {
        onChangeSelectedPrice(price);
        setPriceInput('');
      }
    }
  };

  const quickPrices = [30000, 50000, 80000, 120000, 150000];

  return (
    <div className={styles.controlPanel}>
      {/* 통계 섹션 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <Icons.BarChart3 />
          좌석 통계
        </h4>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Icons.Grid3x3 />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>총 좌석</span>
              <span className={styles.statValue}>{seatStats.total}</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={`${styles.statIcon} ${styles.selected}`}>
              <Icons.MousePointer />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>선택됨</span>
              <span className={styles.statValue}>{seatStats.selected}</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={`${styles.statIcon} ${styles.available}`}>
              <Icons.Check />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>사용 가능</span>
              <span className={styles.statValue}>{seatStats.available}</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={`${styles.statIcon} ${styles.occupied}`}>
              <Icons.Clock />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>예약됨</span>
              <span className={styles.statValue}>{seatStats.occupied}</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={`${styles.statIcon} ${styles.disabled}`}>
              <Icons.X />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>사용 불가</span>
              <span className={styles.statValue}>{seatStats.disabled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 대량 작업 섹션 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <Icons.Zap />
          대량 작업
        </h4>
        <div className={styles.bulkActions}>
          <Button
            size='small'
            variant='primary'
            icon={<Icons.Plus />}
            onClick={onOpenBulkModal}
            fullWidth
          >
            스마트 좌석 생성
          </Button>

          <div className={styles.selectionActions}>
            <Button
              size='small'
              variant='secondary'
              icon={<Icons.CheckSquare />}
              onClick={onSelectAll}
              disabled={seatStats.total === 0}
            >
              전체 선택
            </Button>
            <Button
              size='small'
              variant='secondary'
              icon={<Icons.Square />}
              onClick={onDeselectAll}
              disabled={selectedSeats.length === 0}
            >
              선택 해제
            </Button>
          </div>

          <Button
            size='small'
            variant='danger'
            icon={<Icons.Trash2 />}
            onClick={onDeleteSelected}
            disabled={selectedSeats.length === 0}
            fullWidth
          >
            선택 삭제 ({selectedSeats.length})
          </Button>
        </div>
      </div>

      {/* 선택된 좌석 설정 섹션 */}
      {selectedSeats.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <Icons.Settings />
            선택된 좌석 설정 ({selectedSeats.length}개)
          </h4>

          <div className={styles.statusControls}>
            <h5 className={styles.subTitle}>상태 변경</h5>
            <div className={styles.statusButtons}>
              <button
                type='button'
                className={`${styles.statusButton} ${styles.available}`}
                onClick={() => onChangeSelectedStatus('available')}
                title='사용 가능으로 변경'
              >
                <Icons.Check />
                <span>사용 가능</span>
              </button>
              <button
                type='button'
                className={`${styles.statusButton} ${styles.occupied}`}
                onClick={() => onChangeSelectedStatus('occupied')}
                title='예약됨으로 변경'
              >
                <Icons.Clock />
                <span>예약됨</span>
              </button>
              <button
                type='button'
                className={`${styles.statusButton} ${styles.disabled}`}
                onClick={() => onChangeSelectedStatus('disabled')}
                title='사용 불가로 변경'
              >
                <Icons.X />
                <span>사용 불가</span>
              </button>
            </div>
          </div>

          <div className={styles.priceControls}>
            <h5 className={styles.subTitle}>가격 설정</h5>

            {/* 직접 입력 */}
            <div className={styles.priceInputGroup}>
              <input
                type='number'
                placeholder='가격 입력'
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onKeyDown={handlePriceSubmit}
                className={styles.priceInput}
                min='0'
                step='1000'
              />
              <Button
                size='small'
                variant='success'
                icon={<Icons.Check />}
                onClick={() => {
                  const price = Number(priceInput);
                  if (price > 0) {
                    onChangeSelectedPrice(price);
                    setPriceInput('');
                  }
                }}
                disabled={!priceInput || Number(priceInput) <= 0}
              >
                적용
              </Button>
            </div>

            {/* 빠른 가격 선택 */}
            <div className={styles.quickPrices}>
              <span className={styles.quickPricesLabel}>빠른 선택:</span>
              <div className={styles.quickPriceButtons}>
                {quickPrices.map((price) => (
                  <button
                    key={price}
                    type='button'
                    className={styles.quickPriceButton}
                    onClick={() => onChangeSelectedPrice(price)}
                  >
                    {price.toLocaleString()}원
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 도움말 섹션 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <Icons.HelpCircle />
          사용 가이드
        </h4>
        <div className={styles.helpContent}>
          <div className={styles.helpItem}>
            <Icons.MousePointer className={styles.helpIcon} />
            <span className={styles.helpText}>빈 셀을 클릭하여 좌석 추가</span>
          </div>
          <div className={styles.helpItem}>
            <Icons.Move className={styles.helpIcon} />
            <span className={styles.helpText}>좌석을 드래그하여 이동</span>
          </div>
          <div className={styles.helpItem}>
            <Icons.Square className={styles.helpIcon} />
            <span className={styles.helpText}>좌석 클릭으로 선택/해제</span>
          </div>
          <div className={styles.helpItem}>
            <Icons.RotateCcw className={styles.helpIcon} />
            <span className={styles.helpText}>Ctrl+Z로 실행 취소</span>
          </div>
        </div>
      </div>

      {/* 단축키 섹션 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <Icons.Keyboard />
          단축키
        </h4>
        <div className={styles.shortcutsList}>
          <div className={styles.shortcutItem}>
            <kbd className={styles.kbd}>Ctrl + A</kbd>
            <span>전체 선택</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.kbd}>Delete</kbd>
            <span>선택 삭제</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.kbd}>Ctrl + S</kbd>
            <span>저장</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.kbd}>Esc</kbd>
            <span>선택 해제</span>
          </div>
        </div>
      </div>
    </div>
  );
}
