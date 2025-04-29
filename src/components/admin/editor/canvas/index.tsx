import { useEffect, useRef, useState } from "react";
import { Seat } from "@/types/Seat";
import CanvasRender from "./CanvasRender";

interface Props {
  onSvgPathsChange: (paths: string[]) => void;
}

interface SeatingCanvasProps {
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
}

export default function SeatingCanvas({
  seats,
  setSeats,
  onSvgPathsChange,
}: SeatingCanvasProps & Props) {
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
  const [tempCopySeat, setTempCopySeat] = useState<Seat | null>(null); // 복사한 개체
  const [history, setHistory] = useState<Seat[][]>([seats]); // 되돌리기 기능을 위한 히스토리
  const [historyIndex, setHistoryIndex] = useState(0); // 히스토리 카운트
  const [gridSize, setGridSize] = useState<number>(10); // 격자 크기
  const [svgPaths, setSvgPaths] = useState<string[]>([]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploadConvert", {
        method: "POST",
        body: formData,
      });
      const { svg } = await response.json();

      // Parse SVG and extract paths
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const paths = Array.from(doc.querySelectorAll("path")).map(
        (path) => path.getAttribute("d") || ""
      );

      setSvgPaths(paths);
      onSvgPathsChange(paths); // Notify parent component
    } catch (error) {
      console.error("Failed to upload and convert image:", error);
    }
  };

  // Draw SVG paths on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw SVG paths
    ctx.save();
    ctx.translate(0, 0);
    ctx.scale(1, 1);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    svgPaths.forEach((path) => {
      const path2D = new Path2D(path);
      ctx.stroke(path2D);
    });

    ctx.restore();
  }, [svgPaths]);

  // 새로운 좌석 추가 핸들러
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);
  const [tempNewSeat, setTempNewSeat] = useState<Seat | null>(null);

  const handleAddSeat = () => {
    setIsAddingMode(true);

    // 임시 좌석을 마우스 위치에 생성
    const newSeatId = `S${seats.length + 1}`;
    setTempNewSeat({
      id: newSeatId,
      x: x,
      y: y,
      width: 60, // 초기 크기는 작게 설정
      height: 60,
      rotation: 0,
    });

    // 리사이징 모드로 설정
    setResizingSeatId(newSeatId);
  };

  // 좌석 추가 모드에서 마우스 클릭 처리
  const handleAddModeClick = () => {
    if (tempNewSeat && isAddingMode) {
      // 좌석 추가
      setSeats((prev) => [...prev, tempNewSeat]);
      setTempNewSeat(null);
      setIsAddingMode(false);
      setResizingSeatId(null);
    }
  };

  // CanvasRender 컴포넌트의 onAddSeat prop을 통해 호출됨
  // CanvasRender 내의 버튼 클릭시 활성화되어
  // 마우스가 캔버스 위에서 + 커서로 변경되고
  // 클릭 후 드래그하여 좌석 크기를 조정할 수 있음

  // 좌석을 격자에 맞춰 정렬
  const snapToGrid = (x: number, y: number): { x: number; y: number } => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // tempCopySeat가 있을 때는 클릭 기능을 비활성화
    if (isCopyMode || tempCopySeat) return;

    if (isAddingMode) {
      handleAddModeClick();
      return;
    }

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

          // Shift와 Alt 키를 동시에 누른 경우 격자 크기에 맞게 조정
          if (e.altKey) {
            newWidth = Math.round(newWidth / gridSize) * gridSize;
            newHeight = Math.round(newHeight / gridSize) * gridSize;
          }
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
      setSeats((prev) => [...prev, newSeat]);
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

  return (
    <div style={{ position: "relative" }}>
      <div>
        <label style={{ fontSize: "14px" }}>격자 크기</label>
        <select
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          style={{ margin: "10px" }}
        >
          {[5, 10, 15, 20, 25].map((n) => (
            <option key={n} value={n}>
              {n}px
            </option>
          ))}
        </select>
      </div>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{
          border: "1px solid #ccc",
          cursor: isCopyMode
            ? "copy"
            : isAddingMode
            ? "crosshair"
            : draggingSeatId
            ? "grabbing"
            : "pointer",
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
        svgPaths={svgPaths}
      />
    </div>
  );
}
