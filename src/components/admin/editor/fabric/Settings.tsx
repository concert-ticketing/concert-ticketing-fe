import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import styles from "./styles.module.css";

interface SettingProps {
  canvas: fabric.Canvas;
}

interface TextState {
  text: string;
  fontSize: number;
}

export default function Settings({ canvas }: SettingProps) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const [diameter, setDiameter] = useState<string | number>("");
  const [color, setColor] = useState<string | fabric.TFiller | null>("");
  const [text, setText] = useState<Record<string, TextState>>({});

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) =>
        handleObjectSelection(e.selected[0])
      );
      canvas.on("selection:updated", (e) =>
        handleObjectSelection(e.selected[0])
      );
      canvas.on("selection:cleared", () => {
        const active = selectedObject;
        if (active?.type === "text" && active.id) {
          setText((prev) => {
            const newText = { ...prev };
            delete newText[active.id as string];
            return newText;
          });
        }
        clearSettings();
      });
      canvas.on("object:modified", (e) => handleObjectSelection(e.target));
      canvas.on("object:scaling", (e) => handleObjectSelection(e.target));
    }
  }, [canvas, selectedObject]);

  const handleObjectSelection = (obj: fabric.Object | undefined) => {
    if (!obj) return;
    setSelectedObject(obj);

    if (obj.type === "activeSelection") {
      const first = (obj as fabric.ActiveSelection).getObjects()[0];
      if (!first) return;
      obj = first;
    }

    if (obj.type === "text") {
      const textObj = obj as fabric.Text & { id: string };
      setText((prev) => ({
        ...prev,
        [textObj.id]: {
          text: textObj.text || "",
          fontSize: textObj.fontSize || 20,
        },
      }));
      setColor(obj.fill);
    }

    if (obj.type === "rect") {
      setWidth(Math.round(obj.width * obj.scaleX));
      setHeight(Math.round(obj.height * obj.scaleY));
      setColor(obj.fill);
      setDiameter("");
    } else if (obj.type === "circle") {
      const circle = obj as fabric.Circle;
      setDiameter(Math.round(circle.radius * 2 * obj.scaleX));
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
    setSelectedObject(null);
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
    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      selection.getObjects().forEach((obj) => {
        obj.set("fill", value);
      });
    } else {
      activeObject.set("fill", value);
    }
    canvas.requestRenderAll();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "text") {
      const id = activeObject.id as string;
      setText((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          text: value,
        },
      }));
      activeObject.set("text", value);
      canvas.renderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "text" && intValue > 0) {
      const id = activeObject.id as string;
      setText((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          fontSize: intValue,
        },
      }));
      activeObject.set("fontSize", intValue);
      canvas.renderAll();
    }
  };

  return (
    <div className={styles.settings}>
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <label>너비</label>
          <input type="text" value={width} onChange={handleWidthChange} />
          <label>높이</label>
          <input type="text" value={height} onChange={handleHeightChange} />
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <>
          <label>지름</label>
          <input type="text" value={diameter} onChange={handleDiameterChange} />
        </>
      )}
      {selectedObject && selectedObject.type === "text" && (
        <>
          <label>텍스트 수정</label>
          <input
            type="text"
            value={text[selectedObject.id as any]?.text || ""}
            onChange={handleTextChange}
            placeholder="텍스트 입력"
          />
          <label>글자 크기</label>
          <input
            type="number"
            value={text[selectedObject.id as any]?.fontSize || ""}
            onChange={handleFontSizeChange}
            placeholder="글자 크기 입력"
          />
        </>
      )}
      {selectedObject && (
        <>
          <label>색상</label>
          <input
            type="color"
            value={typeof color === "string" ? color : "#000000"}
            onChange={handleColorChange}
          />
        </>
      )}
    </div>
  );
}
