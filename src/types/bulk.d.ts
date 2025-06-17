export type ObjectType = 'rect'; // 좌석은 사각형으로 통일
export type PatternType = 'grid' | 'circle' | 'line'; // 생성 패턴 유형
export type TabType = 'grid' | 'pattern';

export interface ObjectConfig {
  type: ObjectType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  width: number;
  height: number;
  borderRadius: number;
  // 도형 내 텍스트 관련 설정 (필요시 추가)
  includeText: boolean;
  textContent?: string;
  textColor?: string;
  textFontSize?: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
}

export interface PatternConfig {
  pattern: 'circle' | 'line';
  count: number;
  radius?: number; // 원형 패턴용
  angle?: number; // 직선 패턴용 (각도)
  spacing?: number; // 직선 패턴용 (간격)
}
