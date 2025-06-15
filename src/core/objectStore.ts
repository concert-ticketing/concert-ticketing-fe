import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';

import { getColorString } from '@/utils/getColorString';
import { ObjectState } from '@/types/objectState';

export const useObjectStore = create<ObjectState>()(
  devtools(
    (set, _get) => ({
      // 초기 상태
      selectedObject: null,
      width: '',
      height: '',
      diameter: '',
      color: '#ffffff',
      textColor: '#000000',
      text: {},
      position: { x: 0, y: 0 },
      angle: 0,
      opacity: 1,
      strokeColor: '#ffffff',
      strokeWidth: 0,
      isLocked: false,
      price: '',

      // Setters
      setSelectedObject: (selectedObject) => set({ selectedObject }),
      setWidth: (width) => set({ width }),
      setHeight: (height) => set({ height }),
      setDiameter: (diameter) => set({ diameter }),
      setColor: (color) => set({ color }),
      setTextColor: (textColor) => set({ textColor }),
      setText: (textSetter) => {
        if (typeof textSetter === 'function') {
          set((state) => ({ text: textSetter(state.text) }));
        } else {
          set({ text: textSetter });
        }
      },
      setPosition: (position) => set({ position }),
      setAngle: (angle) => set({ angle }),
      setOpacity: (opacity) => set({ opacity }),
      setStrokeColor: (strokeColor) => set({ strokeColor }),
      setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
      setIsLocked: (isLocked) => set({ isLocked }),
      setPrice: (price: number) => set({ price }),
    }),
    {
      name: 'object-store',
    },
  ),
);

// 값 초기화 함수
export const clearSettings = () => {
  const store = useObjectStore.getState();
  store.setSelectedObject(null);
  store.setWidth('');
  store.setHeight('');
  store.setColor('#ffffff');
  store.setTextColor('#000000');
  store.setDiameter('');
  store.setPosition({ x: 0, y: 0 });
  store.setAngle(0);
  store.setOpacity(1);
  store.setStrokeWidth(0);
  store.setStrokeColor('#000000');
  store.setText({});
  store.setPrice('');
};

// 객체 잠금 상태 확인 함수
export const checkObjectLockState = (obj: fabric.Object): boolean => {
  return Boolean(
    obj.lockMovementX &&
      obj.lockMovementY &&
      obj.lockRotation &&
      obj.lockScalingX &&
      obj.lockScalingY,
  );
};

// 텍스트 객체 처리 함수
export const handleTextObject = (obj: fabric.Object) => {
  const textObj = obj as fabric.IText & { id: string };
  const { setText, setColor } = useObjectStore.getState();

  setText((prev) => ({
    ...prev,
    [textObj.id]: {
      text: textObj.text || '',
      fontSize: textObj.fontSize || 20,
    },
  }));
  setColor((obj.fill as string) || '#ffffff');
};

// 원의 지름 계산 함수
export const calculateCircleDiameter = (
  circle: fabric.Circle,
  group?: fabric.Group,
): number => {
  if (!circle || !circle.radius) return 0;

  const circleScale = circle.scaleX || 1;
  const groupScale = group ? group.scaleX || 1 : 1;
  const effectiveRadius = circle.radius * circleScale * groupScale;

  return Math.round(effectiveRadius * 2);
};

// 그룹 객체 처리 함수
export const handleGroupObject = (obj: fabric.Object, updateDiameter: boolean = true) => {
  if (obj.type === 'group') {
    const group = obj as fabric.Group;
    const { setDiameter, setWidth, setHeight, setColor } = useObjectStore.getState();

    // 그룹 내에서 Circle과 Rect 찾기
    const circle = group.getObjects().find((o) => o.type === 'circle') as fabric.Circle;
    const rect = group.getObjects().find((o) => o.type === 'rect') as fabric.Rect;

    if (circle && updateDiameter) {
      const calculatedDiameter = calculateCircleDiameter(circle, group);
      setDiameter(calculatedDiameter);
    }

    if (rect) {
      // Rect가 있으면 크기 설정
      setWidth(Math.round((rect.width || 0) * (rect.scaleX || 1) * (group.scaleX || 1)));
      setHeight(
        Math.round((rect.height || 0) * (rect.scaleY || 1) * (group.scaleY || 1)),
      );
    }

    // 그룹의 배경색 처리 - 그룹 내 첫 번째 도형의 색상 가져오기
    const firstShape = circle || rect;
    if (firstShape && firstShape.fill) {
      setColor(getColorString(firstShape.fill));
    }
  }
};

// 메인 객체 선택 핸들러
export const handleObjectSelection = (
  obj: fabric.Object | undefined,
  updateSizes: boolean = true,
) => {
  if (!obj) return;

  const {
    setSelectedObject,
    setIsLocked,
    setPosition,
    setAngle,
    setOpacity,
    setStrokeWidth,
    setStrokeColor,
    setTextColor,
    setColor,
    setWidth,
    setHeight,
    setDiameter,
    setText,
    setPrice,
  } = useObjectStore.getState();

  setSelectedObject(obj);

  // ActiveSelection 처리
  let targetObject = obj;
  if (obj.type === 'activeSelection') {
    const first = (obj as fabric.ActiveSelection).getObjects()[0];
    if (!first) return;
    targetObject = first;
  }

  // 공통 속성 설정
  setIsLocked(checkObjectLockState(targetObject));
  setPosition({ x: targetObject.left || 0, y: targetObject.top || 0 });
  setAngle(targetObject.angle || 0);
  setOpacity(targetObject.opacity || 1);
  setStrokeWidth(targetObject.strokeWidth || 0);
  setStrokeColor(getColorString(targetObject.stroke));
  setPrice(targetObject.price || '');

  // 텍스트 객체면 textColor에, 나머지는 color에 설정
  if (targetObject.type === 'i-text') {
    setTextColor(getColorString(targetObject.fill));
  } else {
    setColor(getColorString(targetObject.fill));
  }

  // 객체 타입별 처리
  switch (targetObject.type) {
    case 'i-text':
      handleTextObject(targetObject);
      break;
    case 'rect':
      if (updateSizes) {
        setWidth(Math.round((targetObject.width || 0) * (targetObject.scaleX || 1)));
        setHeight(Math.round((targetObject.height || 0) * (targetObject.scaleY || 1)));
      }
      break;
    case 'circle':
      if (updateSizes) {
        const circle = targetObject as fabric.Circle;
        const calculatedDiameter = calculateCircleDiameter(circle);
        setDiameter(calculatedDiameter);
      }
      break;
    case 'group':
      handleGroupObject(targetObject, updateSizes);
      break;
    default:
      if (updateSizes) {
        setWidth('');
        setHeight('');
        setDiameter('');
      }
      setText({});
      break;
  }
};

// 위치/각도만 업데이트하는 핸들러
export const handleObjectPositionChange = (obj: fabric.Object | undefined) => {
  if (!obj) return;

  const { setPosition, setAngle } = useObjectStore.getState();
  // 위치와 각도만 업데이트
  setPosition({ x: obj.left || 0, y: obj.top || 0 });
  setAngle(obj.angle || 0);
};

// 선택 해제 처리 함수
export const handleSelectionCleared = () => {
  const { selectedObject, setText } = useObjectStore.getState();
  const active = selectedObject;
  if (active?.type === 'i-text' && (active as fabric.IText & { id: string }).id) {
    setText((prev) => {
      const newText = { ...prev };
      delete newText[(active as fabric.IText & { id: string }).id];
      return newText;
    });
  }
  clearSettings();
};

// 객체 수정 처리 함수
export const handleObjectModified = (e: { target?: fabric.Object }) => {
  handleObjectSelection(e.target, true); // 크기 업데이트 포함

  if (e.target) {
    const obj = e.target;
    if (obj.type === 'group') {
      const group = obj as fabric.Group;
      const circle = group.getObjects().find((o) => o.type === 'circle') as fabric.Circle;
      if (circle) {
        const calculatedDiameter = calculateCircleDiameter(circle, group);
        const { setDiameter } = useObjectStore.getState();
        setDiameter(calculatedDiameter);
      }
    }
  }
};

// 스케일링 처리 함수
export const handleObjectScaling = (
  e: { target?: fabric.Object },
  canvas: fabric.Canvas,
) => {
  const obj = e.target;
  if (!obj) return;

  const { setWidth, setHeight, setDiameter } = useObjectStore.getState();

  if (obj.type === 'rect' || obj.type === 'group') {
    setWidth(Math.round((obj.width || 0) * (obj.scaleX || 1)));
    setHeight(Math.round((obj.height || 0) * (obj.scaleY || 1)));

    if (obj.type === 'group') {
      const group = obj as fabric.Group;
      const circle = group.getObjects().find((o) => o.type === 'circle') as fabric.Circle;
      if (circle) {
        const calculatedDiameter = calculateCircleDiameter(circle, group);
        setDiameter(calculatedDiameter);
      }
    }
  } else if (obj.type === 'circle') {
    const circle = obj as fabric.Circle;
    const calculatedDiameter = calculateCircleDiameter(circle);
    setDiameter(calculatedDiameter);
  }

  canvas.requestRenderAll();
};

// 더블클릭 처리 함수
export const handleDoubleClick = (
  e: { target?: fabric.Object; subTargets?: fabric.Object[] },
  canvas: fabric.Canvas,
) => {
  const { target } = e;

  if (target instanceof fabric.Group && target.subTargetCheck && e.subTargets) {
    const subTarget = e.subTargets[0];
    if (subTarget instanceof fabric.IText) {
      canvas.setActiveObject(subTarget as fabric.Object);
      subTarget.enterEditing();
      subTarget.selectAll();
    }
  } else if (target instanceof fabric.IText) {
    target.enterEditing();
    target.selectAll();
  }
};
