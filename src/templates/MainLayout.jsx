// src/templates/MainLayout.jsx
// Importamos los Organismos necesarios
import SiteHeader from '../components/organisms/SiteHeader';
//import ReservationPanel from '../components/organisms/ReservationPanel';

// Importamos los estilos SCSS del Layout (aunque está simple, es buena práctica)
// import styles from './MainLayout.module.scss'; 

// Este componente recibe TODAS las props de la lógica de negocio desde ReservationPage.jsx
export default function MainLayout( { children } ) {
  return (
    <div>
      {/* 1. Organismo: Cabecera del Sitio (Logo, Título, Perfil) */}
      <SiteHeader /> 
      
      {/* 2. Área principal de contenido */}
      <main>
          {children}
      </main>
    </div>
  );
}