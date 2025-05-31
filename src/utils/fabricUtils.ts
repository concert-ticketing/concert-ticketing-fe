import * as fabric from "fabric";

export const normalizeObjectSize = (obj: fabric.Object) => {
  if (!obj) return;

  // activeSelection은 내부 객체를 정규화해야 함
  if (obj.type === "activeSelection") {
    (obj as fabric.ActiveSelection).getObjects().forEach((child) => {
      normalizeObjectSize(child);
    });
    return;
  }

  // 그룹 객체는 내부 객체를 정규화하고, 자신은 scale 1, width/height는 실제 크기로.
  if (obj.type === "group") {
    const group = obj as fabric.Group;
    const currentScaleX = group.scaleX || 1;
    const currentScaleY = group.scaleY || 1;

    // 그룹 내 자식 객체들의 스케일을 그룹 스케일로 나눈 후, 자식 객체 자체 스케일을 1로 만듭니다.
    group.getObjects().forEach((child) => {
      child.set({
        scaleX: (child.scaleX || 1) * currentScaleX,
        scaleY: (child.scaleY || 1) * currentScaleY,
      });
      child.setCoords(); // 자식 객체의 내부 좌표 업데이트
      // 자식 객체에 대해서도 normalizeObjectSize를 재귀적으로 호출할 수 있지만,
      // 보통은 그룹 스케일이 자식에게 반영된 후, 자식은 다시 1로 스케일이 복구되는 것을 의미합니다.
      // 여기서는 부모 스케일을 자식에게 '상속'시킨 후 자식 스케일을 1로 만드는 개념이 필요합니다.
      // 예를 들어:
      // if (child.type === 'circle') {
      //    const circle = child as fabric.Circle;
      //    circle.set({ radius: (circle.radius || 0) * (circle.scaleX || 1) });
      //    circle.scaleX = 1;
      //    circle.scaleY = 1;
      // } else if (child.type === 'rect') {
      //    child.set({ width: (child.width || 0) * (child.scaleX || 1), height: (child.height || 0) * (child.scaleY || 1) });
      //    child.scaleX = 1;
      //    child.scaleY = 1;
      // }
    });

    // 그룹 자체의 width, height를 실제 렌더링된 크기로 설정하고 스케일을 1로 만듭니다.
    // Fabric.js 그룹은 내부 객체들의 경계 박스에 기반하여 width/height를 계산합니다.
    // 이 작업은 setCoords()를 호출하여 내부적으로 수행됩니다.
    // 명시적으로 width/height를 설정하기보다는, setCoords() 호출 후 group.width, group.height를 사용하는 것이 좋습니다.
    group.set({
      width: group.width * (group.scaleX || 1),
      height: group.height * (group.scaleY || 1),
      scaleX: 1,
      scaleY: 1,
    });
    group.setCoords(); // 그룹 자체의 경계 상자 업데이트
    return;
  }

  // 일반 객체 (rect, circle, i-text 등)
  const currentScaleX = obj.scaleX || 1;
  const currentScaleY = obj.scaleY || 1;

  if (obj.type === "circle") {
    const circle = obj as fabric.Circle;
    circle.set({
      radius: (circle.radius || 0) * currentScaleX, // 현재 스케일을 반경에 통합
      scaleX: 1, // 스케일을 1로 재설정
      scaleY: 1,
    });
  } else if (obj.type === "rect" || obj.type === "i-text") {
    obj.set({
      width: (obj.width || 0) * currentScaleX, // 현재 스케일을 너비에 통합
      height: (obj.height || 0) * currentScaleY, // 현재 스케일을 높이에 통합
      scaleX: 1, // 스케일을 1로 재설정
      scaleY: 1,
    });
  }
  obj.setCoords(); // 객체 경계 상자 업데이트
};
