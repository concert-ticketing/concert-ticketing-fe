import React, { useState, useEffect } from "react";
import * as fabric from "fabric";

interface CanvasProps {
  canvas: HTMLCanvasElement | fabric.Canvas | null;
}

export default function Settings({ canvas }: { canvas: CanvasProps }) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const [diameter, setDiameter] = useState<string | number>("");
  const [color, setColor] = useState<
    string | fabric.TFiller | null | undefined
  >();

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e: any) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:updated", (e: any) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", (e) => {
        handleObjectSelection(e.target);
      });
      canvas.on("object:scaling", (e) => {
        handleObjectSelection(e.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (obj: fabric.Object | undefined) => {
    if (!obj) return;

    setSelectedObject(obj);
    if (obj.type === "rect") {
      setWidth(Math.round(obj.width * obj.scaleX));
      setHeight(Math.round(obj.height * obj.scaleY));
      setColor(obj.fill);
      setDiameter("");
    } else if (obj.type === "circle") {
      setDiameter(Math.round(obj.radius * 2 * obj.scaleX));
      setColor(obj.fill);
      setWidth("");
      setHeight("");
    }
  };

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setColor("");
    setDiameter("");
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setWidth(intValue);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setHeight(intValue);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setDiameter(intValue);

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
      canvas.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  return (
    <div>
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <input type="text" value={width} onChange={handleWidthChange} />
          <input type="text" value={height} onChange={handleHeightChange} />
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <input type="text" value={diameter} onChange={handleDiameterChange} />
      )}
      {selectedObject && (
        <input
          type="color"
          value={typeof color === "string" ? color : "#000000"}
          onChange={handleColorChange}
        />
      )}
    </div>
  );
}
