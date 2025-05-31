import React from "react";
import * as fabric from "fabric";

import styles from "../canvas.module.css";

interface PositionProps {
  position: { x: number; y: number };
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  disabled?: boolean;
}

export function Position({
  position,
  selectedObject,
  canvas,
  setPosition,
  disabled,
}: PositionProps) {
  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (selectedObject && canvas) {
      selectedObject.set(axis === "x" ? "left" : "top", value);
      canvas.requestRenderAll();
      setPosition((prev) => ({ ...prev, [axis]: value }));
    }
  };

  return (
    <>
      <label>위치 (X, Y)</label>
      <div className={styles.flexGroup}>
        <input
          type="number"
          value={position.x.toFixed()}
          onClick={(e) => e.currentTarget.select()}
          onChange={(e) =>
            handlePositionChange("x", parseFloat(e.target.value))
          }
          disabled={disabled}
        />
        <input
          type="number"
          value={position.y.toFixed()}
          onClick={(e) => e.currentTarget.select()}
          onChange={(e) =>
            handlePositionChange("y", parseFloat(e.target.value))
          }
          disabled={disabled}
        />
      </div>
    </>
  );
}
