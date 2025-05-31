import * as fabric from "fabric";

/**
 * 텍스트를 생성하여 캔버스에 추가합니다.
 * @param canvas fabric.Canvas 객체
 * @param x 좌표
 * @param y 좌표
 * @param text 텍스트 실제 변수값
 * @param setSelectedTool 툴 상태를 초기화하는 함수
 */

export function addTextFn(
  canvas: fabric.Canvas,
  x: number,
  y: number,
  text: string,
  setSelectedTool: (tool: "text" | null) => void
) {
  const textObject = new fabric.IText(text, {
    left: x,
    top: y,
    fontSize: 16,
    fill: "#000000",
    selectable: true,
    editable: true,
    lockScalingX: true,
    lockScalingY: true,
    originX: "center",
    originY: "center",
  }) as fabric.IText & { id: string };

  textObject.id = `text-${Date.now()}`;

  canvas.add(textObject as fabric.Object);
  canvas.setActiveObject(textObject as fabric.Object);
  canvas.renderAll();
  setSelectedTool(null);
}
