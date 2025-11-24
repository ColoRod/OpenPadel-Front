// src/components/atoms/Button.jsx
import styles from './Button.module.scss';

export default function Button({ children, variant = 'primary', ...props }) {
  // variants: 'primary' (RESERVAR), 'reserved' (RESERVADO)
  const classNames = `${styles.btn} ${styles[variant]}`; 

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
}