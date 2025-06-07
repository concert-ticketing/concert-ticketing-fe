export type ObjectType = 'rect' | 'circle' | 'text'; // 생성 객체 유형
export type PatternType = 'grid' | 'circle' | 'line'; // 생성 패턴 유형
export type TabType = 'grid' | 'pattern';

export interface ObjectConfig {
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
  textContent?: string;
  textColor: string;
  textFontSize: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
  startX: number;
  startY: number;
}

export interface PatternConfig {
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
