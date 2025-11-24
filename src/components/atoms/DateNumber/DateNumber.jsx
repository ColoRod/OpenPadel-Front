// src/components/atoms/DateNumber.jsx
import styles from './DateNumber.module.scss';

export default function DateNumber({ day, date, month, isActive, ...props }) {
  const classNames = `${styles.dateBlock} ${isActive ? styles.active : ''}`;

  return (
    <div className={classNames} {...props}>
      <span className={styles.day}>{day}</span>
      <span className={styles.date}>{date}</span>
      <span className={styles.month}>{month}</span>
    </div>
  );
}