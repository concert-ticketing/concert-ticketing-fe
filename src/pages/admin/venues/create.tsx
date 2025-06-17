import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import VenueCreate from '@/components/admin/venues/venueCreate';

const VenueCreatePage: NextPageWithLayout = () => {
  return <VenueCreate />;
};

VenueCreatePage.getLayout = withAdminLayout({ title: '공연장 생성' });

export default VenueCreatePage;
