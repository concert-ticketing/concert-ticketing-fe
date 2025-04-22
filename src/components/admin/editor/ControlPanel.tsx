import React from "react";

interface ControlPanelProps {
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export default function ControlPanel({
  onClear,
  onSave,
  onLoad,
}: ControlPanelProps) {
  return (
    <div className="mb-[10px] flex justify-center gap-[5px]">
      <button onClick={onClear}>초기화</button>
      <button onClick={onLoad}>불러오기</button>
      <button onClick={onSave}>저장하기</button>
    </div>
  );
}
