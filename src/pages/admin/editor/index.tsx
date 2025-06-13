import React, { useRef } from 'react';

import CanvasEditor from '@/components/admin/editor';

export default function AdminEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <CanvasEditor />
    </div>
  );
}
