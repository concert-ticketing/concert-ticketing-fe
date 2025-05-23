import * as fabric from "fabric";

interface RectSizeProps {
  selectedObject: fabric.Object | null;
  width: string | number;
  height: string | number;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  isLocked: boolean;
  canvas: fabric.Canvas;
}

export function RectSize({
  selectedObject,
  width,
  height,
  setWidth,
  setHeight,
  isLocked,
  canvas,
}: RectSizeProps) {
  // 객체 너비
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setWidth(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "rect") {
            obj.set({ width: result });
          }
        });
        group.set({ width: result });
      } else if (selectedObject.type === "rect") {
        selectedObject.set({ width: result });
      }
      canvas.requestRenderAll();
    }
  };

  // 객체 높이
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = Math.max(1, parseInt(value, 10));
    const result = !isNaN(intValue) && intValue >= 0 ? intValue : 1;
    setHeight(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "rect") {
            obj.set({ height: intValue });
          }
        });
        group.set({ height: intValue });
      } else if (selectedObject.type === "rect") {
        selectedObject.set({ height: intValue });
      }
      canvas.requestRenderAll();
    }
  };

  return (
    <>
      <label>너비 (px)</label>
      <input
        type="number"
        value={width}
        onClick={(e) => e.currentTarget.select()}
        onChange={handleWidthChange}
        disabled={isLocked}
      />
      <label>높이 (px)</label>
      <input
        type="number"
        value={height}
        onClick={(e) => e.currentTarget.select()}
        onChange={handleHeightChange}
        disabled={isLocked}
      />
    </>
  );
}
