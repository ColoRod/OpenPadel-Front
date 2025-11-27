import Logo from "../../atoms/Logo/Logo";
import "./Header.scss";

const Header = ({ title = 'Principal', onLogoClick }) => {
  return (
    <header className="header" >
      <div
        className="logoWrapper"
        role="button"
        tabIndex={0}
        onClick={() => onLogoClick && onLogoClick()}
        onKeyDown={(e) => { if (e.key === 'Enter') onLogoClick && onLogoClick(); }}
      >
        <Logo size="large" />
      </div>
      <h2 className="pageTitle">{title}</h2> {/* Título dinámico */}
      <div className="userStatus">
        {/* Usamos un ícono simple de perfil */}
        <span className="profileIcon">👤</span>
      </div>
    </header>
  );
};

export default Header;
