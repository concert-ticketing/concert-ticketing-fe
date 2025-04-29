import ImageConverter from "@/components/ImageConverter";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/admin/seating-editor">좌석 선택</Link>
      <ImageConverter />
    </>
  );
}
