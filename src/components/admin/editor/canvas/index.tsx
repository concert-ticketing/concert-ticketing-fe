import { useEffect, useRef, useState } from "react";
import { Seat } from "@/types/Seat";

interface SeatingCanvasProps {
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
}

export default function SeatingCanvas({ seats, setSeats }: SeatingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingSeatId, setDraggingSeatId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);
  const [resizingSeatId, setResizingSeatId] = useState<string | null>(null);
  const [rotatingSeatId, setRotatingSeatId] = useState<string | null>(null);
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // 이미지 상태
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [rotateIcon, setRotateIcon] = useState<HTMLImageElement | null>(null);
  const [deleteIcon, setDeleteIcon] = useState<HTMLImageElement | null>(null);
  const [resizeIcon, setResizeIcon] = useState<HTMLImageElement | null>(null);
  const [renameIcon, setRenameIcon] = useState<HTMLImageElement | null>(null);

  const seatWidth = 60;
  const seatHeight = 60;
  const gridSize = 5; // 격자 크기 (픽셀 단위)

  // 이미지 로드
  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    Promise.all([
      loadImage("/icons/rotate.svg"),
      loadImage("/icons/delete.svg"),
      loadImage("/icons/resize.svg"),
      loadImage("/icons/rename.svg"),
    ])
      .then(([rotate, del, resize, rename]) => {
        setRotateIcon(rotate);
        setDeleteIcon(del);
        setResizeIcon(resize);
        setRenameIcon(rename);
        setIconsLoaded(true);
      })
      .catch((error) => {
        console.error("아이콘 로드 실패:", error);
      });
  }, []);

  // 좌석이 겹치는지 확인하는 함수
  const isSeatOverlapping = (
    newSeat: Seat,
    excludeSeatId?: string
  ): boolean => {
    return seats.some((seat) => {
      if (seat.id === excludeSeatId) return false; // 자기 자신은 제외
      return (
        newSeat.x < seat.x + seat.width &&
        newSeat.x + newSeat.width > seat.x &&
        newSeat.y < seat.y + seat.height &&
        newSeat.y + newSeat.height > seat.y
      );
    });
  };

  // 좌석을 격자에 맞춰 정렬하는 함수
  const snapToGrid = (x: number, y: number): { x: number; y: number } => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  // 버튼 hover 상태 확인 함수
  const isMouseOverButton = (
    mouseX: number,
    mouseY: number,
    seat: Seat,
    buttonType: string
  ): boolean => {
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

    switch (buttonType) {
      case "rotate":
        return rotatedX <= seat.x + 20 && rotatedY <= seat.y + 20;
      case "delete":
        return rotatedX >= seat.x + seat.width - 20 && rotatedY <= seat.y + 20;
      case "rename":
        return rotatedX <= seat.x + 20 && rotatedY >= seat.y + seat.height - 20;
      case "resize":
        return (
          rotatedX >= seat.x + seat.width - 20 &&
          rotatedY >= seat.y + seat.height - 20
        );
      default:
        return false;
    }
  };

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !iconsLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 격자 그리기
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"; // 격자 색상
    ctx.lineWidth = 1;

    // 수직선 그리기
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // 수평선 그리기
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 좌석 그리기
    seats.forEach((seat) => {
      ctx.save();
      ctx.translate(seat.x + seat.width / 2, seat.y + seat.height / 2);
      ctx.rotate((seat.rotation * Math.PI) / 180);
      ctx.translate(-seat.width / 2, -seat.height / 2);

      // 좌석 그리기
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, seat.width, seat.height);
      ctx.strokeStyle = "black";
      ctx.strokeRect(0, 0, seat.width, seat.height);

      // 좌석 번호(id)를 중앙에 그리기
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(seat.id, seat.width / 2, seat.height / 2);

      // hover된 좌석에 컨트롤 버튼 그리기
      if (
        seat.id === hoveredSeatId &&
        rotateIcon &&
        deleteIcon &&
        resizeIcon &&
        renameIcon
      ) {
        const buttonSize = 20;
        const hoverColor = "rgba(0, 0, 0, 0.5)";

        // 회전 버튼 (좌상단)
        ctx.fillStyle = isMouseOverButton(x, y, seat, "rotate")
          ? hoverColor
          : "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(0, 0, buttonSize, buttonSize);
        ctx.drawImage(rotateIcon, 2, 2, 16, 16);

        // 삭제 버튼 (우상단)
        ctx.fillStyle = isMouseOverButton(x, y, seat, "delete")
          ? hoverColor
          : "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(seat.width - buttonSize, 0, buttonSize, buttonSize);
        ctx.drawImage(deleteIcon, seat.width - 18, 2, 16, 16);

        // 이름 변경 버튼 (좌하단)
        ctx.fillStyle = isMouseOverButton(x, y, seat, "rename")
          ? hoverColor
          : "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(0, seat.height - buttonSize, buttonSize, buttonSize);
        ctx.drawImage(renameIcon, 2, seat.height - 18, 16, 16);

        // 크기 조정 버튼 (우하단)
        ctx.fillStyle = isMouseOverButton(x, y, seat, "resize")
          ? hoverColor
          : "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(
          seat.width - buttonSize,
          seat.height - buttonSize,
          buttonSize,
          buttonSize
        );
        ctx.drawImage(resizeIcon, seat.width - 18, seat.height - 18, 16, 16);
      }

      ctx.restore();
    });
  }, [
    seats,
    hoveredSeatId,
    x,
    y,
    iconsLoaded,
    rotateIcon,
    deleteIcon,
    resizeIcon,
    renameIcon,
  ]);

  const handleCanvasClick = (e: React.MouseEvent) => {
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
        // 좌상단: 회전
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
        // 우하단: 크기 조정
        setResizingSeatId(clickedSeat.id);
      }
    } else {
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

      // 충돌 검사 - 겹치는 경우 자동으로 위치 조정
      const adjustedSeat = { ...newSeat };
      let attempts = 0;
      const maxAttempts = 10; // 최대 시도 횟수
      const offsetStep = 20; // 한 번에 이동할 거리

      while (isSeatOverlapping(adjustedSeat) && attempts < maxAttempts) {
        // 겹치는 경우 약간씩 이동시켜 보기
        adjustedSeat.x += offsetStep;

        // 캔버스 경계를 넘어가면 다음 줄로
        if (adjustedSeat.x > canvasRef.current!.width - adjustedSeat.width) {
          adjustedSeat.x = gridSize;
          adjustedSeat.y += offsetStep;
        }

        attempts++;
      }

      if (attempts < maxAttempts) {
        // 겹치지 않는 위치를 찾은 경우
        setSeats((prev) => [...prev, adjustedSeat]);
      } else {
        alert(
          "좌석을 배치할 공간이 부족합니다. 좌석을 정리한 후 다시 시도해주세요."
        );
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
      const closestSeat = seats.reduce<{ seat: Seat | null; distance: number }>(
        (closest, seat) => {
          const distance = Math.sqrt(
            Math.pow(seat.x - x, 2) + Math.pow(seat.y - y, 2)
          );
          return distance < closest.distance ? { seat, distance } : closest;
        },
        { seat: null, distance: Infinity }
      ).seat;

      if (closestSeat) {
        // 복사할 좌석 생성 (모든 속성 복사)
        const newSeat: Seat = {
          ...closestSeat,
          id: `S${seats.length + 1}`, // 새로운 ID 부여
          x: x - closestSeat.width / 2, // 클릭 위치를 중심으로 배치
          y: y - closestSeat.height / 2,
        };

        // 충돌 검사 및 위치 조정
        const adjustedSeat = { ...newSeat };
        let attempts = 0;
        const maxAttempts = 10;
        const offsetStep = 20;

        while (isSeatOverlapping(adjustedSeat) && attempts < maxAttempts) {
          adjustedSeat.x += offsetStep;
          if (adjustedSeat.x > canvasRef.current!.width - adjustedSeat.width) {
            adjustedSeat.x = gridSize;
            adjustedSeat.y += offsetStep;
          }
          attempts++;
        }

        if (attempts < maxAttempts) {
          setSeats((prev) => [...prev, adjustedSeat]);
        } else {
          alert(
            "복사할 공간이 부족합니다. 좌석을 정리한 후 다시 시도해주세요."
          );
        }
      }
      return;
    }

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
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setX(mouseX);
    setY(mouseY);

    // Ctrl 키가 눌린 상태라면 복사 모드 활성화
    if (e.ctrlKey) {
      setIsCopyMode(true);
    } else {
      setIsCopyMode(false);
    }

    // hover된 좌석 확인
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

    if (draggingSeatId) {
      setIsDragging(true);
      const snapped = snapToGrid(mouseX - offset.x, mouseY - offset.y);

      // 이동할 좌석의 임시 위치 계산
      const tempSeat = {
        ...seats.find((seat) => seat.id === draggingSeatId)!,
        x: snapped.x,
        y: snapped.y,
      };

      // 충돌 검사
      if (!isSeatOverlapping(tempSeat, draggingSeatId)) {
        setSeats((prev) =>
          prev.map((seat) =>
            seat.id === draggingSeatId
              ? {
                  ...seat,
                  x: snapped.x,
                  y: snapped.y,
                }
              : seat
          )
        );
      }
    } else if (resizingSeatId) {
      const seat = seats.find((s) => s.id === resizingSeatId);
      if (seat) {
        const newWidth = Math.max(20, mouseX - seat.x);
        const newHeight = Math.max(20, mouseY - seat.y);

        // 크기 조정 시 충돌 검사
        const tempSeat = { ...seat, width: newWidth, height: newHeight };
        if (!isSeatOverlapping(tempSeat, resizingSeatId)) {
          setSeats((prev) =>
            prev.map((s) =>
              s.id === resizingSeatId
                ? {
                    ...s,
                    width: newWidth,
                    height: newHeight,
                  }
                : s
            )
          );
        }
      }
    } else if (rotatingSeatId) {
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
    setDraggingSeatId(null);
    setIsCopyMode(false);
  };

  return (
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
  );
}
