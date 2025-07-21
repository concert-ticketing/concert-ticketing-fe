// ConcertInfos.tsx
import { useRouter } from 'next/router';

import styles from './ConcertInfos.module.css';
import { useDateStore } from '@/stores/dateStore';

type ConcertInfoProps = {
  showNextButton?: boolean;
  showPrevButton?: boolean;
  onNextClick?: () => void;
  onPrevClick?: () => void;
};

const ConcertInfo = ({
  showNextButton = true,
  showPrevButton = false,
  onNextClick,
  onPrevClick,
}: ConcertInfoProps) => {
  const router = useRouter();

  const handleNext = () => {
    if (onNextClick) onNextClick();
    else router.push('/reserve/select-seat');
  };

  const handlePrev = () => {
    if (onPrevClick) onPrevClick();
    else router.back(); // 기본값은 뒤로가기
  };

  const { selectedDate } = useDateStore();

  return (
    <div className={styles.rightPanel}>
      <div className={styles.concertInfo}>
        <div className={styles.poster}>포스터</div>
        <div className={styles.infoBox}>
          <p>예매정보</p>
          <p>일시:{selectedDate ? selectedDate.toLocaleDateString('ko-KR') : ''} </p>
          <p>티켓수량: </p>
          <p>총결제: </p>
        </div>
      </div>
      <div className={styles.buttonBox}>
        {showPrevButton && (
          <button className={styles.prevButton} onClick={handlePrev}>
            이전단계
          </button>
        )}
        {showNextButton && (
          <button className={styles.nextButton} onClick={handleNext}>
            다음단계
          </button>
        )}
      </div>
    </div>
  );
};

export default ConcertInfo;
