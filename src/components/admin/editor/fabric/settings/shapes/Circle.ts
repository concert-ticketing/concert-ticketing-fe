import * as fabric from "fabric";

/**
 * 원 + 텍스트 그룹을 생성하여 캔버스에 추가합니다.
 * @param canvas fabric.Canvas 객체
 * @param x 좌표
 * @param y 좌표
 * @param setSelectedTool 툴 상태를 초기화하는 함수
 */

export const addCircleFn = (
  canvas: fabric.Canvas,
  x: number,
  y: number,
  setSelectedTool: (tool: "circle" | null) => void
) => {
  const circle = new fabric.Circle({
    radius: 30,
    fill: "#ffffff",
    stroke: "#000000",
    strokeWidth: 1,
    strokeUniform: true,
    originX: "center",
    originY: "center",
  }) as fabric.Circle & { id: string };

  const label = new fabric.IText("S1", {
    fontSize: 16,
    fill: "#000000",
    originX: "center",
    originY: "center",
    editable: true,
    selectable: true,
    left: 0,
    top: 0,
  }) as fabric.FabricObject;

  const group = new fabric.Group([circle, label], {
    left: x,
    top: y,
    originX: "center",
    originY: "center",
    selectable: true,
    stroke: "#000000",
    strokeWidth: 1,
    strokeUniform: true,
    subTargetCheck: true,
  }) as fabric.Group & { id: string };

  // 그룹 내부의 객체에 strokeUniform 적용
  group._objects.forEach((obj) => {
    if (obj instanceof fabric.Circle) {
      obj.set("strokeUniform", true);
    }
  });

  group.id = `circle-${Date.now()}`;
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  setSelectedTool(null);
};
