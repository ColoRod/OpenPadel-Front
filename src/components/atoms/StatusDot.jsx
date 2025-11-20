// src/components/atoms/StatusDot.jsx
import styles from './StatusDot.module.scss';

export default function StatusDot({ status = 'available', ...props }) {
  // statuses: 'available' (verde), 'reserved' (oscuro/gris), 'selected' (amarillo)
  const className = `${styles.dot} ${styles[status]}`;
  
  return <span className={className} {...props} />;
}