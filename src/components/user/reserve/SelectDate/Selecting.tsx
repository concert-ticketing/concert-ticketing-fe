import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDateStore } from '@/stores/dateStore';

import styles from './Selecting.module.css';

const SelectDate = () => {
  const { selectedDate, setSelectedDate } = useDateStore();

  return (
    <div className={styles.leftPanel}>
      <div className={styles.layout}>
        {/* 날짜 선택 */}
        <div className={styles.left}>
          <div className={styles.selectTitle}>선택 1</div>
          <div className={styles.selectBox}>
            <div className={styles.selectName}>날짜선택</div>
            <div className={styles.calendar}>
              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                locale='ko-KR'
                calendarType='gregory'
              />
            </div>
          </div>
        </div>

        {/* 회차 선택 - 임시 고정 */}
        <div className={styles.center}>
          <div className={styles.selectTitle}>선택 2</div>
          <div className={styles.selectBox}>
            <div className={styles.selectName}>회차선택</div>
            <div className={styles.rounds}>
              <div className={styles.round}>1회차</div>
              <div className={styles.time}>00시 00분</div>
            </div>
          </div>
        </div>

        {/* 좌석 정보 - 임시 고정 */}
        <div className={styles.right}>
          <div className={styles.selectTitle}>선택 3</div>
          <div className={styles.selectBox}>
            <div className={styles.selectName}>잔여석</div>
            <div className={styles.seatAll}>
              <div className={styles.seats}>
                <div className={styles.seatType}>전체</div>
                <div className={styles.restSeat}>
                  120<p>석</p>
                </div>
              </div>
              <div className={styles.seats}>
                <div className={styles.seatType}>전체</div>
                <div className={styles.restSeat}>
                  120<p>석</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className={styles.noticeBox}>
        <p className={styles.noticeTitle}>티켓 예매시 유의사항</p>
        <p className={styles.noticeContent}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </div>
  );
};

export default SelectDate;
