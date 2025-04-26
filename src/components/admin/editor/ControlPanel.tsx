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
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onClear}
      >
        초기화
      </button>
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onLoad}
      >
        불러오기
      </button>
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onSave}
      >
        저장하기
      </button>
    </div>
  );
}
