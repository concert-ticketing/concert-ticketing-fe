import { useState } from "react";

import { Seat } from "@/types/Seat";

import Canvas from "@/components/admin/editor/canvas";
import ControlPanel from "@/components/admin/editor/ControlPanel";
import SeatingTable from "@/components/admin/editor/SeatingTable";

export default function SeatingEditor() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const handleOnLoad = () => {
    const savedSeats = sessionStorage.getItem("seats");
    if (savedSeats) {
      setSeats(JSON.parse(savedSeats));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("모든 좌석을 삭제하시겠습니까?")) {
      setSeats([]);
    }
  };

  const handleSave = () => {
    try {
      if (window.confirm("모든 좌석을 저장하시겠습니까?")) {
        sessionStorage.setItem("seats", JSON.stringify(seats));
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 실패, 콘솔을 확인 필요");
    }
  };

  return (
    <div className="w-full text-center">
      <h1>좌석 배치 에디터</h1>
      <ControlPanel
        onClear={handleClearAll}
        onSave={handleSave}
        onLoad={handleOnLoad}
      />
      <Canvas seats={seats} setSeats={setSeats} />
      <SeatingTable seats={seats} setSeats={setSeats} />
    </div>
  );
}
