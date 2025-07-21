import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ConcertDetail from '@/components/admin/concerts/concertDetail';

const ConcertDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { concertId } = router.query;

  if (!concertId || typeof concertId !== 'string') {
    return <div>Loading...</div>;
  }

  return <ConcertDetail concertId={concertId} />;
};

ConcertDetailPage.getLayout = withAdminLayout({ title: '콘서트 상세' });

export default ConcertDetailPage;
