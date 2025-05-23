import React, { useEffect } from "react";
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
  useEffect(() => {
    if (!selectedObject) {
      setIsLocked(false);
      return;
    }

    // 첫 로딩 시 잠금 상태 확인
    const lockStatus =
      selectedObject.lockMovementX &&
      selectedObject.lockMovementY &&
      selectedObject.lockRotation;
    setIsLocked(lockStatus);
  }, [selectedObject, setIsLocked]);

  const handleLockToggle = () => {
    if (!selectedObject) return;

    const lock = !isLocked;

    if (selectedObject.type === "group") {
      const group = selectedObject as fabric.Group;
      group._objects.forEach((obj) => {
        if (obj.type === "i-text") {
          (obj as fabric.IText).set("editable", !lock);
        }
        obj.set({
          lockMovementX: lock,
          lockMovementY: lock,
          lockRotation: lock,
          hasControls: !lock,
        });
      });
    } else {
      selectedObject.set({
        lockMovementX: lock,
        lockMovementY: lock,
        lockRotation: lock,
        editable: !lock,
        hasControls: !lock,
      });
    }

    canvas.requestRenderAll();
    setIsLocked(lock);
  };

  if (!selectedObject) return null;

  return (
    <div className={styles.locked}>
      <button onClick={handleLockToggle}>
        <Image
          src={isLocked ? lockIcon : unlockIcon}
          alt={isLocked ? "lock" : "unlock"}
          priority
        />
      </button>
    </div>
  );
}
