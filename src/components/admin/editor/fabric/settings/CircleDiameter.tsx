import * as fabric from "fabric";

interface CircleDiameterProps {
  selectedObject: fabric.Object | null;
  diameter: string | number;
  setDiameter: (value: number) => void;
  isLocked: boolean;
  canvas: fabric.Canvas;
}

export function CircleDiameter({
  selectedObject,
  diameter,
  setDiameter,
  isLocked,
  canvas,
}: CircleDiameterProps) {
  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const parsed = parseInt(value, 10);
    const result = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
    setDiameter(result);

    if (selectedObject) {
      if (selectedObject.type === "group") {
        const group = selectedObject as fabric.Group;
        group._objects.forEach((obj) => {
          if (obj.type === "circle") {
            obj.set({
              radius: result / 2 / obj.scaleX,
            });
            obj.setCoords();
          }
        });
      } else if (selectedObject.type === "circle") {
        selectedObject.set({
          radius: result / 2 / selectedObject.scaleX,
        });
        selectedObject.setCoords();
      }
      canvas.requestRenderAll();
    }
  };

  return (
    <>
      <label>지름</label>
      <input
        type="number"
        value={diameter}
        onClick={(e) => e.currentTarget.select()}
        onChange={handleDiameterChange}
        disabled={isLocked}
      />
    </>
  );
}
