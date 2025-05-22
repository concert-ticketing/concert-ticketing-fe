// import { useEffect, useState } from "react";
// import { Seat } from "@/types/Seat";

// interface SeatCanvasRendererProps {
//   canvasRef: React.RefObject<HTMLCanvasElement | null>;
//   seats: Seat[];
//   tempCopySeat: Seat | null;
//   hoveredSeatId: string | null;
//   x: number;
//   y: number;
//   gridSize: number;
//   onAddSeat: () => void; // 새로운 좌석 추가 핸들러
// }

// export default function CanvasRender({
//   canvasRef,
//   seats,
//   tempCopySeat,
//   hoveredSeatId,
//   x,
//   y,
//   gridSize,
//   onAddSeat, // 새로운 좌석 추가 핸들러
// }: SeatCanvasRendererProps) {
//   // 이미지 상태
//   const [iconsLoaded, setIconsLoaded] = useState(false);
//   const [rotateIcon, setRotateIcon] = useState<HTMLImageElement | null>(null);
//   const [deleteIcon, setDeleteIcon] = useState<HTMLImageElement | null>(null);
//   const [resizeIcon, setResizeIcon] = useState<HTMLImageElement | null>(null);
//   const [renameIcon, setRenameIcon] = useState<HTMLImageElement | null>(null);

//   // 이미지 로드
//   useEffect(() => {
//     const loadImage = (src: string): Promise<HTMLImageElement> => {
//       return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.src = src;
//         img.onload = () => resolve(img);
//         img.onerror = reject;
//       });
//     };

//     Promise.all([
//       loadImage("/icons/rotate.svg"),
//       loadImage("/icons/delete.svg"),
//       loadImage("/icons/resize.svg"),
//       loadImage("/icons/rename.svg"),
//     ])
//       .then(([rotate, del, resize, rename]) => {
//         setRotateIcon(rotate);
//         setDeleteIcon(del);
//         setResizeIcon(resize);
//         setRenameIcon(rename);
//         setIconsLoaded(true);
//       })
//       .catch((error) => {
//         console.error("아이콘 로드 실패:", error);
//       });
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !iconsLoaded) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // 격자 그리기
//     ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
//     ctx.lineWidth = 1;

//     // 수직선 그리기
//     for (let x = 0; x <= canvas.width; x += gridSize) {
//       ctx.beginPath();
//       ctx.moveTo(x, 0);
//       ctx.lineTo(x, canvas.height);
//       ctx.stroke();
//     }

//     // 수평선 그리기
//     for (let y = 0; y <= canvas.height; y += gridSize) {
//       ctx.beginPath();
//       ctx.moveTo(0, y);
//       ctx.lineTo(canvas.width, y);
//       ctx.stroke();
//     }

//     // 좌석 그리기
//     seats.forEach((seat) => {
//       ctx.save();
//       ctx.translate(seat.x + seat.width / 2, seat.y + seat.height / 2);
//       ctx.rotate((seat.rotation * Math.PI) / 180);
//       ctx.translate(-seat.width / 2, -seat.height / 2);

//       // 좌석 그리기
//       ctx.fillStyle = "skyblue";
//       ctx.fillRect(0, 0, seat.width, seat.height);
//       ctx.strokeStyle = "black";
//       ctx.strokeRect(0, 0, seat.width, seat.height);

//       // 좌석 번호(id)를 중앙에 그리기
//       ctx.fillStyle = "black";
//       ctx.font = "12px sans-serif";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(seat.id, seat.width / 2, seat.height / 2);

//       // hover된 좌석에 컨트롤 버튼 그리기
//       if (
//         seat.id === hoveredSeatId &&
//         rotateIcon &&
//         deleteIcon &&
//         resizeIcon &&
//         renameIcon
//       ) {
//         const buttonSize = 20;
//         const hoverColor = "rgba(0, 0, 0, 0.5)";

//         // 버튼 hover 상태 확인 함수
//         const isMouseOverButton = (
//           mouseX: number,
//           mouseY: number,
//           seat: Seat,
//           buttonType: string
//         ): boolean => {
//           const centerX = seat.x + seat.width / 2;
//           const centerY = seat.y + seat.height / 2;
//           const rotatedX =
//             (mouseX - centerX) * Math.cos((-seat.rotation * Math.PI) / 180) -
//             (mouseY - centerY) * Math.sin((-seat.rotation * Math.PI) / 180) +
//             centerX;
//           const rotatedY =
//             (mouseX - centerX) * Math.sin((-seat.rotation * Math.PI) / 180) +
//             (mouseY - centerY) * Math.cos((-seat.rotation * Math.PI) / 180) +
//             centerY;

//           switch (buttonType) {
//             case "rotate":
//               return rotatedX <= seat.x + 20 && rotatedY <= seat.y + 20;
//             case "delete":
//               return (
//                 rotatedX >= seat.x + seat.width - 20 && rotatedY <= seat.y + 20
//               );
//             case "rename":
//               return (
//                 rotatedX <= seat.x + 20 && rotatedY >= seat.y + seat.height - 20
//               );
//             case "resize":
//               return (
//                 rotatedX >= seat.x + seat.width - 20 &&
//                 rotatedY >= seat.y + seat.height - 20
//               );
//             default:
//               return false;
//           }
//         };

//         // 회전 버튼 (좌상단)
//         ctx.fillStyle = isMouseOverButton(x, y, seat, "rotate")
//           ? hoverColor
//           : "rgba(255, 255, 255, 0.8)";
//         ctx.fillRect(0, 0, buttonSize, buttonSize);
//         ctx.drawImage(rotateIcon, 2, 2, 16, 16);

//         // 삭제 버튼 (우상단)
//         ctx.fillStyle = isMouseOverButton(x, y, seat, "delete")
//           ? hoverColor
//           : "rgba(255, 255, 255, 0.8)";
//         ctx.fillRect(seat.width - buttonSize, 0, buttonSize, buttonSize);
//         ctx.drawImage(deleteIcon, seat.width - 18, 2, 16, 16);

//         // 이름 변경 버튼 (좌하단)
//         ctx.fillStyle = isMouseOverButton(x, y, seat, "rename")
//           ? hoverColor
//           : "rgba(255, 255, 255, 0.8)";
//         ctx.fillRect(0, seat.height - buttonSize, buttonSize, buttonSize);
//         ctx.drawImage(renameIcon, 2, seat.height - 18, 16, 16);

//         // 크기 조정 버튼 (우하단)
//         ctx.fillStyle = isMouseOverButton(x, y, seat, "resize")
//           ? hoverColor
//           : "rgba(255, 255, 255, 0.8)";
//         ctx.fillRect(
//           seat.width - buttonSize,
//           seat.height - buttonSize,
//           buttonSize,
//           buttonSize
//         );
//         ctx.drawImage(resizeIcon, seat.width - 18, seat.height - 18, 16, 16);
//       }

//       ctx.restore();
//     });
//     if (tempCopySeat) {
//       ctx.save();
//       ctx.globalAlpha = 0.5;
//       ctx.restore();
//     }
//   }, [
//     canvasRef,
//     seats,
//     tempCopySeat,
//     hoveredSeatId,
//     x,
//     y,
//     iconsLoaded,
//     rotateIcon,
//     deleteIcon,
//     resizeIcon,
//     renameIcon,
//     gridSize,
//   ]);

//   return (
//     <div style={{ position: "absolute", top: -40, left: 92 }}>
//       <button
//         style={{
//           padding: "8px 16px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//         onClick={onAddSeat}
//       >
//         좌석 생성
//       </button>
//     </div>
//   );
// }
