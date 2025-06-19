export type ObjectType = 'rect'; // 좌석은 사각형으로 통일
export type PatternType = 'grid' | 'circle' | 'line'; // 생성 패턴 유형
export type TabType = 'grid' | 'pattern';

export interface SeatConfig {
  type: string;
  width: number;
  height: number;
  borderRadius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  textFontSize?: number;
  rx?: number;
  ry?: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
}

export interface PatternConfig {
  pattern: 'line' | 'circle';
  count: number;
  radius?: number; // 원형 패턴용
  angle?: number; // 직선 패턴용 (각도)
  spacing?: number; // 직선 패턴용 (간격)
}
