import React from 'react';

import AdminLayout from '@/components/admin/common/layout/AdminLayout';
import Dashboard from '@/components/admin/dashboard';

export default function AdminDashboardPage() {
  return (
    <AdminLayout title='관리 시스템 홈'>
      <Dashboard />
    </AdminLayout>
  );
}
