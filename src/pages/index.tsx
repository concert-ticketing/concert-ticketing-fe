import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>좌석 배치 에디터 테스트 중</h1>
      <div className="flex flex-col gap-[10px]">
        <Link href="/admin/seating-editor">canvas로만 구현</Link>
        <Link href="/admin/fabric">fabric + potrace 라이브러리 사용</Link>
        <Link href="/admin/opencv">fabric + opencv 라이브러리 사용</Link>
        <Link href="/admin/tencorflow">
          fabric + tencorFlow 라이브러리 사용
        </Link>
      </div>
    </>
  );
}
