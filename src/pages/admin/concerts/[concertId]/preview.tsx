import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ConcertPreview from '@/components/admin/concerts/concertPreview';

const ConcertPreviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { concertId } = router.query;

  if (!concertId || typeof concertId !== 'string') {
    return <div>Loading...</div>;
  }

  return <ConcertPreview concertId={concertId} />;
};

ConcertPreviewPage.getLayout = withAdminLayout({ title: '콘서트 미리보기' });

export default ConcertPreviewPage;
