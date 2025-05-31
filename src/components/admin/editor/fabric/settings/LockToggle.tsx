import React from "react";
import Image from "next/image";
import { lockIcon, unlockIcon } from "@public/icons";
import * as fabric from "fabric";

import styles from "../canvas.module.css";

interface LockToggleProps {
  canvas: fabric.Canvas;
  selectedObject: fabric.Object | null;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

export function LockToggle({
  canvas,
  selectedObject,
  isLocked,
  setIsLocked,
}: LockToggleProps) {
  const handleToggleLock = () => {
    if (!selectedObject) return;

    const newState = !isLocked;

    // 선택된 단일 객체 또는 ActiveSelection 내의 모든 객체에 잠금 속성 적용
    const objectsToLock =
      selectedObject.type === "activeSelection"
        ? (selectedObject as fabric.ActiveSelection).getObjects()
        : [selectedObject];

    objectsToLock.forEach((obj) => {
      obj.set({
        lockMovementX: newState,
        lockMovementY: newState,
        lockRotation: newState,
        lockScalingX: newState,
        lockScalingY: newState,
        hasControls: !newState,
        hasBorders: !newState,
        selectable: true,
      });
      obj.setCoords();
    });

    canvas.requestRenderAll();

    setIsLocked(newState);
  };

  return (
    <div className={styles.locked}>
      <button onClick={handleToggleLock}>
        <Image
          src={isLocked ? lockIcon : unlockIcon}
          alt={isLocked ? "lock" : "unlock"}
          priority
        />
      </button>
    </div>
  );
}
