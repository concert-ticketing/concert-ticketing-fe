import React, { useState, useCallback } from "react";
import * as fabric from "fabric";
import styles from "./bulkObject.module.css";

interface BulkObjectCreatorProps {
  canvas: fabric.Canvas;
}

type ObjectType = "rect" | "circle" | "text";
type PatternType = "grid" | "circle" | "line" | "random";
type TabType = "grid" | "pattern";

interface ObjectConfig {
  type: ObjectType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  width?: number;
  height?: number;
  radius?: number;
  borderRadius?: number;
  text?: string;
  fontSize?: number;
  // 도형 내 텍스트 관련 설정
  includeText: boolean;
  textContent: string;
  textColor: string;
  textFontSize: number;
}

interface GridConfig {
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
  startX: number;
  startY: number;
}

interface PatternConfig {
  pattern: PatternType;
  count: number;
  centerX: number;
  centerY: number;
  radius?: number;
  angle?: number;
  spacing?: number;
  areaWidth?: number;
  areaHeight?: number;
}

export default function BulkObjectCreator({ canvas }: BulkObjectCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("grid");

  // 객체 설정
  const [objectConfig, setObjectConfig] = useState<ObjectConfig>({
    type: "rect",
    fill: "#3b82f6",
    stroke: "#1e40af",
    strokeWidth: 2,
    width: 60,
    height: 60,
    radius: 40,
    borderRadius: 0,
    text: "Text",
    fontSize: 16,
    // 도형 내 텍스트 설정
    includeText: false,
    textContent: "텍스트",
    textColor: "#ffffff",
    textFontSize: 14,
  });

  // 그리드 설정
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 3,
    cols: 3,
    spacingX: 120,
    spacingY: 100,
    startX: 100,
    startY: 100,
  });

  // 패턴 설정
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({
    pattern: "circle",
    count: 8,
    centerX: 300,
    centerY: 300,
    radius: 150,
    angle: 0,
    spacing: 80,
    areaWidth: 400,
    areaHeight: 300,
  });

  // 객체 생성 함수
  const createObject = useCallback(
    (x: number, y: number, index: number): fabric.FabricObject => {
      const id = `bulk_${objectConfig.type}_${Date.now()}_${index}`;

      if (objectConfig.type === "text") {
        // 텍스트 객체는 기존과 동일
        const textObj = new fabric.IText(`${objectConfig.text} ${index + 1}`, {
          left: x,
          top: y,
          fontSize: objectConfig.fontSize,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
        });

        // ID 설정을 위한 타입 단언
        (textObj as fabric.FabricObject & { id?: string }).id = id;

        return textObj as fabric.FabricObject;
      }

      // 도형 객체 생성
      let shape: fabric.FabricObject;

      if (objectConfig.type === "rect") {
        shape = new fabric.Rect({
          left: 0,
          top: 0,
          width: objectConfig.width,
          height: objectConfig.height,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
          rx: objectConfig.borderRadius,
          ry: objectConfig.borderRadius,
        });
      } else {
        shape = new fabric.Circle({
          left: 0,
          top: 0,
          radius: objectConfig.radius,
          fill: objectConfig.fill,
          stroke: objectConfig.stroke,
          strokeWidth: objectConfig.strokeWidth,
        });
      }

      // 텍스트를 포함하지 않는 경우 도형만 반환
      if (!objectConfig.includeText) {
        shape.set({
          left: x,
          top: y,
        });

        // ID 설정을 위한 타입 단언
        (shape as fabric.FabricObject & { id?: string }).id = id;

        return shape;
      }

      // 도형 내부에 텍스트 추가 - 중앙 정렬 수정
      const textObj = new fabric.IText(
        `${objectConfig.textContent} ${index + 1}`,
        {
          left: 0,
          top: 0,
          fontSize: objectConfig.textFontSize,
          fill: objectConfig.textColor,
          textAlign: "center",
          originX: "center",
          originY: "center",
          editable: true,
        }
      );

      // 도형의 중심에 텍스트 배치
      if (objectConfig.type === "rect") {
        const rectWidth = objectConfig.width || 60;
        const rectHeight = objectConfig.height || 60;
        textObj.set({
          left: rectWidth / 2,
          top: rectHeight / 2,
        });
      } else if (objectConfig.type === "circle") {
        const circleRadius = objectConfig.radius || 40;
        textObj.set({
          left: circleRadius,
          top: circleRadius,
        });
      }

      // 도형과 텍스트를 그룹으로 묶기
      const group = new fabric.Group([shape, textObj as fabric.FabricObject], {
        left: x,
        top: y,
      });

      // ID 설정을 위한 타입 단언
      (group as fabric.FabricObject & { id?: string }).id = id;

      // 그룹을 더블클릭하면 텍스트 편집 모드로 전환
      group.on("mousedblclick", function () {
        // 그룹을 해제하고 텍스트만 선택하여 편집 모드로 전환
        canvas.remove(group);

        // 그룹 해제를 위한 수동 처리
        const objects = group.getObjects();
        const groupLeft = group.left || 0;
        const groupTop = group.top || 0;

        objects.forEach((obj: fabric.FabricObject) => {
          const objLeft = obj.left || 0;
          const objTop = obj.top || 0;

          obj.set({
            left: objLeft + groupLeft,
            top: objTop + groupTop,
          });

          canvas.add(obj);

          // 텍스트 객체인 경우 편집 모드로 전환
          if (obj instanceof fabric.IText) {
            canvas.setActiveObject(obj as any);
            obj.enterEditing();
          }
        });

        canvas.renderAll();
      });

      return group;
    },
    [objectConfig, canvas]
  );

  // 그리드 패턴으로 생성
  const createGridObjects = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    let index = 0;

    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        const x = gridConfig.startX + col * gridConfig.spacingX;
        const y = gridConfig.startY + row * gridConfig.spacingY;

        objects.push(createObject(x, y, index));
        index++;
      }
    }

    return objects;
  }, [gridConfig, createObject]);

  // 원형 패턴으로 생성
  const createCirclePattern = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    const angleStep = (2 * Math.PI) / patternConfig.count;

    for (let i = 0; i < patternConfig.count; i++) {
      const angle = i * angleStep;
      const x =
        patternConfig.centerX + Math.cos(angle) * (patternConfig.radius || 100);
      const y =
        patternConfig.centerY + Math.sin(angle) * (patternConfig.radius || 100);

      objects.push(createObject(x, y, i));
    }

    return objects;
  }, [patternConfig, createObject]);

  // 직선 패턴으로 생성
  const createLinePattern = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    const angle = ((patternConfig.angle || 0) * Math.PI) / 180;
    const spacing = patternConfig.spacing || 60;

    for (let i = 0; i < patternConfig.count; i++) {
      const distance = i * spacing;
      const x = patternConfig.centerX + Math.cos(angle) * distance;
      const y = patternConfig.centerY + Math.sin(angle) * distance;

      objects.push(createObject(x, y, i));
    }

    return objects;
  }, [patternConfig, createObject]);

  // 랜덤 패턴으로 생성
  const createRandomPattern = useCallback(() => {
    const objects: fabric.FabricObject[] = [];
    const width = patternConfig.areaWidth || 400;
    const height = patternConfig.areaHeight || 300;

    for (let i = 0; i < patternConfig.count; i++) {
      const x = patternConfig.centerX + (Math.random() - 0.5) * width;
      const y = patternConfig.centerY + (Math.random() - 0.5) * height;

      objects.push(createObject(x, y, i));
    }

    return objects;
  }, [patternConfig, createObject]);

  // 패턴별 객체 생성
  const createPatternObjects = useCallback(() => {
    switch (patternConfig.pattern) {
      case "circle":
        return createCirclePattern();
      case "line":
        return createLinePattern();
      case "random":
        return createRandomPattern();
      default:
        return [];
    }
  }, [
    patternConfig,
    createCirclePattern,
    createLinePattern,
    createRandomPattern,
  ]);

  // 객체들을 캔버스에 추가
  const addObjectsToCanvas = useCallback(
    (objects: fabric.FabricObject[]) => {
      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.renderAll();
    },
    [canvas]
  );

  // 그리드 생성 실행
  const handleCreateGrid = useCallback(() => {
    const objects = createGridObjects();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createGridObjects, addObjectsToCanvas]);

  // 패턴 생성 실행
  const handleCreatePattern = useCallback(() => {
    const objects = createPatternObjects();
    addObjectsToCanvas(objects);
    setIsOpen(false);
  }, [createPatternObjects, addObjectsToCanvas]);

  const handleObjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setObjectConfig((prev) => ({
      ...prev,
      type: e.target.value as ObjectType,
    }));
  };

  const handlePatternTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPatternConfig((prev) => ({
      ...prev,
      pattern: e.target.value as PatternType,
    }));
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.openButton}>
        대량 객체 생성
      </button>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>대량 객체 생성</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.closeButton}
          >
            ✕
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab("grid")}
            className={`${styles.tab} ${
              activeTab === "grid" ? styles.activeTab : ""
            }`}
          >
            그리드
          </button>
          <button
            onClick={() => setActiveTab("pattern")}
            className={`${styles.tab} ${
              activeTab === "pattern" ? styles.activeTab : ""
            }`}
          >
            패턴
          </button>
        </div>

        {/* 객체 설정 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>객체 설정</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>타입</label>
              <select
                value={objectConfig.type}
                onChange={handleObjectTypeChange}
                className={styles.select}
              >
                <option value="rect">사각형</option>
                <option value="circle">원</option>
                <option value="text">텍스트</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>채우기</label>
              <input
                type="color"
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
                type="color"
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
                type="number"
                value={objectConfig.strokeWidth}
                onChange={(e) =>
                  setObjectConfig((prev) => ({
                    ...prev,
                    strokeWidth: Number(e.target.value),
                  }))
                }
                className={styles.input}
                min="0"
              />
            </div>
          </div>

          {/* 도형 내 텍스트 설정 (사각형, 원일 때만) */}
          {(objectConfig.type === "rect" || objectConfig.type === "circle") && (
            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={objectConfig.includeText}
                    onChange={(e) =>
                      setObjectConfig((prev) => ({
                        ...prev,
                        includeText: e.target.checked,
                      }))
                    }
                    style={{ marginRight: "8px" }}
                  />
                  도형 안에 텍스트 포함
                </label>
              </div>

              {objectConfig.includeText && (
                <>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>텍스트 내용</label>
                      <input
                        type="text"
                        value={objectConfig.textContent}
                        onChange={(e) =>
                          setObjectConfig((prev) => ({
                            ...prev,
                            textContent: e.target.value,
                          }))
                        }
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>텍스트 색상</label>
                      <input
                        type="color"
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
                      type="number"
                      value={objectConfig.textFontSize}
                      onChange={(e) =>
                        setObjectConfig((prev) => ({
                          ...prev,
                          textFontSize: Number(e.target.value),
                        }))
                      }
                      className={styles.input}
                      min="8"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* 객체별 설정 */}
          {objectConfig.type === "rect" && (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>너비</label>
                  <input
                    type="number"
                    value={objectConfig.width}
                    onChange={(e) =>
                      setObjectConfig((prev) => ({
                        ...prev,
                        width: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>높이</label>
                  <input
                    type="number"
                    value={objectConfig.height}
                    onChange={(e) =>
                      setObjectConfig((prev) => ({
                        ...prev,
                        height: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>모서리</label>
                <input
                  type="number"
                  value={objectConfig.borderRadius}
                  onChange={(e) =>
                    setObjectConfig((prev) => ({
                      ...prev,
                      borderRadius: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                  min="0"
                />
              </div>
            </>
          )}

          {objectConfig.type === "circle" && (
            <div className={styles.field}>
              <label className={styles.label}>반지름</label>
              <input
                type="number"
                value={objectConfig.radius}
                onChange={(e) =>
                  setObjectConfig((prev) => ({
                    ...prev,
                    radius: Number(e.target.value),
                  }))
                }
                className={styles.input}
              />
            </div>
          )}

          {objectConfig.type === "text" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>텍스트</label>
                <input
                  type="text"
                  value={objectConfig.text}
                  onChange={(e) =>
                    setObjectConfig((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>폰트 크기</label>
                <input
                  type="number"
                  value={objectConfig.fontSize}
                  onChange={(e) =>
                    setObjectConfig((prev) => ({
                      ...prev,
                      fontSize: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>
            </div>
          )}
        </div>

        {/* 그리드 설정 */}
        {activeTab === "grid" && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>그리드 설정</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>행 수</label>
                <input
                  type="number"
                  value={gridConfig.rows}
                  onChange={(e) =>
                    setGridConfig((prev) => ({
                      ...prev,
                      rows: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                  min="1"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>열 수</label>
                <input
                  type="number"
                  value={gridConfig.cols}
                  onChange={(e) =>
                    setGridConfig((prev) => ({
                      ...prev,
                      cols: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>가로 간격</label>
                <input
                  type="number"
                  value={gridConfig.spacingX}
                  onChange={(e) =>
                    setGridConfig((prev) => ({
                      ...prev,
                      spacingX: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>세로 간격</label>
                <input
                  type="number"
                  value={gridConfig.spacingY}
                  onChange={(e) =>
                    setGridConfig((prev) => ({
                      ...prev,
                      spacingY: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>시작 X</label>
                <input
                  type="number"
                  value={gridConfig.startX}
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
                <label className={styles.label}>시작 Y</label>
                <input
                  type="number"
                  value={gridConfig.startY}
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
            </div>
          </div>
        )}

        {/* 패턴 설정 */}
        {activeTab === "pattern" && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>패턴 설정</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>패턴</label>
                <select
                  value={patternConfig.pattern}
                  onChange={handlePatternTypeChange}
                  className={styles.select}
                >
                  <option value="circle">원형</option>
                  <option value="line">직선</option>
                  <option value="random">랜덤</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>개수</label>
                <input
                  type="number"
                  value={patternConfig.count}
                  onChange={(e) =>
                    setPatternConfig((prev) => ({
                      ...prev,
                      count: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>중심 X</label>
                <input
                  type="number"
                  value={patternConfig.centerX}
                  onChange={(e) =>
                    setPatternConfig((prev) => ({
                      ...prev,
                      centerX: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>중심 Y</label>
                <input
                  type="number"
                  value={patternConfig.centerY}
                  onChange={(e) =>
                    setPatternConfig((prev) => ({
                      ...prev,
                      centerY: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>
            </div>

            {/* 패턴별 추가 설정 */}
            {patternConfig.pattern === "circle" && (
              <div className={styles.field}>
                <label className={styles.label}>반지름</label>
                <input
                  type="number"
                  value={patternConfig.radius}
                  onChange={(e) =>
                    setPatternConfig((prev) => ({
                      ...prev,
                      radius: Number(e.target.value),
                    }))
                  }
                  className={styles.input}
                />
              </div>
            )}

            {patternConfig.pattern === "line" && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>각도 (도)</label>
                  <input
                    type="number"
                    value={patternConfig.angle}
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
                  <input
                    type="number"
                    value={patternConfig.spacing}
                    onChange={(e) =>
                      setPatternConfig((prev) => ({
                        ...prev,
                        spacing: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            )}

            {patternConfig.pattern === "random" && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>영역 너비</label>
                  <input
                    type="number"
                    value={patternConfig.areaWidth}
                    onChange={(e) =>
                      setPatternConfig((prev) => ({
                        ...prev,
                        areaWidth: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>영역 높이</label>
                  <input
                    type="number"
                    value={patternConfig.areaHeight}
                    onChange={(e) =>
                      setPatternConfig((prev) => ({
                        ...prev,
                        areaHeight: Number(e.target.value),
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.cancelButton}
          >
            취소
          </button>

          <button
            onClick={
              activeTab === "grid" ? handleCreateGrid : handleCreatePattern
            }
            className={styles.createButton}
          >
            생성
          </button>
        </div>

        {/* 사용법 안내 */}
        {(objectConfig.type === "rect" || objectConfig.type === "circle") &&
          objectConfig.includeText && (
            <div
              className={styles.info}
              style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}
            >
              💡 팁: 생성된 도형을 더블클릭하면 텍스트를 편집할 수 있습니다.
            </div>
          )}
      </div>
    </div>
  );
}
