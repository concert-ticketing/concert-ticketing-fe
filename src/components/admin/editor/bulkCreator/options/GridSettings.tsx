import React from 'react';

import { GridConfig, ObjectConfig } from '@/types/bulk';

import styles from '../bulk.module.css';
import Tooltip from '@/components/admin/common/ui/Tooltip';

interface GridSettingsProps {
  gridConfig: GridConfig;
  setGridConfig: (config: GridConfig | ((prev: GridConfig) => GridConfig)) => void;
  objectConfig: ObjectConfig;
  autoSpacing: boolean;
  setAutoSpacing: (autoSpacing: boolean) => void;
}

export default function GridSettings({
  gridConfig,
  setGridConfig,
  objectConfig,
  autoSpacing,
  setAutoSpacing,
}: GridSettingsProps) {
  // 수동 간격 조정 함수들
  const calculateAutoSpacing = () => {
    let objectWidth = 60;
    let objectHeight = 60;

    if (objectConfig.type === 'rect') {
      objectWidth = objectConfig.width || 60;
      objectHeight = objectConfig.height || 60;
    } else if (objectConfig.type === 'circle') {
      const diameter = (objectConfig.radius || 40) * 2;
      objectWidth = diameter;
      objectHeight = diameter;
    } else if (objectConfig.type === 'text') {
      const fontSize = objectConfig.fontSize || 16;
      const textLength = objectConfig.text ? objectConfig.text.length : 4;
      objectWidth = textLength * fontSize * 0.6;
      objectHeight = fontSize * 1.2;
    }

    // 여백 추가 (객체 크기의 50% 추가)
    const spacingX = Math.ceil(objectWidth * 1.5);
    const spacingY = Math.ceil(objectHeight * 1.5);

    setGridConfig((prev) => ({
      ...prev,
      spacingX,
      spacingY,
    }));
  };

  const calculateSmartSpacing = () => {
    let objectWidth = 60;
    let objectHeight = 60;

    if (objectConfig.type === 'rect') {
      objectWidth = objectConfig.width || 60;
      objectHeight = objectConfig.height || 60;

      if (objectConfig.includeText) {
        const textContent = objectConfig.textContent || '텍스트';
        const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
        const textHeight = objectConfig.textFontSize * 1.2;
        objectWidth = Math.max(objectWidth, textWidth);
        objectHeight = Math.max(objectHeight, textHeight);
      }
    } else if (objectConfig.type === 'circle') {
      const radius = objectConfig.radius || 40;
      const diameter = radius * 2;
      objectWidth = diameter;
      objectHeight = diameter;

      if (objectConfig.includeText) {
        const textContent = objectConfig.textContent || '텍스트';
        const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
        const minDiameter = Math.max(diameter, textWidth * 1.4);
        objectWidth = minDiameter;
        objectHeight = minDiameter;
      }
    } else if (objectConfig.type === 'text') {
      const fontSize = objectConfig.fontSize || 16;
      const textLength = objectConfig.text ? objectConfig.text.length : 4;
      objectWidth = textLength * fontSize * 0.6;
      objectHeight = fontSize * 1.2;
    }

    // 적응형 여백
    const marginRatio = Math.max(
      0.3,
      Math.min(0.8, 50 / Math.max(objectWidth, objectHeight)),
    );
    const spacingX = Math.ceil(objectWidth * (1 + marginRatio));
    const spacingY = Math.ceil(objectHeight * (1 + marginRatio));

    setGridConfig((prev) => ({
      ...prev,
      spacingX,
      spacingY,
    }));
  };

  return (
    <div className={styles.section}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
          그리드 설정
        </h3>

        <label
          className={styles.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: autoSpacing ? '#3b82f6' : '#666666',
            transition: 'color 0.2s ease',
            margin: 0,
          }}
        >
          <input
            type='checkbox'
            checked={autoSpacing}
            onChange={(e) => setAutoSpacing(e.target.checked)}
            style={{
              accentColor: '#3b82f6',
              transform: 'scale(1.1)',
            }}
          />
          <span>자동 간격 조정</span>
        </label>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>행 수</label>
          <input
            type='number'
            value={gridConfig.rows}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setGridConfig((prev) => ({
                ...prev,
                rows: Number(e.target.value),
              }))
            }
            className={styles.input}
            min='1'
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>열 수</label>
          <input
            type='number'
            value={gridConfig.cols}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setGridConfig((prev) => ({
                ...prev,
                cols: Number(e.target.value),
              }))
            }
            className={styles.input}
            min='1'
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>가로 간격</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='number'
              value={gridConfig.spacingX}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setGridConfig((prev) => ({
                  ...prev,
                  spacingX: Number(e.target.value),
                }))
              }
              className={styles.input}
              style={{ flex: 1 }}
              disabled={autoSpacing}
            />
            {autoSpacing && (
              <span style={{ fontSize: '12px', color: '#3b82f6' }}>🎯 자동</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>세로 간격</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='number'
              value={gridConfig.spacingY}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setGridConfig((prev) => ({
                  ...prev,
                  spacingY: Number(e.target.value),
                }))
              }
              className={styles.input}
              style={{ flex: 1 }}
              disabled={autoSpacing}
            />
            {autoSpacing && (
              <span style={{ fontSize: '12px', color: '#3b82f6' }}>🎯 자동</span>
            )}
          </div>
        </div>
      </div>

      {/* 수동 조정 버튼들 (자동 모드가 꺼졌을 때만 표시) */}
      {!autoSpacing && (
        <div className={styles.row} style={{ marginTop: '10px' }}>
          <Tooltip
            text='객체 크기 + 텍스트 크기를 고려한 최적 간격 계산.\n큰 객체일수록 상대적으로 작은 여백을 적용합니다.'
            delay={1000}
            position='top'
            maxWidth={250}
          >
            <button
              type='button'
              onClick={calculateSmartSpacing}
              className={styles.autoButton}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🎯 스마트 조정
            </button>
          </Tooltip>

          <Tooltip
            text='객체 크기의 1.5배로 간격을 설정하는 간단한 계산.\n빠르고 안전한 겹침 방지 방법입니다.'
            delay={1000}
            position='top'
            maxWidth={250}
          >
            <button
              type='button'
              onClick={calculateAutoSpacing}
              className={styles.autoButton}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ⚡ 간단 조정
            </button>
          </Tooltip>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>시작 좌표 X</label>
          <input
            type='number'
            value={gridConfig.startX}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setGridConfig((prev) => ({
                ...prev,
                startX: Number(e.target.value),
              }))
            }
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>시작 좌표 Y</label>
          <input
            type='number'
            value={gridConfig.startY}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setGridConfig((prev) => ({
                ...prev,
                startY: Number(e.target.value),
              }))
            }
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.info}>
        총 {gridConfig.rows * gridConfig.cols}개 객체가 생성됩니다.
        {autoSpacing && (
          <>
            <br />
            <small style={{ color: '#3b82f6', fontSize: '11px' }}>
              🎯 간격이 객체 크기에 맞춰 자동 조정됩니다
            </small>
          </>
        )}
        {!autoSpacing && (
          <>
            <br />
            <small style={{ color: '#666', fontSize: '11px' }}>
              💡 수동 조정 버튼에 마우스를 올려 자세한 설명을 확인하세요
            </small>
          </>
        )}
      </div>
    </div>
  );
}
