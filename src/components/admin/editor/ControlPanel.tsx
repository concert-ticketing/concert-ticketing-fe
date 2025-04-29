import React from "react";

interface ControlPanelProps {
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClearSvgPaths: () => void;
}

export default function ControlPanel({
  onClear,
  onSave,
  onLoad,
  onClearSvgPaths,
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
      <button
        className="rounded bg-yellow-500 px-4 py-2 text-white"
        onClick={onClearSvgPaths} // SVG Paths 초기화 버튼 추가
      >
        SVG 초기화
      </button>
    </div>
  );
}
