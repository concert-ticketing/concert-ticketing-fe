import React, { useRef } from 'react';

import FabricEditor from '@/components/admin/editor';

export default function AdminEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <FabricEditor />
    </div>
  );
}
