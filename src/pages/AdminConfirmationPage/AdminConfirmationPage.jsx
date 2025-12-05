import React, { useState, useEffect } from 'react';
import AppLayout from '../../templates/AppLayout';
import CourtReservationList from '../../components/organisms/CourtReservationList/CourtReservationList';
import styles from './AdminConfirmationPage.module.scss';

const AdminConfirmationPage = () => {
  const [courtsData, setCourtsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar "Cargando..."

  // --- 1. FUNCIÓN AYUDANTE: AGRUPAR DATOS ---
  // El backend nos devuelve una lista "plana" (ej: [reserva1, reserva2...]).
  // Esta función las organiza por cancha (ej: { c1: [reserva1], c2: [reserva2] })
  // para que podamos mostrar los acordeones correctamente.
  const groupReservationsByCourt = (flatList) => {
    const groups = {};

    flatList.forEach((res) => {
      // Si la cancha no existe en nuestro objeto temporal, la inicializamos
      if (!groups[res.courtId]) {
        groups[res.courtId] = {
          courtId: res.courtId,
          courtName: res.courtName, 
          reservations: []
        };
      }
      // Agregamos la reserva a la lista de esa cancha
      groups[res.courtId].reservations.push(res);
    });

    // Convertimos el objeto en un array para poder recorrerlo con .map()
    return Object.values(groups);
  };

  // --- 2. FUNCIÓN PARA OBTENER DATOS (GET) ---
  const fetchReservations = async () => {
    try {
      // Usamos la ruta relativa "/api/reservas".
      // Gracias al Proxy en vite.config.js, esto va a http://localhost:3000/api/reservas
      const response = await fetch('/api/reservas');
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
      // Transformamos los datos planos a la estructura agrupada
      const groupedData = groupReservationsByCourt(data);
      
      setCourtsData(groupedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error conectando al backend:", error);
      setIsLoading(false); // Dejamos de cargar aunque haya error
    }
  };

  // --- 3. EFECTO DE CARGA INICIAL ---
  // Se ejecuta una sola vez cuando el componente se monta
  useEffect(() => {
    fetchReservations();
  }, []);

  // --- 4. FUNCIÓN PARA PROCESAR ACCIONES (PUT / DELETE) ---
  const handleProcessReservation = async (courtId, reservationId, action) => {
    console.log(`Procesando acción: ${action} en reserva ${reservationId}`);
    
    // URL base relativa
    const API_URL = '/api/reservas'; 

    try {
      if (action === 'confirmar') {
        // CONFIRMAR: Usamos PUT para actualizar el estado en la base de datos
        await fetch(`${API_URL}/${reservationId}/confirmar`, { method: 'PUT' });
      
      } else if (action === 'rechazar' || action === 'cancelar') {
        // RECHAZAR O CANCELAR: Usamos DELETE para borrar la reserva de la base de datos
        await fetch(`${API_URL}/${reservationId}`, { method: 'DELETE' });
      }

      // SI TODO SALIÓ BIEN: Volvemos a pedir los datos para ver los cambios reflejados en pantalla
      fetchReservations();

    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      alert("Hubo un error al intentar actualizar la reserva. Revisa la consola.");
    }
  };

  return (
    <AppLayout title="Panel de Administración">
      <div className={styles.adminPanel}>
        <h1 className={styles.panelTitle}>Confirmar Reservas</h1>
        
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Cargando reservas...
          </p>
        ) : (
          <div className={styles.listsContainer}>
            {courtsData.length > 0 ? (
              // Mapeamos las canchas agrupadas
              courtsData.map((court) => (
                <CourtReservationList
                  key={court.courtId}
                  courtId={court.courtId}
                  courtName={court.courtName}
                  reservations={court.reservations}
                  onProcess={handleProcessReservation}
                />
              ))
            ) : (
              // Mensaje si no hay nada en la base de datos
              <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No hay reservas registradas por el momento.
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminConfirmationPage;