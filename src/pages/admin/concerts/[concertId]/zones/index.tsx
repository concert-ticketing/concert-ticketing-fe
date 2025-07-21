import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ZoneList from '@/components/admin/zones/zoneList';

const ZoneListPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { concertId } = router.query;

  if (!concertId || typeof concertId !== 'string') {
    return <div>Loading...</div>;
  }

  return <ZoneList concertId={concertId} />;
};

ZoneListPage.getLayout = withAdminLayout({ title: '구역 관리' });

export default ZoneListPage;
