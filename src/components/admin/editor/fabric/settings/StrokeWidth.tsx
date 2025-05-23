import * as fabric from "fabric";

interface StrokeWidthProps {
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  disabled: boolean;
}

export function StrokeWidth({
  strokeWidth,
  setStrokeWidth,
  selectedObject,
  canvas,
  disabled,
}: StrokeWidthProps) {
  if (selectedObject?.type === "i-text") return null;

  const handleStrokeWidthChange = (value: number | string) => {
    const parsed = parseInt(value as string);
    const newStrokeWidth = !isNaN(parsed) && parsed >= 0 ? parsed : 0;

    setStrokeWidth(newStrokeWidth);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set("strokeWidth", newStrokeWidth);
          }
        });
        group.set("strokeWidth", newStrokeWidth);
      } else if (
        selectedObject instanceof fabric.Rect ||
        selectedObject instanceof fabric.Circle
      ) {
        selectedObject.set("strokeWidth", newStrokeWidth);
      }
      canvas?.requestRenderAll();
    }
  };

  return (
    <>
      <label>테두리 두께 (px)</label>
      <input
        type="number"
        value={strokeWidth}
        onClick={(e) => e.currentTarget.select()}
        onChange={(e) => handleStrokeWidthChange(e.target.value)}
        disabled={disabled}
      />
    </>
  );
}
