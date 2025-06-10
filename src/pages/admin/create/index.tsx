import React from 'react';

import CreateForm from '@/components/admin/create';
import AdminLayout from '@/components/admin/common/layout/AdminLayout';

export default function VenueCreatePage() {
  return (
    <AdminLayout title='콘서트장 생성'>
      <CreateForm />
    </AdminLayout>
  );
}
