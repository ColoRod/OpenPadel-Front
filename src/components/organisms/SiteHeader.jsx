// src/components/organisms/SiteHeader.jsx
import Logo from '../atoms/Logo';
import styles from './SiteHeader.module.scss';

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Logo size="large" />
      </div>
      <h2 className={styles.pageTitle}>RESERVA</h2> {/* Título de la pestaña */}
      <div className={styles.userStatus}role="button" tabIndex="0" onClick={() => console.log('Ir a Perfil')}>
        {/* Usamos un ícono simple de perfil */}
        <span className={styles.profileText}>PERFIL</span>
      </div>
    </header>
  );
}