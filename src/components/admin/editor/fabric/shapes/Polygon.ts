import * as fabric from "fabric";

interface Point {
  x: number;
  y: number;
}

let isDrawingPolygon: boolean = false;
let polygonPoints: Point[] = [];
let previewLine: fabric.Line | null = null;
let boundMouseMoveHandler: ((opt: fabric.TEvent) => void) | null = null;
let isShiftPressed: boolean = false;

// Shift 키 상태 추적을 위한 이벤트 리스너
function setupKeyListeners(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
      isShiftPressed = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
      isShiftPressed = false;
    }
  });
}

// 각도 스냅 함수 - 가장 가까운 8방향(45도 간격)으로 스냅
function snapToAngle(startPoint: Point, currentPoint: Point): Point {
  if (!isShiftPressed) {
    return currentPoint;
  }

  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return currentPoint;
  }

  // 현재 각도 계산 (라디안)
  const currentAngle = Math.atan2(dy, dx);

  // 8방향 각도 (45도 간격)
  const snapAngles = [
    0, // 0° (수평 오른쪽)
    Math.PI / 4, // 45°
    Math.PI / 2, // 90° (수직 위쪽)
    (3 * Math.PI) / 4, // 135°
    Math.PI, // 180° (수평 왼쪽)
    -(3 * Math.PI) / 4, // -135° (225°)
    -Math.PI / 2, // -90° (270°, 수직 아래쪽)
    -Math.PI / 4, // -45° (315°)
  ];

  // 가장 가까운 스냅 각도 찾기
  let closestAngle = snapAngles[0];
  let minDifference = Math.abs(currentAngle - snapAngles[0]);

  for (const snapAngle of snapAngles) {
    const difference = Math.abs(currentAngle - snapAngle);
    const wrappedDifference = Math.abs(currentAngle - snapAngle + 2 * Math.PI);
    const wrappedDifference2 = Math.abs(currentAngle - snapAngle - 2 * Math.PI);

    const actualDifference = Math.min(
      difference,
      wrappedDifference,
      wrappedDifference2
    );

    if (actualDifference < minDifference) {
      minDifference = actualDifference;
      closestAngle = snapAngle;
    }
  }

  // 스냅된 좌표 계산
  const snappedX = startPoint.x + distance * Math.cos(closestAngle);
  const snappedY = startPoint.y + distance * Math.sin(closestAngle);

  return { x: snappedX, y: snappedY };
}

export function addPolygonFn(
  canvas: fabric.Canvas,
  x: number,
  y: number,
  setSelectedTool: (
    tool: "rect" | "circle" | "text" | "group" | "polygon" | null
  ) => void
): void {
  // 키 리스너가 설정되지 않았다면 설정
  setupKeyListeners();

  // Shift 키가 눌렸다면 각도 스냅 적용
  let snappedPoint = { x, y };
  if (isShiftPressed && polygonPoints.length > 0) {
    const lastPoint = polygonPoints[polygonPoints.length - 1];
    snappedPoint = snapToAngle(lastPoint, { x, y });
  }

  if (!isDrawingPolygon) {
    // 폴리곤 그리기 시작
    startPolygonDrawing(canvas, snappedPoint.x, snappedPoint.y);
  } else {
    // 점 추가
    addPointToPolygon(canvas, snappedPoint.x, snappedPoint.y, setSelectedTool);
  }
}

function startPolygonDrawing(
  canvas: fabric.Canvas,
  x: number,
  y: number
): void {
  isDrawingPolygon = true;
  polygonPoints = [{ x, y }];

  // 첫 번째 점 표시
  const firstPoint = new fabric.Circle({
    left: x - 3,
    top: y - 3,
    radius: 3,
    fill: "red",
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    hoverCursor: "pointer",
  });

  // id 속성을 별도로 설정
  (firstPoint as fabric.Object & { id?: string }).id = "polygon-point-first";

  canvas.add(firstPoint);
  canvas.renderAll();

  // 마우스 움직임 이벤트 등록
  boundMouseMoveHandler = (opt: fabric.TEvent): void => {
    if (!isDrawingPolygon || polygonPoints.length === 0) return;

    // Use the 'canvas' instance from the closure
    const pointer = canvas.getPointer(opt.e);

    // Shift 키가 눌렸다면 각도 스냅 적용
    const lastPoint = polygonPoints[polygonPoints.length - 1];
    const snappedPointer = isShiftPressed
      ? snapToAngle(lastPoint, pointer)
      : pointer;

    // 기존 프리뷰 라인 제거
    if (previewLine) {
      canvas.remove(previewLine);
    }

    // 마지막 점에서 현재 마우스 위치까지 프리뷰 라인 그리기
    previewLine = new fabric.Line(
      [lastPoint.x, lastPoint.y, snappedPointer.x, snappedPointer.y],
      {
        stroke: isShiftPressed
          ? "rgba(0, 255, 0, 0.7)"
          : "rgba(255, 0, 0, 0.5)", // Shift시 녹색으로 표시
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    );

    // id 속성을 별도로 설정
    (previewLine as fabric.Object & { id?: string }).id = "preview-line";

    canvas.add(previewLine);
    canvas.renderAll();
  };

  canvas.on("mouse:move", boundMouseMoveHandler);
}

function addPointToPolygon(
  canvas: fabric.Canvas,
  x: number,
  y: number,
  setSelectedTool: (
    tool: "rect" | "circle" | "text" | "group" | "polygon" | null
  ) => void
): void {
  const firstPoint = polygonPoints[0];
  const threshold = 10; // 첫 점과의 거리 임계값

  // 첫 점 근처를 클릭하면 폴리곤 완성
  if (polygonPoints.length >= 3) {
    const distance = Math.sqrt(
      Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2)
    );

    if (distance < threshold) {
      finishPolygon(canvas, setSelectedTool);
      return;
    }
  }

  // 새 점 추가
  polygonPoints.push({ x, y });

  // 이전 점과 연결하는 라인 그리기
  if (polygonPoints.length > 1) {
    const prevPoint = polygonPoints[polygonPoints.length - 2];
    const line = new fabric.Line([prevPoint.x, prevPoint.y, x, y], {
      stroke: "red",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });

    // id 속성을 별도로 설정
    (line as fabric.Object & { id?: string }).id = `polygon-line-${
      polygonPoints.length - 1
    }`;

    canvas.add(line);
  }

  // 새 점 표시
  const point = new fabric.Circle({
    left: x - 3,
    top: y - 3,
    radius: 3,
    fill: "#ff0000",
    stroke: "#ff0000",
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });

  // id 속성을 별도로 설정
  (
    point as fabric.Object & { id?: string }
  ).id = `polygon-point-${polygonPoints.length}`;

  canvas.add(point);
  canvas.renderAll();
}

function finishPolygon(
  canvas: fabric.Canvas,
  setSelectedTool: (
    tool: "rect" | "circle" | "text" | "group" | "polygon" | null
  ) => void
): void {
  if (polygonPoints.length < 3) return;

  // 임시 요소들 제거
  cleanupTempElements(canvas);

  // 폴리곤 객체 생성
  const polygon = new fabric.Polygon(polygonPoints, {
    left: Math.min(...polygonPoints.map((p) => p.x)),
    top: Math.min(...polygonPoints.map((p) => p.y)),
    fill: "rgba(0, 255, 0, 0.3)",
    stroke: "#0000ff",
    strokeWidth: 1,
    selectable: true,
    evented: true,
  });

  polygon.id = `polygon-${Date.now()}`;
  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.renderAll();

  // 상태 초기화
  resetPolygonState(canvas);
  setSelectedTool(null);
}

function cleanupTempElements(canvas: fabric.Canvas): void {
  // 임시 점들과 라인들 제거
  const objectsToRemove = canvas.getObjects().filter((obj: fabric.Object) => {
    const objectWithId = obj as fabric.Object & { id?: string };
    return (
      objectWithId.id &&
      (objectWithId.id.startsWith("polygon-point") ||
        objectWithId.id.startsWith("polygon-line") ||
        objectWithId.id === "preview-line")
    );
  });

  objectsToRemove.forEach((obj) => canvas.remove(obj));
}

function resetPolygonState(canvas: fabric.Canvas): void {
  isDrawingPolygon = false;
  polygonPoints = [];
  previewLine = null;

  // 이벤트 리스너 제거
  if (boundMouseMoveHandler) {
    canvas.off("mouse:move", boundMouseMoveHandler);
    boundMouseMoveHandler = null;
  }
}

// ESC 키로 폴리곤 그리기 취소
export function cancelPolygonDrawing(
  canvas: fabric.Canvas,
  setSelectedTool: (
    tool: "rect" | "circle" | "text" | "group" | "polygon" | null
  ) => void
): void {
  if (isDrawingPolygon) {
    cleanupTempElements(canvas);
    resetPolygonState(canvas);
    setSelectedTool(null);
    canvas.renderAll();
  }
}

// 폴리곤 그리기 상태 확인
export function isPolygonDrawing(): boolean {
  return isDrawingPolygon;
}

// Shift 키 상태 확인 (디버깅용)
export function isShiftKeyPressed(): boolean {
  return isShiftPressed;
}
