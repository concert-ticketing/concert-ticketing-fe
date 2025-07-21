import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import ConcertCreate from '@/components/admin/concerts/concertCreate';

const ConcertCreatePage: NextPageWithLayout = () => {
  return <ConcertCreate />;
};

ConcertCreatePage.getLayout = withAdminLayout({ title: '콘서트 생성' });

export default ConcertCreatePage;
