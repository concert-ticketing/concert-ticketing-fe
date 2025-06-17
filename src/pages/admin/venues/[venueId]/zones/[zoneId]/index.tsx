import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ZoneDetail from '@/components/admin/zones/zoneDetail';

const ZoneDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { venueId, zoneId } = router.query;

  if (!venueId || typeof venueId !== 'string' || !zoneId || typeof zoneId !== 'string') {
    return <div>Loading...</div>;
  }

  return <ZoneDetail venueId={venueId} zoneId={zoneId} />;
};

ZoneDetailPage.getLayout = withAdminLayout({ title: '구역 상세' });

export default ZoneDetailPage;
