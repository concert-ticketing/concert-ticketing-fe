import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import VenueList from '@/components/admin/venues/venueList';

const VenueListPage: NextPageWithLayout = () => {
  return <VenueList />;
};

VenueListPage.getLayout = withAdminLayout({ title: '공연장 관리' });

export default VenueListPage;
