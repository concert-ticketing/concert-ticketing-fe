import React, { useRef, useState, useEffect } from 'react';

type Zone = {
  id: string;
  name: string;
};

export default function UploadSVGPage() {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSvgContent(reader.result as string);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    svgContainerRef.current.innerHTML = svgContent;

    const svgEl = svgContainerRef.current.querySelector('svg');
    if (svgEl) {
      svgEl.querySelectorAll('polygon, rect, path, circle').forEach((el) => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('id') || crypto.randomUUID();
          const name = prompt('구역 이름을 입력하세요 (예: A구역)');
          if (name) {
            el.setAttribute('fill', 'blue');
            el.setAttribute('id', id);
            el.setAttribute('data-name', name);

            setZones((prev) => [...prev, { id, name }]);
          }
        });
      });
    }
  }, [svgContent]);

  return (
    <div>
      <h1>공연장 SVG 구역 설정</h1>

      <input
        type='file'
        accept='.svg'
        title='SVG 공연장 파일 업로드'
        onChange={handleUpload}
      />

      <div ref={svgContainerRef} />

      <div>
        <h2>설정된 구역</h2>
        <ul>
          {zones.map((zone) => (
            <li key={zone.id}>
              ID: {zone.id} - 이름: {zone.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
