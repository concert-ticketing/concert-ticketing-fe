import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/manager/common/Header';
import Nav from '@/components/manager/common/Nav';
import pageStyles from './NoticeList.module.css';
import Pagination from '@/components/user/common/Pagination';

const initialNotices = [
  { id: 1, title: '여름 이벤트', status: '노출', createdAt: '2025-07-10' },
  { id: 2, title: '가을 할인전', status: '비노출', createdAt: '2025-06-05' },
  { id: 3, title: '겨울 시즌 안내', status: '노출', createdAt: '2025-05-30' },
  { id: 4, title: '공지사항 테스트', status: '비노출', createdAt: '2025-05-15' },
  { id: 5, title: '시스템 점검 안내', status: '노출', createdAt: '2025-04-22' },
];

const inquiriesPerPage = 5; 

const NoticeListPage = () => {
  const [notices, setNotices] = useState(initialNotices);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * inquiriesPerPage;
  const indexOfFirst = indexOfLast - inquiriesPerPage;
  const currentNotices = notices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notices.length / inquiriesPerPage);

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      console.log(`공지사항 ${id} 삭제됨`);
    }
  };

  return (
    <div className={pageStyles.wrapper}>
      <Header />
      <div className={pageStyles.body}>
        <Nav />
        <main className={pageStyles.content}>
          <div className={pageStyles.pageHeader}>
            <h2>공지사항 관리</h2>
            <Link href='/manager/notice/write' className={pageStyles.createBtn}>
              + 공지사항 등록
            </Link>
          </div>

          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>등록일</th>
                <th>공개</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentNotices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.title}</td>
                  <td>{notice.createdAt}</td>
                                    <td>{notice.status}</td>

                  <td>
                    <Link
                      href={{
                        pathname: `/manager/notice/${notice.id}`,
                        query: {
                          title: notice.title,
                          status: notice.status
                        },
                      }}
                      className={pageStyles.editBtn}
                    >
                      수정
                    </Link>
                    <button
                      className={pageStyles.deleteBtn}
                      onClick={() => handleDelete(notice.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default NoticeListPage;
