import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ZoneList from '@/components/admin/zones/zoneList';

const ZoneListPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { venueId } = router.query;

  if (!venueId || typeof venueId !== 'string') {
    return <div>Loading...</div>;
  }

  return <ZoneList venueId={venueId} />;
};

ZoneListPage.getLayout = withAdminLayout({ title: '구역 관리' });

export default ZoneListPage;
