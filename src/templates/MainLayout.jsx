// src/templates/MainLayout.jsx
// Importamos el SiteHeader existente (organismo) para la cabecera principal
import SiteHeader from '../components/organisms/SiteHeader/SiteHeader';

// Este componente recibe las props de la lógica de negocio desde las páginas
// onBack es opcional - if not provided, SiteHeader uses useNavigate(-1) for browser back
export default function MainLayout( { children, onBack, title } ) {
  return (
    <div>
      {/* Cabecera del sitio (organismo SiteHeader) */}
      <SiteHeader title={title} onLogoClick={onBack} /> 

      {/* Área principal de contenido */}
      <main>
          {children}
      </main>
    </div>
  );
}