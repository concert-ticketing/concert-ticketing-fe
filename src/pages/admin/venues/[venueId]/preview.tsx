import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import VenuePreview from '@/components/admin/venues/venuePreview';

const VenuePreviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { venueId } = router.query;

  if (!venueId || typeof venueId !== 'string') {
    return <div>Loading...</div>;
  }

  return <VenuePreview venueId={venueId} />;
};

VenuePreviewPage.getLayout = withAdminLayout({ title: '공연장 미리보기' });

export default VenuePreviewPage;
