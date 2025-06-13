import React from 'react';

import { ObjectConfig, ObjectType } from '@/types/bulk';

import styles from '../bulk.module.css';

interface ObjectSettingsProps {
  objectConfig: ObjectConfig;
  setObjectConfig: React.Dispatch<React.SetStateAction<ObjectConfig>>;
}

export default function ObjectSettings({
  objectConfig,
  setObjectConfig,
}: ObjectSettingsProps) {
  const handleObjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setObjectConfig((prev) => ({
      ...prev,
      type: e.target.value as ObjectType,
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
          객체 설정
        </h3>

        {/* 도형일 때만 텍스트 포함 체크박스 표시 */}
        {(objectConfig.type === 'rect' || objectConfig.type === 'circle') && (
          <label
            className={styles.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: objectConfig.includeText ? '#3b82f6' : '#666666',
              transition: 'color 0.2s ease',
              margin: 0,
            }}
          >
            <input
              type='checkbox'
              checked={objectConfig.includeText}
              onChange={(e) =>
                setObjectConfig((prev) => ({
                  ...prev,
                  includeText: e.target.checked,
                }))
              }
              style={{
                marginRight: '8px',
                accentColor: '#3b82f6',
                transform: 'scale(1.1)',
              }}
            />
            <span>도형 안에 텍스트 포함</span>
          </label>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>타입</label>
          <select
            value={objectConfig.type}
            onChange={handleObjectTypeChange}
            className={styles.select}
          >
            <option value='rect'>사각형</option>
            <option value='circle'>원</option>
            <option value='text'>텍스트</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>채우기</label>
          <input
            type='color'
            value={objectConfig.fill}
            onChange={(e) =>
              setObjectConfig((prev) => ({ ...prev, fill: e.target.value }))
            }
            className={styles.colorInput}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>테두리 색</label>
          <input
            type='color'
            value={objectConfig.stroke}
            onChange={(e) =>
              setObjectConfig((prev) => ({
                ...prev,
                stroke: e.target.value,
              }))
            }
            className={styles.colorInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>테두리 두께</label>
          <input
            type='number'
            value={objectConfig.strokeWidth}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setObjectConfig((prev) => ({
                ...prev,
                strokeWidth: Number(e.target.value),
              }))
            }
            className={styles.input}
            min='0'
            max='20'
          />
        </div>
      </div>

      {/* 객체별 설정 */}
      {objectConfig.type === 'rect' && (
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>너비</label>
              <input
                type='number'
                value={objectConfig.width}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) =>
                  setObjectConfig((prev) => ({
                    ...prev,
                    width: Number(e.target.value),
                  }))
                }
                className={styles.input}
                min='10'
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>높이</label>
              <input
                type='number'
                value={objectConfig.height}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) =>
                  setObjectConfig((prev) => ({
                    ...prev,
                    height: Number(e.target.value),
                  }))
                }
                className={styles.input}
                min='10'
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>모서리 둥글기</label>
            <input
              type='number'
              value={objectConfig.borderRadius}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setObjectConfig((prev) => ({
                  ...prev,
                  borderRadius: Number(e.target.value),
                }))
              }
              className={styles.input}
              min='0'
              max='50'
            />
          </div>
        </>
      )}

      {objectConfig.type === 'circle' && (
        <div className={styles.field}>
          <label className={styles.label}>반지름</label>
          <input
            type='number'
            value={objectConfig.radius}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) =>
              setObjectConfig((prev) => ({
                ...prev,
                radius: Number(e.target.value),
              }))
            }
            className={styles.input}
            min='5'
          />
        </div>
      )}

      {/* 텍스트 설정 (체크박스가 활성화된 경우만) */}
      {(objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
        objectConfig.includeText && (
          <div className={styles.section}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>텍스트 내용</label>
                <input
                  type='text'
                  value={objectConfig.textContent}
                  onChange={(e) =>
                    setObjectConfig((prev) => ({
                      ...prev,
                      textContent: e.target.value,
                    }))
                  }
                  className={styles.input}
                  placeholder='텍스트를 입력하세요'
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>텍스트 색상</label>
                <input
                  type='color'
                  value={objectConfig.textColor}
                  onChange={(e) =>
                    setObjectConfig((prev) => ({
                      ...prev,
                      textColor: e.target.value,
                    }))
                  }
                  className={styles.colorInput}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>텍스트 크기</label>
              <input
                type='number'
                value={objectConfig.textFontSize}
                onChange={(e) =>
                  setObjectConfig((prev) => ({
                    ...prev,
                    textFontSize: Number(e.target.value),
                  }))
                }
                className={styles.input}
                min='8'
                max='72'
              />
            </div>
          </div>
        )}

      {objectConfig.type === 'text' && (
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>텍스트 내용</label>
            <input
              type='text'
              value={objectConfig.text}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setObjectConfig((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              className={styles.input}
              placeholder='텍스트를 입력하세요'
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>폰트 크기</label>
            <input
              type='number'
              value={objectConfig.fontSize}
              onClick={(e) => e.currentTarget.select()}
              onChange={(e) =>
                setObjectConfig((prev) => ({
                  ...prev,
                  fontSize: Number(e.target.value),
                }))
              }
              className={styles.input}
              min='8'
              max='72'
            />
          </div>
        </div>
      )}
    </div>
  );
}
