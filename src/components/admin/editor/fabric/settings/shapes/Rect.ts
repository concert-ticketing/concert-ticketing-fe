import * as fabric from "fabric";

/**
 * 사각형 + 텍스트 그룹을 생성하여 캔버스에 추가합니다.
 * @param canvas fabric.Canvas 객체
 * @param x 좌표
 * @param y 좌표
 * @param setSelectedTool 툴 상태를 초기화하는 함수
 */

export const addRectangleFn = (
  canvas: fabric.Canvas,
  x: number,
  y: number,
  setSelectedTool: (tool: "rect" | null) => void
) => {
  const rect = new fabric.Rect({
    width: 60,
    height: 60,
    fill: "#ffffff",
    strokeWidth: 1,
    stroke: "#000000",
    strokeUniform: true,
    originX: "center",
    originY: "center",
  }) as fabric.Rect & { id: string };

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

  const group = new fabric.Group([rect, label], {
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

  group._objects.forEach((obj) => {
    if (obj instanceof fabric.Rect) {
      obj.set("strokeUniform", true);
    }
  });

  group.id = `rect-${Date.now()}`;
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  setSelectedTool(null);
};
