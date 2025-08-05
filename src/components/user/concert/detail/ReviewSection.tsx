import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Section.module.css';

type Review = {
  id: string;
  rating: number;
  text: string;
  date: string;
};

export default function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleRegister = () => {
    if (text.trim() === '' || rating === 0) {
      console.log('작성 실패: 별점 또는 텍스트 누락');
      return;
    }

    const newReview: Review = {
      id: `${Date.now()}-${Math.random()}`,
      rating,
      text,
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    };

    setReviews([newReview, ...reviews]);
    setText('');
    setRating(0);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const stars = ['star1', 'star2', 'star3', 'star4', 'star5'];

  return (
    <div className={styles.wrap}>
      {/* 입력 영역 */}
      <div className={styles.inputSection}>
        <div className={styles.starArray}>
          {stars.map((id, i) => (
            <span
              key={id}
              onClick={() => handleStarClick(i)}
              className={`${styles.star} ${i < rating ? styles.active : ''}`}
            >
              ★
            </span>
          ))}
          <span>별을 선택해주세요</span>
        </div>

        <textarea
          placeholder='후기를 작성해주세요'
          className={styles.text}
          maxLength={1000}
          value={text}
          onChange={handleTextChange}
        />

        <div className={styles.count}>
          <span>{text.length} / 1000</span>
          <button className={styles.registerBtn} onClick={handleRegister}>
            등록
          </button>
        </div>
      </div>

      {/* 등록된 리뷰 */}
      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.starArray}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.star} ${i < review.rating ? styles.active : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
            <p className={styles.reviewText}>{review.text}</p>
            <button
              type='button'
              title='삭제'
              className={styles.deleteBtn}
              onClick={() => handleDelete(review.id)}
            >
              <Image
                src='/icons/delete.png'
                alt='삭제'
                width={20}
                height={20}
                className={styles.delteImage}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
