import * as fabric from "fabric";

import { getColorString } from "@/utils/getColorString";

interface FillProps {
  canvas: fabric.Canvas;
  selectedObject: fabric.Object | null;
  color: string | fabric.TFiller;
  setColor: (value: string) => void;
  disabled: boolean;
}

export function Fill({
  canvas,
  selectedObject,
  color,
  setColor,
  disabled,
}: FillProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!selectedObject) return;

    const applyFill = (obj: fabric.Object) => {
      // 텍스트가 아닌 객체만 처리
      if (obj.type !== "i-text") {
        obj.set("fill", value);
      }
    };

    if (selectedObject.type === "activeSelection") {
      const selection = selectedObject as fabric.ActiveSelection;
      selection.getObjects().forEach(applyFill);
    } else if (selectedObject.type === "group") {
      const group = selectedObject as fabric.Group;
      group.getObjects().forEach(applyFill);
    } else {
      // 선택된 객체가 텍스트가 아닐 때만 적용
      if (selectedObject.type !== "i-text") {
        applyFill(selectedObject);
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
        value={getColorString(color)}
        onChange={handleColorChange}
        disabled={disabled}
      />
    </>
  );
}
