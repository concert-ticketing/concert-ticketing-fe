// /pages/manager/banner/write.tsx
import { useRouter } from 'next/router';
import Header from '@/components/manager/common/Header';
import Nav from '@/components/manager/common/Nav';
import NoticeForm from '@/components/manager/notice/NoticeForm';
import styles from './Write.module.css';

const BannerWritePage = () => {
  const router = useRouter();

  const handleSubmit = (form: any) => {
    console.log('배너 등록:', form);
    alert('배너가 등록되었습니다.');
    router.push('/manager/banner');
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.body}>
        <Nav />
        <main className={styles.content}>
          <h2>공지사항 등록</h2>
          <NoticeForm mode='create' onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  );
};

export default BannerWritePage;
