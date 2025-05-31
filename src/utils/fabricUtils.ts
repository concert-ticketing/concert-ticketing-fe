import * as fabric from "fabric";

/**
 * Fabric.js 객체의 유효 너비를 계산합니다.
 * 객체가 그룹 내부에 있을 경우 그룹의 스케일도 함께 고려합니다.
 * @param obj 계산할 Fabric.js 객체
 * @returns 객체의 유효 너비 (정수)
 */
export const getEffectiveWidth = (obj: fabric.Object): number => {
  if (obj.group) {
    // 객체가 그룹 안에 있을 경우: (자신의 너비 * 자신의 스케일X) * (부모 그룹의 스케일X)
    return Math.round(
      (obj.width || 0) * (obj.scaleX || 1) * (obj.group.scaleX || 1)
    );
  }
  // 단일 객체일 경우: 자신의 너비 * 자신의 스케일X
  return Math.round((obj.width || 0) * (obj.scaleX || 1));
};

/**
 * Fabric.js 객체의 유효 높이를 계산합니다.
 * 객체가 그룹 내부에 있을 경우 그룹의 스케일도 함께 고려합니다.
 * @param obj 계산할 Fabric.js 객체
 * @returns 객체의 유효 높이 (정수)
 */
export const getEffectiveHeight = (obj: fabric.Object): number => {
  if (obj.group) {
    // 객체가 그룹 안에 있을 경우: (자신의 높이 * 자신의 스케일Y) * (부모 그룹의 스케일Y)
    return Math.round(
      (obj.height || 0) * (obj.scaleY || 1) * (obj.group.scaleY || 1)
    );
  }
  // 단일 객체일 경우: 자신의 높이 * 자신의 스케일Y
  return Math.round((obj.height || 0) * (obj.scaleY || 1));
};

/**
 * Fabric.js 원형 객체 또는 그룹 내 원형 객체의 유효 지름을 계산합니다.
 * 그룹 내부에 원형이 있을 경우 그룹의 스케일도 함께 고려합니다.
 * @param obj 계산할 Fabric.js 객체 (fabric.Circle 또는 fabric.Group)
 * @returns 객체의 유효 지름 (정수), 원형 객체가 아니거나 그룹 내에 원형이 없으면 NaN 반환
 */
export const getEffectiveDiameter = (obj: fabric.Object): number => {
  if (obj.type === "circle") {
    const circle = obj as fabric.Circle;
    // 단일 원형 객체의 경우: (반지름 * 2) * 자신의 스케일X
    return Math.round((circle.radius || 0) * 2 * (circle.scaleX || 1));
  } else if (obj.type === "group") {
    const group = obj as fabric.Group;
    // 그룹 내에서 'circle' 타입의 객체를 찾습니다.
    const circleInGroup = group
      .getObjects()
      .find((o) => o.type === "circle") as fabric.Circle;

    if (circleInGroup) {
      // 그룹 내 원형 객체의 유효 반지름 계산:
      // (자식 원형의 반지름 * 자식 원형의 스케일X) * (부모 그룹의 스케일X)
      // 일반적으로 그룹 스케일은 X, Y 축이 동일하다고 가정합니다.
      const effectiveRadius =
        (circleInGroup.radius || 0) *
        (circleInGroup.scaleX || 1) *
        (group.scaleX || 1);
      return Math.round(effectiveRadius * 2); // 유효 반지름을 지름으로 변환
    }
  }
  return NaN; // 원형 객체가 아니거나 그룹 내에 원형이 없는 경우
};
