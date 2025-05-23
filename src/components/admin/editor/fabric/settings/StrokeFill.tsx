import * as fabric from "fabric";

interface StrokeColorProps {
  strokeColor: string | fabric.TFiller | null;
  setStrokeColor: (value: string) => void;
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  disabled: boolean;
}

export function StrokeColor({
  strokeColor,
  setStrokeColor,
  selectedObject,
  canvas,
  disabled,
}: StrokeColorProps) {
  if (selectedObject?.type === "i-text") return null;

  const handleStrokeChange = (value: string) => {
    setStrokeColor(value);
    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj instanceof fabric.Rect || obj instanceof fabric.Circle) {
            obj.set("stroke", value);
          }
        });
        group.set("stroke", value);
      } else {
        selectedObject.set("stroke", value);
      }
      canvas?.requestRenderAll();
    }
  };

  return (
    <>
      <label>테두리 색</label>
      <input
        type="color"
        value={typeof strokeColor || "#000000"}
        onChange={(e) => handleStrokeChange(e.target.value)}
        disabled={disabled}
      />
    </>
  );
}
