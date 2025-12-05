// src/components/organisms/SiteHeader/SiteHeader.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../atoms/Logo/Logo";
import styles from "./SiteHeader.module.scss";

export default function SiteHeader({ onLogoClick, title = "Reserva" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    else navigate("/home");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("categoria");
    navigate("/login");
  };

  // Cerrar menú al clickear afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <div
        className={styles.logoWrapper}
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
      >
        <Logo size="large" />
      </div>

      {/* TITULO */}
      <h2 className={styles.pageTitle}>{title}</h2>

      {/* MENÚ DE USUARIO */}
      <div className={styles.userMenu} ref={menuRef}>
        <div
          className={styles.userTrigger}
          role="button"
          tabIndex={0}
          onClick={toggleMenu}
        >
          <span className={styles.profileText}>PERFIL ▼</span>
        </div>

        {menuOpen && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => navigate("/profile")}
            >
              Mi Perfil
            </button>

            <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
