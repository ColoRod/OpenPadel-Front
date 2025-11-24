// src/components/atoms/Logo.jsx
import styles from './Logo.module.scss';
// Asumiendo que has puesto tu logo SVG en assets
import openPadelLogo from '../../../assets/openpadel-logo.svg'; 

export default function Logo({ size = 'medium' }) {
  const className = `${styles.logo} ${styles[size]}`;
  
  return (
    <img src={openPadelLogo} alt="Open Padel Logo" className={className} />
  );
}