import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/site-admin/common/Header';
import Nav from '@/components/site-admin/common/Nav';
import pageStyles from './NoticeList.module.css';
import Pagination from '@/components/user/common/Pagination';

const inquiriesPerPage = 5;

const NoticeListPage = () => {
  const [notices, setNotices] = useState<
    { id: number; title: string; status: string; createdAt: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const res = await fetch('http://localhost:8080/api/notices', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(`공지사항 불러오기 실패: ${errorData.message || '오류 발생'}`);
          return;
        }

        const data = await res.json();
        // data가 배열이라고 가정, 실제 API 구조에 맞게 조정 필요
        setNotices(data);
      } catch (error) {
        console.error('공지사항 조회 중 오류:', error);
        alert('공지사항을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchNotices();
  }, []);

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
            <Link href='/site-admin/notice/write' className={pageStyles.createBtn}>
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
              {currentNotices.length > 0 ? (
                currentNotices.map((notice) => (
                  <tr key={notice.id}>
                    <td>{notice.title}</td>
                    <td>{notice.createdAt}</td>
                    <td>{notice.status}</td>

                    <td>
                      <Link
                        href={{
                          pathname: `/site-admin/notice/${notice.id}`,
                          query: {
                            title: notice.title,
                            status: notice.status,
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
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
