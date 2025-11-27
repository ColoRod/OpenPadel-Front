// src/components/organisms/SiteHeader.jsx
import { useNavigate } from 'react-router-dom';
import Logo from '../../atoms/Logo/Logo';
import styles from './SiteHeader.module.scss';

export default function SiteHeader({ onLogoClick, title = 'Reserva' }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/");   // Ir siempre al home
    }
  };

  const handleProfileClick = () => {
    navigate("/perfil"); // Redirige a la futura sección Perfil
  };

  return (
    <header className={styles.header}>
      <div
        className={styles.logoWrapper}
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
        onKeyDown={(e) => { if (e.key === 'Enter') handleLogoClick(); }}
      >
        <Logo size="large" />
      </div>

      <h2 className={styles.pageTitle}>{title}</h2>

      <div
        className={styles.userStatus}
        role="button"
        tabIndex={0}
        onClick={handleProfileClick}
        onKeyDown={(e) => { if (e.key === 'Enter') handleProfileClick(); }}
      >
        <span className={styles.profileText}>PERFIL</span>
      </div>
    </header>
  );
}
