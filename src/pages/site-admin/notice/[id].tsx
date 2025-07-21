import { GetServerSideProps } from 'next';

import ManagerNoticeEdit from '@/components/site-admin/notice/edit/index';

type Props = {
  id: number;
  title: string;
  status: string;
  description?: string;
};

export default function ManagerNoticeEditPage(props: Props) {
  return <ManagerNoticeEdit {...props} />;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params ?? {};

  if (!id || Array.isArray(id) || !/^\d+$/.test(id as string)) {
    return {
      redirect: {
        destination: '/manager/notice',
        permanent: false,
      },
    };
  }

  const mockNotices = [
    { id: 1, title: '여름 이벤트', status: '노출', createdAt: '2025-07-10' },
    { id: 2, title: '가을 할인전', status: '비노출', createdAt: '2025-06-05' },
    { id: 3, title: '겨울 시즌 안내', status: '노출', createdAt: '2025-05-30' },
    { id: 4, title: '공지사항 테스트', status: '비노출', createdAt: '2025-05-15' },
    { id: 5, title: '시스템 점검 안내', status: '노출', createdAt: '2025-04-22' },
  ];

  // string을 number로 변환
  const numericId = parseInt(id as string, 10);
  const notice = mockNotices.find((n) => n.id === numericId);

  if (!notice) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: numericId, // number로 변환해서 전달
      title: notice.title,
      status: notice.status,
      // description: notice.description,
    },
  };
};
