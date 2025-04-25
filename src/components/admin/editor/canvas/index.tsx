import { useEffect, useRef, useState } from "react";
import { Seat } from "@/types/Seat";
import CanvasRender from "./ConvasRender";

interface SeatingCanvasProps {
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
}

export default function SeatingCanvas({ seats, setSeats }: SeatingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // 캔버스 DOM 요소 참조
  const [draggingSeatId, setDraggingSeatId] = useState<string | null>(null); // 현재 드래그 중인 좌석 ID
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 드래그 시작 위치와 좌석 위치 간의 오프셋
  const [isDragging, setIsDragging] = useState(false); // 현재 드래그 중인지 여부
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null); // 마우스가 올라간 좌석 ID
  const [resizingSeatId, setResizingSeatId] = useState<string | null>(null); // 크기 조정 중인 좌석 ID
  const [rotatingSeatId, setRotatingSeatId] = useState<string | null>(null); // 회전 중인 좌석 ID
  const [isCopyMode, setIsCopyMode] = useState(false); // Ctrl 키 누른 상태(복사 모드) 여부
  const [x, setX] = useState(0); // 마우스 현재 X 좌표
  const [y, setY] = useState(0); // 마우스 현재 Y 좌표
  const [tempCopySeat, setTempCopySeat] = useState<Seat | null>(null);
  const [history, setHistory] = useState<Seat[][]>([seats]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const seatWidth = 60;
  const seatHeight = 60;
  const gridSize = 5; // 격자 크기

  // 좌석을 격자에 맞춰 정렬하는 함수
  const snapToGrid = (x: number, y: number): { x: number; y: number } => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // tempCopySeat가 있을 때는 클릭 기능을 비활성화
    if (isCopyMode || tempCopySeat) return;

    if (isDragging || resizingSeatId || rotatingSeatId) {
      setIsDragging(false);
      setResizingSeatId(null);
      setRotatingSeatId(null);
      return;
    }

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭된 좌석이 있는지 확인
    const clickedSeat = seats.find((seat) => {
      const centerX = seat.x + seat.width / 2;
      const centerY = seat.y + seat.height / 2;
      const rotatedX =
        (x - centerX) * Math.cos((-seat.rotation * Math.PI) / 180) -
        (y - centerY) * Math.sin((-seat.rotation * Math.PI) / 180) +
        centerX;
      const rotatedY =
        (x - centerX) * Math.sin((-seat.rotation * Math.PI) / 180) +
        (y - centerY) * Math.cos((-seat.rotation * Math.PI) / 180) +
        centerY;

      return (
        rotatedX >= seat.x &&
        rotatedX <= seat.x + seat.width &&
        rotatedY >= seat.y &&
        rotatedY <= seat.y + seat.height
      );
    });

    if (clickedSeat) {
      const centerX = clickedSeat.x + clickedSeat.width / 2;
      const centerY = clickedSeat.y + clickedSeat.height / 2;
      const rotatedX =
        (x - centerX) * Math.cos((-clickedSeat.rotation * Math.PI) / 180) -
        (y - centerY) * Math.sin((-clickedSeat.rotation * Math.PI) / 180) +
        centerX;
      const rotatedY =
        (x - centerX) * Math.sin((-clickedSeat.rotation * Math.PI) / 180) +
        (y - centerY) * Math.cos((-clickedSeat.rotation * Math.PI) / 180) +
        centerY;

      if (rotatedX <= clickedSeat.x + 20 && rotatedY <= clickedSeat.y + 20) {
        // 좌상단: 회전 모드
        setRotatingSeatId(clickedSeat.id);
      } else if (
        rotatedX >= clickedSeat.x + clickedSeat.width - 20 &&
        rotatedY <= clickedSeat.y + 20
      ) {
        // 우상단: 삭제
        if (window.confirm(`"${clickedSeat.id}" 좌석을 삭제하시겠습니까?`)) {
          setSeats((prev) => prev.filter((seat) => seat.id !== clickedSeat.id));
        }
      } else if (
        rotatedX <= clickedSeat.x + 20 &&
        rotatedY >= clickedSeat.y + clickedSeat.height - 20
      ) {
        // 좌하단: 이름 변경
        const newId = prompt("새 좌석 이름을 입력하세요:", clickedSeat.id);
        if (newId !== null && newId.trim() !== "") {
          setSeats((prev) =>
            prev.map((seat) =>
              seat.id === clickedSeat.id ? { ...seat, id: newId } : seat
            )
          );
        }
      } else if (
        rotatedX >= clickedSeat.x + clickedSeat.width - 20 &&
        rotatedY >= clickedSeat.y + clickedSeat.height - 20
      ) {
        // 우하단: 크기 조정 모드
        setResizingSeatId(clickedSeat.id);
      }
    } else if (!isCopyMode) {
      // 복사 모드가 아닐 때만 새로운 좌석 생성
      // 격자에 맞춰 정렬
      const snapped = snapToGrid(x - seatWidth / 2, y - seatHeight / 2);
      const newSeat: Seat = {
        id: `S${seats.length + 1}`,
        x: snapped.x,
        y: snapped.y,
        width: seatWidth,
        height: seatHeight,
        rotation: 0,
      };

      // 충돌 검사 로직 제거
      setSeats((prev) => [...prev, newSeat]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ctrl 키가 눌린 상태라면 복사 모드 활성화
    if (e.ctrlKey) {
      setIsCopyMode(true);

      // 클릭한 위치에 가장 가까운 좌석 찾기
      const closestSeat = seats.find((seat) => {
        const centerX = seat.x + seat.width / 2;
        const centerY = seat.y + seat.height / 2;
        const rotatedX =
          (x - centerX) * Math.cos((-seat.rotation * Math.PI) / 180) -
          (y - centerY) * Math.sin((-seat.rotation * Math.PI) / 180) +
          centerX;
        const rotatedY =
          (x - centerX) * Math.sin((-seat.rotation * Math.PI) / 180) +
          (y - centerY) * Math.cos((-seat.rotation * Math.PI) / 180) +
          centerY;

        return (
          rotatedX >= seat.x &&
          rotatedX <= seat.x + seat.width &&
          rotatedY >= seat.y &&
          rotatedY <= seat.y + seat.height
        );
      });

      if (closestSeat) {
        setTempCopySeat({
          ...closestSeat,
          id: `${closestSeat.id}`,
          x: closestSeat.x,
          y: closestSeat.y,
        });
        setDraggingSeatId(`${closestSeat.id}`);
        setOffset({ x: x - closestSeat.x, y: y - closestSeat.y });
      }
    } else {
      // 기존 드래그 로직
      for (const seat of seats) {
        if (
          x >= seat.x &&
          x <= seat.x + seat.width &&
          y >= seat.y &&
          y <= seat.y + seat.height
        ) {
          setDraggingSeatId(seat.id);
          setOffset({ x: x - seat.x, y: y - seat.y });
          return;
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setX(mouseX);
    setY(mouseY);

    // hover된 좌석 확인 (tempCopySeat는 제외)
    const hoveredSeat = seats.find((seat) => {
      const centerX = seat.x + seat.width / 2;
      const centerY = seat.y + seat.height / 2;
      const rotatedX =
        (mouseX - centerX) * Math.cos((-seat.rotation * Math.PI) / 180) -
        (mouseY - centerY) * Math.sin((-seat.rotation * Math.PI) / 180) +
        centerX;
      const rotatedY =
        (mouseX - centerX) * Math.sin((-seat.rotation * Math.PI) / 180) +
        (mouseY - centerY) * Math.cos((-seat.rotation * Math.PI) / 180) +
        centerY;

      return (
        rotatedX >= seat.x &&
        rotatedX <= seat.x + seat.width &&
        rotatedY >= seat.y &&
        rotatedY <= seat.y + seat.height
      );
    });

    setHoveredSeatId(hoveredSeat?.id || null);

    if (draggingSeatId && tempCopySeat) {
      // 임시 복사본 이동
      const snapped = snapToGrid(mouseX - offset.x, mouseY - offset.y);
      setTempCopySeat({
        ...tempCopySeat,
        x: snapped.x,
        y: snapped.y,
      });
    } else if (draggingSeatId) {
      // 일반 드래그
      const snapped = snapToGrid(mouseX - offset.x, mouseY - offset.y);
      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === draggingSeatId
            ? { ...seat, x: snapped.x, y: snapped.y }
            : seat
        )
      );
    } else if (resizingSeatId) {
      // 크기 조정 모드
      const seat = seats.find((s) => s.id === resizingSeatId);
      if (seat) {
        let newWidth = Math.max(20, mouseX - seat.x);
        let newHeight = Math.max(20, mouseY - seat.y);
        // Shift 키가 눌린 상태라면 가로와 세로 길이를 동일하게 조정
        if (e.shiftKey) {
          const maxSize = Math.max(newWidth, newHeight);
          newWidth = maxSize;
          newHeight = maxSize;
        }
        setSeats((prev) =>
          prev.map((s) =>
            s.id === resizingSeatId
              ? { ...s, width: newWidth, height: newHeight }
              : s
          )
        );
      }
    } else if (rotatingSeatId) {
      // 회전 모드
      const seat = seats.find((s) => s.id === rotatingSeatId);
      if (seat) {
        const centerX = seat.x + seat.width / 2;
        const centerY = seat.y + seat.height / 2;
        let angle =
          Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        // Shift 키가 눌린 상태라면 각도를 5도 단위로 조정
        if (e.shiftKey) {
          angle = Math.round(angle / 10) * 5;
        }

        setSeats((prev) =>
          prev.map((s) =>
            s.id === rotatingSeatId ? { ...s, rotation: angle } : s
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingSeatId && tempCopySeat) {
      // 임시 복사본을 실제 좌석 목록에 추가
      const newSeat: Seat = {
        ...tempCopySeat,
        id: `S${seats.length + 1}`,
      };

      // 충돌 검사 로직 제거
      setSeats((prev) => [...prev, newSeat]);

      // 임시 복사본 초기화
      setTempCopySeat(null);
    }

    setDraggingSeatId(null);
    setIsCopyMode(false);
  };

  // 되돌리기
  useEffect(() => {
    if (
      !isDragging &&
      !resizingSeatId &&
      !rotatingSeatId &&
      !draggingSeatId &&
      seats !== history[historyIndex]
    ) {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), seats]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [
    seats,
    isDragging,
    resizingSeatId,
    rotatingSeatId,
    draggingSeatId,
    history,
    historyIndex,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          if (historyIndex > 0) {
            setHistoryIndex((prev) => prev - 1);
            setSeats(history[historyIndex - 1]);
          }
        } else if (e.key === "Z" && e.shiftKey) {
          e.preventDefault();
          if (historyIndex < history.length - 1) {
            setHistoryIndex((prev) => prev + 1);
            setSeats(history[historyIndex + 1]);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, historyIndex, setSeats]);

  // 새로운 좌석 추가 핸들러
  const handleAddSeat = () => {
    // 캔버스 중앙에 좌석 생성
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2 - seatWidth / 2;
    const centerY = canvas.height / 2 - seatHeight / 2;

    const snapped = snapToGrid(centerX, centerY);
    const newSeat: Seat = {
      id: `S${seats.length + 1}`,
      x: snapped.x,
      y: snapped.y,
      width: seatWidth,
      height: seatHeight,
      rotation: 0,
    };

    // 좌석 추가
    setSeats((prev) => [...prev, newSeat]);
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{
          border: "1px solid #ccc",
          cursor: isCopyMode ? "copy" : draggingSeatId ? "grabbing" : "pointer",
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <CanvasRender
        canvasRef={canvasRef}
        seats={tempCopySeat ? [...seats, tempCopySeat] : seats}
        hoveredSeatId={hoveredSeatId}
        x={x}
        y={y}
        gridSize={gridSize}
        tempCopySeat={tempCopySeat}
        onAddSeat={handleAddSeat}
      />
    </div>
  );
}
