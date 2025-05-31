import * as fabric from "fabric";

interface OpacityProps {
  opacity: number;
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  setOpacity: (value: number) => void;
  disabled: boolean;
}

export function Opacity({
  opacity,
  selectedObject,
  canvas,
  setOpacity,
  disabled,
}: OpacityProps) {
  const handleOpacityChange = (value: number) => {
    if (selectedObject && canvas) {
      selectedObject.set("opacity", value);
      canvas.requestRenderAll();
      setOpacity(value);
    }
  };

  return (
    <>
      <label>투명도(%)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={Math.round(opacity * 100)}
        onClick={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          const normalized = Math.min(Math.max(value, 0), 100) / 100;
          handleOpacityChange(normalized);
        }}
        disabled={disabled}
      />
    </>
  );
}
