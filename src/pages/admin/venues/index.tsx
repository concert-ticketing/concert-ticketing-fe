import AdminLayout from '@/components/admin/common/layout/AdminLayout';
import VenueList from '@/components/admin/venues/venueList';

export default function VenuesPage() {
  return (
    <AdminLayout title='콘서트장 목록'>
      <VenueList />
    </AdminLayout>
  );
}
