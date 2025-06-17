import React from 'react';
import { useRouter } from 'next/router';

import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import VenueDetail from '@/components/admin/venues/venueDetail';

const VenueDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { venueId } = router.query;

  if (!venueId || typeof venueId !== 'string') {
    return <div>Loading...</div>;
  }

  return <VenueDetail venueId={venueId} />;
};

VenueDetailPage.getLayout = withAdminLayout({ title: '공연장 상세' });

export default VenueDetailPage;
