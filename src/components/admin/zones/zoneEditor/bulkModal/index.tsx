import React, { useState, useCallback } from 'react';

import Button from '../../../common/ui/Button';
import { Icons } from '../../../common/ui/Icons';
import styles from './bulkModal.module.css';

interface SimpleBulkConfig {
  rows: string[];
  seatsPerRow: number;
  basePrice: number;
  startRow: number;
  startCol: number;
}

interface BulkCreatorModalProps {
  availableRows: string[];
  gridRows: number;
  gridCols: number;
  onClose: () => void;
  onBulkCreate: (config: SimpleBulkConfig) => void;
}

export default function BulkModal({
  availableRows,
  gridRows,
  gridCols,
  onClose,
  onBulkCreate,
}: BulkCreatorModalProps) {
  const [config, setConfig] = useState<SimpleBulkConfig>({
    rows: availableRows.slice(0, 3),
    seatsPerRow: 10,
    basePrice: 50000,
    startRow: 0,
    startCol: 0,
  });

  const [estimatedSeats, setEstimatedSeats] = useState(
    config.rows.length * config.seatsPerRow,
  );

  // 예상 좌석 수 계산
  const calculateEstimatedSeats = useCallback((currentConfig: SimpleBulkConfig) => {
    const total = currentConfig.rows.length * currentConfig.seatsPerRow;
    setEstimatedSeats(total);
  }, []);

  // 설정 업데이트
  const updateConfig = useCallback(
    (updates: Partial<SimpleBulkConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      calculateEstimatedSeats(newConfig);
    },
    [config, calculateEstimatedSeats],
  );

  const handleCreate = () => {
    onBulkCreate(config);
  };

  // 그리드에 맞는 최대 좌석 수 계산
  const maxSeatsPerRow = Math.max(1, gridCols - config.startCol);
  const maxRows = Math.max(1, gridRows - config.startRow);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>좌석 대량 생성</h2>
          <button type='button' className={styles.closeButton} onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.simpleForm}>
            {/* 행 선택 */}
            <div className={styles.settingSection}>
              <label className={styles.settingLabel}>생성할 행 선택</label>
              <div className={styles.rowSelection}>
                {availableRows.map((row) => (
                  <label key={row} className={styles.checkboxLabel}>
                    <input
                      type='checkbox'
                      checked={config.rows.includes(row)}
                      onChange={(e) => {
                        const newRows = e.target.checked
                          ? [...config.rows, row]
                          : config.rows.filter((r) => r !== row);
                        updateConfig({ rows: newRows });
                      }}
                    />
                    <span className={styles.checkboxText}>{row}행</span>
                  </label>
                ))}
              </div>
              <div className={styles.quickRowActions}>
                <button
                  type="button"
                  className={styles.quickButton}
                  onClick={() => updateConfig({ rows: availableRows })}
                >
                  전체 선택
                </button>
                <button
                  type="button"
                  className={styles.quickButton}
                  onClick={() => updateConfig({ rows: [] })}
                >
                  전체 해제
                </button>
              </div>
            </div>

            {/* 행당 좌석 수 */}
            <div className={styles.settingSection}>
              <label className={styles.settingLabel}>
                행당 좌석 수: {config.seatsPerRow}개 (최대: {maxSeatsPerRow}개)
              </label>
              <input
                type='range'
                min='1'
                max={maxSeatsPerRow}
                value={Math.min(config.seatsPerRow, maxSeatsPerRow)}
                onChange={(e) => updateConfig({ seatsPerRow: Number(e.target.value) })}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>1</span>
                <span>{Math.floor(maxSeatsPerRow / 2)}</span>
                <span>{maxSeatsPerRow}</span>
              </div>
            </div>

            {/* 시작 위치 */}
            <div className={styles.settingSection}>
              <label className={styles.settingLabel}>시작 위치</label>
              <div className={styles.positionControls}>
                <div className={styles.positionItem}>
                  <label>시작 행: {config.startRow}</label>
                  <input
                    type='range'
                    min='0'
                    max={Math.max(0, gridRows - 1)}
                    value={config.startRow}
                    onChange={(e) => updateConfig({ startRow: Number(e.target.value) })}
                    className={styles.rangeInput}
                  />
                </div>
                <div className={styles.positionItem}>
                  <label>시작 열: {config.startCol}</label>
                  <input
                    type='range'
                    min='0'
                    max={Math.max(0, gridCols - 1)}
                    value={config.startCol}
                    onChange={(e) => updateConfig({ startCol: Number(e.target.value) })}
                    className={styles.rangeInput}
                  />
                </div>
              </div>
            </div>

            {/* 기본 가격 */}
            <div className={styles.settingSection}>
              <label className={styles.settingLabel}>기본 가격</label>
              <input
                type='number'
                value={config.basePrice}
                onChange={(e) => updateConfig({ basePrice: Number(e.target.value) })}
                className={styles.priceInput}
                min='0'
                step='1000'
                placeholder='가격을 입력하세요'
              />
              <div className={styles.pricePresets}>
                {[30000, 50000, 70000, 100000].map((price) => (
                  <button
                    key={price}
                    type="button"
                    className={styles.pricePreset}
                    onClick={() => updateConfig({ basePrice: price })}
                  >
                    {price.toLocaleString()}원
                  </button>
                ))}
              </div>
            </div>

            {/* 생성 요약 */}
            <div className={styles.summary}>
              <h4 className={styles.summaryTitle}>생성 요약</h4>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>선택된 행:</span>
                  <span className={styles.summaryValue}>
                    {config.rows.length > 0 ? config.rows.join(', ') : '선택된 행 없음'}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>행당 좌석:</span>
                  <span className={styles.summaryValue}>{config.seatsPerRow}개</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>총 좌석 수:</span>
                  <span className={styles.summaryValue}>{estimatedSeats}석</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>시작 위치:</span>
                  <span className={styles.summaryValue}>
                    행 {config.startRow}, 열 {config.startCol}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>좌석 가격:</span>
                  <span className={styles.summaryValue}>
                    {config.basePrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 배치 미리보기 */}
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>배치 미리보기</h4>
              <div className={styles.gridPreview}>
                <div 
                  className={styles.previewGrid}
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(gridCols, 10)}, 1fr)`,
                    gridTemplateRows: `repeat(${Math.min(gridRows, 8)}, 1fr)`,
                  }}
                >
                  {Array.from({ length: Math.min(gridRows, 8) * Math.min(gridCols, 10) }, (_, index) => {
                    const row = Math.floor(index / Math.min(gridCols, 10));
                    const col = index % Math.min(gridCols, 10);
                    
                    // 좌석이 배치될 위치인지 확인
                    const isInRange = row >= config.startRow && 
                                     row < config.startRow + config.rows.length && 
                                     col >= config.startCol && 
                                     col < config.startCol + config.seatsPerRow;
                    
                    return (
                      <div 
                        key={index} 
                        className={`${styles.previewCell} ${isInRange ? styles.willHaveSeat : ''}`}
                      />
                    );
                  })}
                </div>
                <p className={styles.previewNote}>
                  📍 녹색: 좌석이 생성될 위치 | 회색: 빈 공간
                  {gridCols > 10 || gridRows > 8 ? ' (일부만 표시됨)' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <span className={styles.gridInfo}>
              그리드 크기: {gridRows} × {gridCols}
            </span>
          </div>

          <div className={styles.footerRight}>
            <Button variant='neutral' onClick={onClose}>
              취소
            </Button>

            <Button
              variant='success'
              icon={<Icons.Plus />}
              onClick={handleCreate}
              disabled={config.rows.length === 0}
            >
              생성하기 ({estimatedSeats}석)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}