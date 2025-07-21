import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ConcertList from '@/components/admin/concerts/concertList';

const ConcertListPage: NextPageWithLayout = () => {
  return <ConcertList />;
};

ConcertListPage.getLayout = withAdminLayout({ title: '콘서트 관리' });

export default ConcertListPage;
