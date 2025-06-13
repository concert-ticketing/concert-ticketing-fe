import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';

import { ObjectConfig, GridConfig, PatternConfig, TabType } from '@/types/bulk';

interface BulkCreatorState {
  // UI 상태
  isOpen: boolean;
  activeTab: TabType;
  autoSpacing: boolean;

  // 설정 상태
  objectConfig: ObjectConfig;
  gridConfig: GridConfig;
  patternConfig: PatternConfig;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  setAutoSpacing: (autoSpacing: boolean) => void;
  setObjectConfig: (
    config: ObjectConfig | ((prev: ObjectConfig) => ObjectConfig),
  ) => void;
  setGridConfig: (config: GridConfig | ((prev: GridConfig) => GridConfig)) => void;
  setPatternConfig: (
    config: PatternConfig | ((prev: PatternConfig) => PatternConfig),
  ) => void;

  // 기본값 리셋
  resetToDefaults: () => void;
}

const defaultObjectConfig: ObjectConfig = {
  type: 'rect',
  fill: '#3b82f6',
  stroke: '#1e40af',
  strokeWidth: 1,
  width: 60,
  height: 60,
  radius: 40,
  borderRadius: 0,
  text: 'Text',
  fontSize: 16,
  includeText: false,
  textContent: '텍스트',
  textColor: '#ffffff',
  textFontSize: 14,
};

const defaultGridConfig: GridConfig = {
  rows: 3,
  cols: 3,
  spacingX: 100,
  spacingY: 100,
  startX: 100,
  startY: 100,
};

const defaultPatternConfig: PatternConfig = {
  pattern: 'circle',
  count: 8,
  centerX: 300,
  centerY: 300,
  radius: 150,
  angle: 0,
  spacing: 80,
  areaWidth: 400,
  areaHeight: 300,
};

export const useBulkCreatorStore = create<BulkCreatorState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      isOpen: false,
      activeTab: 'grid',
      autoSpacing: false,
      objectConfig: defaultObjectConfig,
      gridConfig: defaultGridConfig,
      patternConfig: defaultPatternConfig,

      // Setters
      setIsOpen: (isOpen) => set({ isOpen }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setAutoSpacing: (autoSpacing) => set({ autoSpacing }),

      setObjectConfig: (config) => {
        if (typeof config === 'function') {
          set((state) => ({ objectConfig: config(state.objectConfig) }));
        } else {
          set({ objectConfig: config });
        }
      },

      setGridConfig: (config) => {
        if (typeof config === 'function') {
          set((state) => ({ gridConfig: config(state.gridConfig) }));
        } else {
          set({ gridConfig: config });
        }
      },

      setPatternConfig: (config) => {
        if (typeof config === 'function') {
          set((state) => ({ patternConfig: config(state.patternConfig) }));
        } else {
          set({ patternConfig: config });
        }
      },

      // 기본값 리셋
      resetToDefaults: () => {
        set({
          objectConfig: defaultObjectConfig,
          gridConfig: defaultGridConfig,
          patternConfig: defaultPatternConfig,
          autoSpacing: false,
        });
      },
    }),
    {
      name: 'bulk-creator-store',
    },
  ),
);

// 자동 간격 계산 함수
export const calculateOptimalSpacing = (
  objectConfig: ObjectConfig,
  gridConfig: GridConfig,
) => {
  let objectWidth = 60;
  let objectHeight = 60;

  // 객체 타입별 크기 계산
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
    objectWidth = Math.max(60, textLength * fontSize * 0.6);
    objectHeight = Math.max(60, fontSize * 1.2);
  }

  // 텍스트 포함시 추가 공간 고려
  if (
    (objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
    objectConfig.includeText
  ) {
    const textContent = objectConfig.textContent || '텍스트';
    const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
    const textHeight = objectConfig.textFontSize * 1.2;

    if (objectConfig.type === 'rect') {
      objectWidth = Math.max(objectWidth, textWidth + 20);
      objectHeight = Math.max(objectHeight, textHeight + 20);
    } else if (objectConfig.type === 'circle') {
      const requiredDiameter = Math.max(textWidth, textHeight) * 1.4;
      objectWidth = Math.max(objectWidth, requiredDiameter);
      objectHeight = Math.max(objectHeight, requiredDiameter);
    }
  }

  // 적응형 여백 계산
  const baseMargin = 30;
  const maxSize = Math.max(objectWidth, objectHeight);
  let marginMultiplier;
  if (maxSize > 200) {
    marginMultiplier = 1.1;
  } else if (maxSize > 100) {
    marginMultiplier = 1.2;
  } else {
    marginMultiplier = 1.3;
  }

  const optimalSpacingX = Math.ceil(objectWidth * marginMultiplier + baseMargin);
  const optimalSpacingY = Math.ceil(objectHeight * marginMultiplier + baseMargin);

  return { optimalSpacingX, optimalSpacingY };
};

// 패턴 자동 간격 계산 함수
export const calculatePatternSpacing = (
  objectConfig: ObjectConfig,
  patternConfig: PatternConfig,
) => {
  let objectSize = 60;

  if (objectConfig.type === 'rect') {
    objectSize = Math.max(objectConfig.width || 60, objectConfig.height || 60);
  } else if (objectConfig.type === 'circle') {
    objectSize = (objectConfig.radius || 40) * 2;
  }

  // 텍스트 포함시 크기 증가 고려
  if (
    (objectConfig.type === 'rect' || objectConfig.type === 'circle') &&
    objectConfig.includeText
  ) {
    const textContent = objectConfig.textContent || '텍스트';
    const textWidth = textContent.length * objectConfig.textFontSize * 0.6;
    if (objectConfig.type === 'circle') {
      objectSize = Math.max(objectSize, textWidth * 1.4);
    } else {
      objectSize = Math.max(objectSize, textWidth + 20);
    }
  }

  // 패턴별 최적 간격 계산
  const result: Partial<PatternConfig> = {};

  if (patternConfig.pattern === 'circle') {
    const optimalRadius = Math.max(
      patternConfig.radius || 150,
      (objectSize * patternConfig.count) / (2 * Math.PI) + objectSize * 0.5,
    );
    result.radius = Math.ceil(optimalRadius);
  } else if (patternConfig.pattern === 'line') {
    const optimalSpacing = Math.ceil(objectSize * 1.3);
    result.spacing = optimalSpacing;
  }

  return result;
};

// 객체 생성 함수
export const createObject = (
  x: number,
  y: number,
  index: number,
  objectConfig: ObjectConfig,
  canvas: fabric.Canvas,
): fabric.FabricObject => {
  const id = `bulk_${objectConfig.type}_${Date.now()}_${index}`;

  if (objectConfig.type === 'text') {
    const textObj = new fabric.IText(`${objectConfig.text || 'Text'} ${index + 1}`, {
      left: x,
      top: y,
      fontSize: objectConfig.fontSize,
      fill: objectConfig.fill,
      stroke: objectConfig.stroke,
      strokeWidth: objectConfig.strokeWidth,
    }) as fabric.IText & { id: string };

    textObj.id = id;
    return textObj as fabric.FabricObject;
  }

  // 도형 객체 생성
  let shape: fabric.FabricObject & { id: string };

  if (objectConfig.type === 'rect') {
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
      strokeUniform: true,
    }) as fabric.Rect & { id: string };
    shape.id = `${id}_rect`;
  } else {
    shape = new fabric.Circle({
      left: 0,
      top: 0,
      radius: objectConfig.radius,
      fill: objectConfig.fill,
      stroke: objectConfig.stroke,
      strokeWidth: objectConfig.strokeWidth,
      strokeUniform: true,
    }) as fabric.Circle & { id: string };
    shape.id = `${id}_circle`;
  }

  // 텍스트를 포함하지 않는 경우 도형만 반환
  if (!objectConfig.includeText) {
    shape.set({
      left: x,
      top: y,
    });
    shape.id = id;
    return shape;
  }

  // 도형 내부에 텍스트 추가
  const textObj = new fabric.IText(
    `${objectConfig.textContent || '텍스트'}${index + 1}`,
    {
      fontSize: objectConfig.textFontSize,
      fill: objectConfig.textColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      editable: true,
      selectable: true,
      left: 0,
      top: 0,
    },
  ) as fabric.IText & { id: string };

  textObj.id = `${id}_text`;

  // 도형의 중심에 텍스트 배치
  if (objectConfig.type === 'rect') {
    const rectWidth = objectConfig.width || 60;
    const rectHeight = objectConfig.height || 60;
    textObj.set({
      left: rectWidth / 2,
      top: rectHeight / 2,
    });
  } else if (objectConfig.type === 'circle') {
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
    originX: 'center',
    originY: 'center',
    selectable: true,
    strokeUniform: true,
    subTargetCheck: true,
  }) as fabric.Group & { id: string };

  group.id = id;

  group.on('mousedblclick', (e: any) => {
    e.e?.preventDefault();
    e.e?.stopPropagation();

    if (group.subTargetCheck && e.subTargets && e.subTargets.length > 0) {
      const subTarget = e.subTargets[0];
      if (subTarget instanceof fabric.IText) {
        canvas.setActiveObject(subTarget as fabric.Object);
        subTarget.enterEditing();
        subTarget.selectAll();
      }
    }
  });

  return group;
};

// 그리드 생성 함수
export const createGridObjects = (
  objectConfig: ObjectConfig,
  gridConfig: GridConfig,
  canvas: fabric.Canvas,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];
  let index = 0;

  for (let row = 0; row < gridConfig.rows; row++) {
    for (let col = 0; col < gridConfig.cols; col++) {
      const x = gridConfig.startX + col * gridConfig.spacingX;
      const y = gridConfig.startY + row * gridConfig.spacingY;

      objects.push(createObject(x, y, index, objectConfig, canvas));
      index++;
    }
  }

  return objects;
};

// 원형 패턴 생성 함수
export const createCirclePattern = (
  objectConfig: ObjectConfig,
  patternConfig: PatternConfig,
  canvas: fabric.Canvas,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];
  const angleStep = (2 * Math.PI) / patternConfig.count;

  for (let i = 0; i < patternConfig.count; i++) {
    const angle = i * angleStep;
    const x = patternConfig.centerX + Math.cos(angle) * (patternConfig.radius || 100);
    const y = patternConfig.centerY + Math.sin(angle) * (patternConfig.radius || 100);

    objects.push(createObject(x, y, i, objectConfig, canvas));
  }

  return objects;
};

// 직선 패턴 생성 함수
export const createLinePattern = (
  objectConfig: ObjectConfig,
  patternConfig: PatternConfig,
  canvas: fabric.Canvas,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];
  const angle = ((patternConfig.angle || 0) * Math.PI) / 180;
  const spacing = patternConfig.spacing || 60;

  for (let i = 0; i < patternConfig.count; i++) {
    const distance = i * spacing;
    const x = patternConfig.centerX + Math.cos(angle) * distance;
    const y = patternConfig.centerY + Math.sin(angle) * distance;

    objects.push(createObject(x, y, i, objectConfig, canvas));
  }

  return objects;
};
