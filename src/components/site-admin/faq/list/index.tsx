import Link from 'next/link';
import Header from '@/components/site-admin/common/Header';
import Nav from '@/components/site-admin/common/Nav';
import pageStyles from './Admin.module.css';

const mockBanners = [
  { id: 1, title: '여름 이벤트', status: '노출', createdAt: '2025-07-10' },
  { id: 2, title: '가을 할인전', status: '비노출', createdAt: '2025-06-05' },
];

const BannerListPage = () => {
  return (
    <div className={pageStyles.wrapper}>
      <Header />
      <div className={pageStyles.body}>
        <Nav />
        <main className={pageStyles.content}>
          <div className={pageStyles.pageHeader}>
            <h2>FAQ 관리</h2>
            <Link href='/site-admin/faq/write' className={pageStyles.createBtn}>
              + FAQ 등록
            </Link>
          </div>

          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {mockBanners.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.title}</td>
                  <td>{banner.status}</td>
                  <td>{banner.createdAt}</td>
                  <td>
                    <Link
                      href={{
                        pathname: `/site-admin/faq/${banner.id}`,
                        query: {
                          title: banner.title,
                          status: banner.status,
                        },
                      }}
                      className={pageStyles.editBtn}
                      onClick={() => console.log(`배너 ${banner.title} 수정 요청`)}
                    >
                      수정
                    </Link>
                    <button
                      className={pageStyles.deleteBtn}
                      onClick={() => console.log(`배너 ${banner.id} 삭제 요청`)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default BannerListPage;
