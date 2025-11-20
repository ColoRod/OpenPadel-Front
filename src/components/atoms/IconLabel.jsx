// src/components/atoms/IconLabel.jsx
import styles from './IconLabel.module.scss';

export default function IconLabel({ imageUrl, text, ...props }) {
  return (
    <div className={styles.labelContainer} {...props}>
      {/* ⬅️ Usamos una etiqueta <img> y la prop imageUrl */}
      <img src={imageUrl} alt={text} className={styles.iconImage} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}