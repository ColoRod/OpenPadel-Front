import "./HeaderPerfil.scss";
import LogoGrande from "../../atoms/LogoGrande/LogoGrande";
import { useNavigate } from "react-router-dom";

export default function HeaderPerfil() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home"); 
  };

  return (
    <header className="header">
      <div
        className="logoWrapper"
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
      >
        <LogoGrande size="large" />
      </div>

      <h2 className="pageTitle">PERFIL</h2>
    </header>
  );
}
