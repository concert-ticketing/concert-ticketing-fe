// pages/mypage/inquiry/[id].tsx
import React from 'react';
import { GetServerSideProps } from 'next';
import InquiryDetail from '@/components/user/mypage/inquiry/InquiryDetail';

interface PageProps {
  id: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { id } = context.params ?? {};

  if (!id || Array.isArray(id) || !/^\d+$/.test(id)) {
    return {
      redirect: {
        destination: '/mypage/inquiry',
        permanent: false,
      },
    };
  }

  return {
    props: { id: id as string },
  };
};

export default function InquiryDetailPage({ id }: PageProps) {
  return <InquiryDetail id={id} />;
}
