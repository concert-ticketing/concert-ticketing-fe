import { GetServerSideProps } from 'next';

import FaqEditPage from '@/components/site-admin/faq/edit/FaqEdit';

type Props = {
  id: string;
  title: string;
  status: '노출' | '비노출';
  description?: string;
};

export default function Page(props: Props) {
  return <FaqEditPage {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params ?? {};

  if (!id || Array.isArray(id) || !/^\d+$/.test(id as string)) {
    return {
      redirect: {
        destination: '/site-admin/banner',
        permanent: false,
      },
    };
  }

  const mockBanners = [
    { id: '1', title: '여름 이벤트', status: '노출', description: '여름 배너입니다' },
    { id: '2', title: '가을 할인전', status: '비노출', description: '가을 배너입니다' },
  ];

  const banner = mockBanners.find((b) => b.id === id);

  if (!banner) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
      title: banner.title,
      status: banner.status,
      description: banner.description,
    },
  };
};
