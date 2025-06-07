import React from 'react';

import { PatternConfig } from '@/types/Bulk';

import styles from '../bulk.module.css';

interface PatternSettingsProps {
  patternConfig: PatternConfig;
  setPatternConfig: React.Dispatch<React.SetStateAction<PatternConfig>>;
  autoSpacing: boolean;
  setAutoSpacing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PatternSettings({
  patternConfig,
  setPatternConfig,
  autoSpacing,
  setAutoSpacing,
}: PatternSettingsProps) {
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
          패턴 설정
        </h3>

        <label
          className={styles.label}
          style={{
            display: 'flex',
            alignItems: 'center',
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
              marginRight: '8px',
              accentColor: '#3b82f6',
              transform: 'scale(1.1)',
            }}
          />
          <span>자동 간격 조정</span>
        </label>
      </div>

      {/* 패턴별 추가 설정 */}
      {patternConfig.pattern === 'circle' && (
        <div className={styles.field}>
          <label className={styles.label}>반지름</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='number'
              value={patternConfig.radius}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setPatternConfig((prev) => ({
                  ...prev,
                  radius: Number(e.target.value),
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
      )}

      {patternConfig.pattern === 'line' && (
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>각도 (도)</label>
            <input
              type='number'
              value={patternConfig.angle}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setPatternConfig((prev) => ({
                  ...prev,
                  angle: Number(e.target.value),
                }))
              }
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>간격</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type='number'
                value={patternConfig.spacing}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) =>
                  setPatternConfig((prev) => ({
                    ...prev,
                    spacing: Number(e.target.value),
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
      )}

      {/* 자동 조정 정보 */}
      {autoSpacing && (
        <div
          className={styles.info}
          style={{ fontSize: '12px', color: '#3b82f6', marginTop: '10px' }}
        >
          🎯 {patternConfig.pattern === 'circle' ? '반지름이' : '간격이'} 객체 크기에 맞춰
          자동 조정됩니다
        </div>
      )}
    </div>
  );
}
