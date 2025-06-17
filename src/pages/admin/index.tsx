import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import Dashboard from '@/components/admin/dashboard';

const DashboardPage: NextPageWithLayout = () => {
  return <Dashboard />;
};

DashboardPage.getLayout = withAdminLayout({ title: '대시보드' });

export default DashboardPage;
