import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import CanvasEditor from '@/components/admin/editor';

const ZoneEditorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { venueId, zoneId } = router.query;

  if (!venueId || typeof venueId !== 'string' || !zoneId || typeof zoneId !== 'string') {
    return <div>Loading...</div>;
  }

  return <CanvasEditor />;
};

ZoneEditorPage.getLayout = withAdminLayout({ title: '좌석 에디터' });

export default ZoneEditorPage;
