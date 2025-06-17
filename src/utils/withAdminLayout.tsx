import { ReactElement } from 'react';

import AdminLayout from '@/components/admin/common/layout/AdminLayout';

interface WithAdminLayoutOptions {
  title: string;
}

export function withAdminLayout({ title }: WithAdminLayoutOptions) {
  return function getLayout(page: ReactElement): ReactElement {
    return <AdminLayout title={title}>{page}</AdminLayout>;
  };
}
