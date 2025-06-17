import { create } from 'zustand';
import * as fabric from 'fabric';

import { ObjectConfig, GridConfig, PatternConfig } from '@/types/bulk';

interface BulkCreatorState {
  objectConfig: ObjectConfig;
  gridConfig: GridConfig;
  patternConfig: PatternConfig;
  setObjectConfig: (config: ObjectConfig) => void;
  setGridConfig: (config: GridConfig) => void;
  setPatternConfig: (config: PatternConfig) => void;
}

// 기본 좌석 설정
const defaultSeatConfig: ObjectConfig = {
  type: 'rect',
  fill: '#dddddd',
  stroke: '',
  strokeWidth: 0,
  width: 40,
  height: 40,
  borderRadius: 4,
  includeText: false,
  textContent: '좌석',
  textColor: '#333333',
  textFontSize: 12,
};

const defaultGridConfig: GridConfig = {
  rows: 5,
  cols: 10,
  spacingX: 60,
  spacingY: 60,
};

const defaultPatternConfig: PatternConfig = {
  pattern: 'circle',
  count: 12,
  radius: 100,
  angle: 0,
  spacing: 60,
};

export const useBulkCreatorStore = create<BulkCreatorState>((set) => ({
  objectConfig: defaultSeatConfig,
  gridConfig: defaultGridConfig,
  patternConfig: defaultPatternConfig,

  setObjectConfig: (config: ObjectConfig) => set({ objectConfig: config }),

  setGridConfig: (config: GridConfig) => set({ gridConfig: config }),

  setPatternConfig: (config: PatternConfig) => set({ patternConfig: config }),
}));

// 좌석 객체 생성 함수
export const createSeatObject = (
  x: number,
  y: number,
  index: number,
  seatConfig: {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  },
): fabric.FabricObject => {
  const id = `seat_${Date.now()}_${index}`;

  const seat = new fabric.Rect({
    left: x,
    top: y,
    width: seatConfig.width,
    height: seatConfig.height,
    fill: seatConfig.fill,
    stroke: seatConfig.stroke,
    strokeWidth: seatConfig.strokeWidth,
    rx: seatConfig.rx,
    ry: seatConfig.ry,
    originX: 'center',
    originY: 'center',
    strokeUniform: true,
  }) as fabric.Rect & { id: string };

  seat.id = id;
  return seat;
};

// 그리드 생성 함수
export const createGridObjects = (
  seatConfig: {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  },
  gridConfig: GridConfig,
  centerX: number,
  centerY: number,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];

  // 전체 그리드 크기 계산
  const totalWidth = (gridConfig.cols - 1) * gridConfig.spacingX;
  const totalHeight = (gridConfig.rows - 1) * gridConfig.spacingY;

  // 시작 위치 (중앙 기준)
  const startX = centerX - totalWidth / 2;
  const startY = centerY - totalHeight / 2;

  let index = 0;
  for (let row = 0; row < gridConfig.rows; row++) {
    for (let col = 0; col < gridConfig.cols; col++) {
      const x = startX + col * gridConfig.spacingX;
      const y = startY + row * gridConfig.spacingY;

      objects.push(createSeatObject(x, y, index, seatConfig));
      index++;
    }
  }

  return objects;
};

// 원형 패턴 생성 함수
export const createCirclePattern = (
  seatConfig: {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  },
  patternConfig: PatternConfig,
  centerX: number,
  centerY: number,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];
  const angleStep = (2 * Math.PI) / patternConfig.count;

  for (let i = 0; i < patternConfig.count; i++) {
    const angle = i * angleStep;
    const x = centerX + Math.cos(angle) * (patternConfig.radius || 100);
    const y = centerY + Math.sin(angle) * (patternConfig.radius || 100);

    objects.push(createSeatObject(x, y, i, seatConfig));
  }

  return objects;
};

// 직선 패턴 생성 함수
export const createLinePattern = (
  seatConfig: {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  },
  patternConfig: PatternConfig,
  centerX: number,
  centerY: number,
): fabric.FabricObject[] => {
  const objects: fabric.FabricObject[] = [];
  const angle = ((patternConfig.angle || 0) * Math.PI) / 180;
  const spacing = patternConfig.spacing || 60;

  for (let i = 0; i < patternConfig.count; i++) {
    const distance = i * spacing;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    objects.push(createSeatObject(x, y, i, seatConfig));
  }

  return objects;
};
