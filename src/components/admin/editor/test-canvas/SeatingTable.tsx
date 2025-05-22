// import React from "react";
// import { Seat } from "@/types/Seat";

// interface SeatingTableProps {
//   seats: Seat[];
//   setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
// }

// export default function SeatingTable({ seats, setSeats }: SeatingTableProps) {
//   const handleChange = (
//     id: string,
//     field: keyof Seat,
//     value: string | number
//   ) => {
//     setSeats((prevSeats) =>
//       prevSeats.map((seat) =>
//         seat.id === id ? { ...seat, [field]: value } : seat
//       )
//     );
//   };

//   return (
//     <div className="m-auto max-w-[800px]">
//       {seats.length > 0 && (
//         <table className="min-w-full border">
//           <thead>
//             <tr className="bg-[#c0c0c0]">
//               <th>좌석ID</th>
//               <th>위치(x,y)</th>
//               <th>너비</th>
//               <th>높이</th>
//               <th>회전각도</th>
//             </tr>
//           </thead>
//           <tbody>
//             {seats.map((seat) => (
//               <tr key={seat.id}>
//                 <td>{seat.id}</td>
//                 <td>
//                   <input
//                     type="number"
//                     value={seat.x}
//                     onChange={(e) =>
//                       handleChange(seat.id, "x", parseFloat(e.target.value))
//                     }
//                     className="max-w-[100px] border px-[5px] py-[3px] mr-[10px]"
//                   />

//                   <input
//                     type="number"
//                     value={seat.y}
//                     onChange={(e) =>
//                       handleChange(seat.id, "y", parseFloat(e.target.value))
//                     }
//                     className="max-w-[100px] border px-[5px] py-[3px]"
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={seat.width}
//                     onChange={(e) =>
//                       handleChange(seat.id, "width", parseFloat(e.target.value))
//                     }
//                     className="max-w-[50px] border px-[5px] py-[3px]"
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={seat.height}
//                     onChange={(e) =>
//                       handleChange(
//                         seat.id,
//                         "height",
//                         parseFloat(e.target.value)
//                       )
//                     }
//                     className="max-w-[50px] border px-[5px] py-[3px]"
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={Math.floor(seat.rotation)}
//                     onChange={(e) =>
//                       handleChange(
//                         seat.id,
//                         "rotation",
//                         parseFloat(e.target.value)
//                       )
//                     }
//                     className="max-w-[50px] border px-[5px] py-[3px]"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
