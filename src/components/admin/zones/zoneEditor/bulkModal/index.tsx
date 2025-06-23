import React, { useState, useCallback } from 'react';

import Button from '../../../common/ui/Button';
import { Icons } from '../../../common/ui/Icons';
import styles from './bulkModal.module.css';

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
    curve: number;
    angle: number;
    centerGap?: number;
  };
  pricing: {
    basePrice: number;
    priceGradient: 'none' | 'distance' | 'row' | 'zone';
    priceMultiplier: number;
  };
}

interface BulkCreatorModalProps {
  availableRows: string[];
  onClose: () => void;
  onBulkCreate: (config: BulkCreationConfig) => void;
}

const VENUE_TYPES = [
  {
    type: 'traditional' as const,
    name: '전통적 배치',
    description: '일반적인 직선형 좌석 배치',
    icon: '🎭',
    preview: 'grid-rows-3',
  },
  {
    type: 'theater' as const,
    name: '극장형 배치',
    description: '앞열 적게, 뒷열 많게 배치',
    icon: '🎪',
    preview: 'triangle-up',
  },
  {
    type: 'stadium' as const,
    name: '경기장형 배치',
    description: '블록 단위의 곡선형 배치',
    icon: '🏟️',
    preview: 'curve-blocks',
  },
  {
    type: 'arena' as const,
    name: '아레나형 배치',
    description: '원형 또는 타원형 배치',
    icon: '🎯',
    preview: 'circle',
  },
];

export default function BulkModal({
  availableRows,
  onClose,
  onBulkCreate,
}: BulkCreatorModalProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [config, setConfig] = useState<BulkCreationConfig>({
    type: 'traditional',
    rows: availableRows.slice(0, 3),
    baseSeatsPerRow: 12,
    spacing: {
      seatSpacing: 1,
      rowSpacing: 2,
      blockSpacing: 3,
    },
    layout: {
      curve: 0,
      angle: 0,
      centerGap: 0,
    },
    pricing: {
      basePrice: 50000,
      priceGradient: 'none',
      priceMultiplier: 0.1,
    },
  });

  const [estimatedSeats, setEstimatedSeats] = useState(0);

  // 예상 좌석 수 계산
  const calculateEstimatedSeats = useCallback((currentConfig: BulkCreationConfig) => {
    const { type, rows, baseSeatsPerRow } = currentConfig;

    let total = 0;

    switch (type) {
      case 'traditional':
        total = rows.length * baseSeatsPerRow;
        break;
      case 'theater':
        total = rows.reduce((sum, _, index) => {
          return sum + (baseSeatsPerRow + Math.floor(index * 0.5));
        }, 0);
        break;
      case 'stadium':
        total = rows.length * Math.floor(baseSeatsPerRow / 3) * 3; // 3블록
        break;
      case 'arena':
        total = rows.reduce((sum, _, index) => {
          const radius = 100 + index * 20;
          const circumference = 2 * Math.PI * radius;
          const seatsInRow = Math.floor(circumference / 40);
          return sum + seatsInRow;
        }, 0);
        break;
      default:
        total = rows.length * baseSeatsPerRow;
    }

    setEstimatedSeats(total);
  }, []);

  // 설정 업데이트
  const updateConfig = useCallback(
    (updates: Partial<BulkCreationConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      calculateEstimatedSeats(newConfig);
    },
    [config, calculateEstimatedSeats],
  );

  // 중첩 객체 업데이트 헬퍼
  const updateNestedConfig = useCallback(
    <K extends keyof BulkCreationConfig>(
      key: K,
      updates: Partial<BulkCreationConfig[K]>,
    ) => {
      updateConfig({
        [key]: {
          ...(config[key] as object),
          ...updates,
        },
      } as Pick<BulkCreationConfig, K>);
    },
    [config, updateConfig],
  );

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreate = () => {
    onBulkCreate(config);
  };

  const renderStep1 = () => (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>1단계: 배치 유형 선택</h3>
      <div className={styles.venueTypes}>
        {VENUE_TYPES.map((venueType) => (
          <div
            key={venueType.type}
            className={`${styles.venueTypeCard} ${
              config.type === venueType.type ? styles.selected : ''
            }`}
            onClick={() => updateConfig({ type: venueType.type })}
          >
            <div className={styles.venueTypeIcon}>{venueType.icon}</div>
            <h4 className={styles.venueTypeName}>{venueType.name}</h4>
            <p className={styles.venueTypeDesc}>{venueType.description}</p>
            <div className={styles.venueTypePreview}>
              <PreviewDiagram type={venueType.type} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>2단계: 기본 설정</h3>

      <div className={styles.settingGrid}>
        <div className={styles.settingSection}>
          <label className={styles.settingLabel}>생성할 열 선택</label>
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
                <span className={styles.checkboxText}>{row}열</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.settingSection}>
          <label className={styles.settingLabel}>
            기본 좌석 수 (열당): {config.baseSeatsPerRow}개
          </label>
          <input
            type='range'
            min='6'
            max='30'
            value={config.baseSeatsPerRow}
            onChange={(e) => updateConfig({ baseSeatsPerRow: Number(e.target.value) })}
            className={styles.rangeInput}
          />
          <div className={styles.rangeLabels}>
            <span>6</span>
            <span>18</span>
            <span>30</span>
          </div>
        </div>

        <div className={styles.settingSection}>
          <label className={styles.settingLabel}>간격 설정</label>
          <div className={styles.spacingControls}>
            <div className={styles.spacingItem}>
              <label>좌석 간격: {config.spacing.seatSpacing}</label>
              <input
                type='range'
                min='1'
                max='3'
                value={config.spacing.seatSpacing}
                onChange={(e) =>
                  updateNestedConfig('spacing', { seatSpacing: Number(e.target.value) })
                }
                className={styles.rangeInput}
              />
            </div>
            <div className={styles.spacingItem}>
              <label>열 간격: {config.spacing.rowSpacing}</label>
              <input
                type='range'
                min='1'
                max='5'
                value={config.spacing.rowSpacing}
                onChange={(e) =>
                  updateNestedConfig('spacing', { rowSpacing: Number(e.target.value) })
                }
                className={styles.rangeInput}
              />
            </div>
            {config.type === 'stadium' && (
              <div className={styles.spacingItem}>
                <label>블록 간격: {config.spacing.blockSpacing}</label>
                <input
                  type='range'
                  min='2'
                  max='6'
                  value={config.spacing.blockSpacing || 3}
                  onChange={(e) =>
                    updateNestedConfig('spacing', {
                      blockSpacing: Number(e.target.value),
                    })
                  }
                  className={styles.rangeInput}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>3단계: 고급 배치 설정</h3>

      <div className={styles.settingGrid}>
        {(config.type === 'theater' ||
          config.type === 'stadium' ||
          config.type === 'arena') && (
          <div className={styles.settingSection}>
            <label className={styles.settingLabel}>
              곡선 정도: {Math.round(config.layout.curve * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={config.layout.curve}
              onChange={(e) =>
                updateNestedConfig('layout', { curve: Number(e.target.value) })
              }
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}>
              <span>직선</span>
              <span>중간</span>
              <span>강한 곡선</span>
            </div>
          </div>
        )}

        {config.type === 'arena' && (
          <div className={styles.settingSection}>
            <label className={styles.settingLabel}>
              회전 각도: {config.layout.angle}°
            </label>
            <input
              type='range'
              min='0'
              max='360'
              step='15'
              value={config.layout.angle}
              onChange={(e) =>
                updateNestedConfig('layout', { angle: Number(e.target.value) })
              }
              className={styles.rangeInput}
            />
          </div>
        )}

        {(config.type === 'theater' || config.type === 'stadium') && (
          <div className={styles.settingSection}>
            <label className={styles.settingLabel}>
              중앙 통로 간격: {config.layout.centerGap || 0}
            </label>
            <input
              type='range'
              min='0'
              max='5'
              value={config.layout.centerGap || 0}
              onChange={(e) =>
                updateNestedConfig('layout', { centerGap: Number(e.target.value) })
              }
              className={styles.rangeInput}
            />
          </div>
        )}

        <div className={styles.previewSection}>
          <h4 className={styles.previewTitle}>배치 미리보기</h4>
          <div className={styles.layoutPreview}>
            <PreviewDiagram type={config.type} config={config} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>4단계: 가격 설정</h3>

      <div className={styles.settingGrid}>
        <div className={styles.settingSection}>
          <label className={styles.settingLabel}>기본 가격</label>
          <input
            type='number'
            value={config.pricing.basePrice}
            onChange={(e) =>
              updateNestedConfig('pricing', { basePrice: Number(e.target.value) })
            }
            className={styles.priceInput}
            min='0'
            step='1000'
          />
        </div>

        <div className={styles.settingSection}>
          <label className={styles.settingLabel}>가격 차등 방식</label>
          <div className={styles.radioGroup}>
            {[
              { value: 'none', label: '동일 가격', desc: '모든 좌석 동일 가격' },
              { value: 'row', label: '열별 차등', desc: '앞열일수록 비싼 가격' },
              {
                value: 'distance',
                label: '중앙 거리별',
                desc: '중앙에 가까울수록 비싼 가격',
              },
              { value: 'zone', label: '구역별 차등', desc: '구역별로 다른 가격' },
            ].map((option) => (
              <label key={option.value} className={styles.radioLabel}>
                <input
                  type='radio'
                  name='priceGradient'
                  value={option.value}
                  checked={config.pricing.priceGradient === option.value}
                  onChange={(e) =>
                    updateNestedConfig('pricing', {
                      priceGradient: e.target.value as any,
                    })
                  }
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>{option.label}</span>
                  <span className={styles.radioDesc}>{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {config.pricing.priceGradient !== 'none' && (
          <div className={styles.settingSection}>
            <label className={styles.settingLabel}>
              가격 차등 정도: {Math.round(config.pricing.priceMultiplier * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='0.5'
              step='0.05'
              value={config.pricing.priceMultiplier}
              onChange={(e) =>
                updateNestedConfig('pricing', { priceMultiplier: Number(e.target.value) })
              }
              className={styles.rangeInput}
            />
          </div>
        )}
      </div>

      <div className={styles.summary}>
        <h4 className={styles.summaryTitle}>생성 요약</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>배치 유형:</span>
            <span className={styles.summaryValue}>
              {VENUE_TYPES.find((v) => v.type === config.type)?.name}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>생성 열:</span>
            <span className={styles.summaryValue}>{config.rows.join(', ')}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>예상 좌석 수:</span>
            <span className={styles.summaryValue}>{estimatedSeats}석</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>가격 범위:</span>
            <span className={styles.summaryValue}>
              {config.pricing.priceGradient === 'none'
                ? `${config.pricing.basePrice.toLocaleString()}원`
                : `${Math.round(config.pricing.basePrice * (1 - config.pricing.priceMultiplier)).toLocaleString()}원 ~ ${Math.round(config.pricing.basePrice * (1 + config.pricing.priceMultiplier)).toLocaleString()}원`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>스마트 좌석 대량 생성</h2>
          <button type='button' className={styles.closeButton} onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        {/* 단계 표시 */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`${styles.stepItem} ${
                activeStep === step ? styles.active : ''
              } ${activeStep > step ? styles.completed : ''}`}
            >
              <div className={styles.stepNumber}>
                {activeStep > step ? <Icons.CheckCircle /> : step}
              </div>
              <span className={styles.stepLabel}>
                {step === 1 && '유형 선택'}
                {step === 2 && '기본 설정'}
                {step === 3 && '고급 설정'}
                {step === 4 && '가격 설정'}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.modalBody}>
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
          {activeStep === 3 && renderStep3()}
          {activeStep === 4 && renderStep4()}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            {activeStep > 1 && (
              <Button
                variant='secondary'
                icon={<Icons.ArrowLeft />}
                iconPosition='left'
                onClick={handlePrev}
              >
                이전
              </Button>
            )}
          </div>

          <div className={styles.footerRight}>
            <Button variant='neutral' onClick={onClose}>
              취소
            </Button>

            {activeStep < 4 ? (
              <Button
                variant='primary'
                icon={<Icons.ArrowRight />}
                iconPosition='right'
                onClick={handleNext}
                disabled={config.rows.length === 0}
              >
                다음
              </Button>
            ) : (
              <Button
                variant='success'
                icon={<Icons.Plus />}
                onClick={handleCreate}
                disabled={config.rows.length === 0}
              >
                생성하기 ({estimatedSeats}석)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 미리보기 다이어그램 컴포넌트
interface PreviewDiagramProps {
  type: BulkCreationConfig['type'];
  config?: BulkCreationConfig;
}

function PreviewDiagram({ type, config }: PreviewDiagramProps) {
  const renderPreview = () => {
    switch (type) {
      case 'traditional':
        return (
          <svg viewBox='0 0 200 120' className={styles.previewSvg}>
            {/* 전통적 배치 - 직선형 그리드 */}
            {Array.from({ length: 4 }, (_, row) => (
              <g key={row}>
                {Array.from({ length: 8 }, (__, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={20 + col * 20}
                    y={20 + row * 20}
                    width={15}
                    height={15}
                    fill='#10b981'
                    rx={2}
                  />
                ))}
              </g>
            ))}
          </svg>
        );

      case 'theater':
        return (
          <svg viewBox='0 0 200 120' className={styles.previewSvg}>
            {/* 극장형 배치 - 삼각형 확장 */}
            {Array.from({ length: 4 }, (_, row) => {
              const seatsInRow = 4 + row * 2;
              const startX = 100 - (seatsInRow * 10) / 2;
              return (
                <g key={row}>
                  {Array.from({ length: seatsInRow }, (__, col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={startX + col * 15}
                      y={20 + row * 20}
                      width={12}
                      height={12}
                      fill='#10b981'
                      rx={2}
                    />
                  ))}
                </g>
              );
            })}
            {/* 무대 표시 */}
            <rect x={50} y={5} width={100} height={8} fill='#f59e0b' rx={4} />
            <text x={100} y={12} textAnchor='middle' fill='#666' fontSize={8}>
              무대
            </text>
          </svg>
        );

      case 'stadium':
        return (
          <svg viewBox='0 0 200 120' className={styles.previewSvg}>
            {/* 경기장형 배치 - 곡선 블록 */}
            {Array.from({ length: 3 }, (_, row) => (
              <g key={row}>
                {/* 좌측 블록 */}
                {Array.from({ length: 3 }, (__, col) => (
                  <rect
                    key={`left-${row}-${col}`}
                    x={20 + col * 15}
                    y={25 + row * 18 + Math.sin(col * 0.5) * 5}
                    width={12}
                    height={12}
                    fill='#10b981'
                    rx={2}
                  />
                ))}
                {/* 중앙 블록 */}
                {Array.from({ length: 4 }, (__, col) => (
                  <rect
                    key={`center-${row}-${col}`}
                    x={80 + col * 15}
                    y={25 + row * 18 + Math.sin(col * 0.3) * 3}
                    width={12}
                    height={12}
                    fill='#10b981'
                    rx={2}
                  />
                ))}
                {/* 우측 블록 */}
                {Array.from({ length: 3 }, (__, col) => (
                  <rect
                    key={`right-${row}-${col}`}
                    x={150 + col * 15}
                    y={25 + row * 18 + Math.sin((2 - col) * 0.5) * 5}
                    width={12}
                    height={12}
                    fill='#10b981'
                    rx={2}
                  />
                ))}
              </g>
            ))}
            {/* 경기장 표시 */}
            <ellipse cx={100} cy={15} rx={40} ry={8} fill='#22c55e' opacity={0.3} />
            <text x={100} y={18} textAnchor='middle' fill='#666' fontSize={8}>
              경기장
            </text>
          </svg>
        );

      case 'arena':
        return (
          <svg viewBox='0 0 200 120' className={styles.previewSvg}>
            {/* 아레나형 배치 - 원형 */}
            {Array.from({ length: 3 }, (_, ring) => {
              const radius = 25 + ring * 15;
              const seats = 8 + ring * 4;
              return Array.from({ length: seats }, (__, seat) => {
                const angle = (seat / seats) * 2 * Math.PI;
                const x = 100 + Math.cos(angle) * radius;
                const y = 60 + Math.sin(angle) * radius * 0.7;
                return (
                  <rect
                    key={`${ring}-${seat}`}
                    x={x - 6}
                    y={y - 6}
                    width={12}
                    height={12}
                    fill='#10b981'
                    rx={2}
                  />
                );
              });
            })}
            {/* 중앙 무대 */}
            <circle cx={100} cy={60} r={20} fill='#f59e0b' opacity={0.3} />
            <text x={100} y={63} textAnchor='middle' fill='#666' fontSize={8}>
              무대
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return <div className={styles.previewContainer}>{renderPreview()}</div>;
}
