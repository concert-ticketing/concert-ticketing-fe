import { withAdminLayout } from '@/utils/withAdminLayout';
import type { NextPageWithLayout } from '@/types/layout';

import SVGUploader from '@/components/admin/venues/SVGUploader';

const VenueUploadPage: NextPageWithLayout = () => {
  return <SVGUploader />;
};

VenueUploadPage.getLayout = withAdminLayout({ title: 'SVG 업로드' });

export default VenueUploadPage;
