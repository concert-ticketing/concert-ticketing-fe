import * as fabric from "fabric";

interface FillProps {
  canvas: fabric.Canvas;
  selectedObject: fabric.Object | null;
  disabled: boolean;
  color: string | fabric.TFiller | null;
  setColor: (value: string) => void;
}

export function Fill({
  canvas,
  selectedObject,
  disabled,
  color,
  setColor,
}: FillProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!selectedObject) return;

    if (selectedObject.type === "activeSelection") {
      const selection = selectedObject as fabric.ActiveSelection;
      selection.getObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set("fill", "#000000");
        } else {
          obj.set("fill", value);
        }
      });
    } else if (selectedObject.type === "group") {
      const group = selectedObject as fabric.Group;
      group._objects.forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set("fill", "#000000");
        } else {
          obj.set("fill", value);
        }
      });
    } else {
      if (selectedObject.type === "i-text") {
        selectedObject.set("fill", "#000000");
      } else {
        selectedObject.set("fill", value);
      }
    }

    canvas.requestRenderAll();
    setColor(value);
  };

  return (
    <>
      <label>배경색</label>
      <input
        type="color"
        value={typeof color}
        onChange={handleColorChange}
        disabled={disabled}
      />
    </>
  );
}
