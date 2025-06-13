import * as fabric from 'fabric';

interface TextState {
  text: string;
  fontSize: number;
}

export interface ObjectState {
  // 선택된 객체
  selectedObject: fabric.Object | null;

  // 객체 속성
  width: string | number;
  height: string | number;
  diameter: string | number;
  color: string;
  textColor: string;
  text: Record<string, TextState>;
  position: { x: number; y: number };
  angle: number;
  opacity: number;
  strokeColor: string;
  strokeWidth: number;
  isLocked: boolean;

  // Actions
  setSelectedObject: (object: fabric.Object | null) => void;
  setWidth: (width: string | number) => void;
  setHeight: (height: string | number) => void;
  setDiameter: (diameter: string | number) => void;
  setColor: (color: string) => void;
  setTextColor: (textColor: string) => void;
  setText: (
    textSetter:
      | Record<string, TextState>
      | ((prev: Record<string, TextState>) => Record<string, TextState>),
  ) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setAngle: (angle: number) => void;
  setOpacity: (opacity: number) => void;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setIsLocked: (isLocked: boolean) => void;
}
