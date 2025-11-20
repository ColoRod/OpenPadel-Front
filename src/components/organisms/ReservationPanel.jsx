// src/components/organisms/ReservationPanel.jsx
import React, { useState, useEffect } from 'react';
import CourtHeader from '../molecules/CourtHeader';
import DateSelector from '../molecules/DateSelector';
import CourtDetails from '../molecules/CourtDetails';
import TimeSlot from '../molecules/TimeSlot';
import styles from './ReservationPanel.module.scss';

export default function ReservationPanel({
    timeSlots,      
    onReserve,
    calendarDates,
    selectedDate,
    onSelectDate,
    onCanchaChange,
    isTimeSlotLoading
}) {
    // ESTADOS PARA MANEJAR DATOS DEL BACKEND
    const [canchas, setCanchas] = useState([]);
    const [activeCourtIndex, setActiveCourtIndex] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNCIÓN PARA LLAMAR AL BACKEND
    useEffect(() => {
        const fetchCanchas = async () => {
            try {
                const response = await fetch('/api/v1/canchas'); 
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // NOTA: Puedes combinar las dos revisiones de data.data en una sola
                if (data.data && data.data.length > 0) {
                    setCanchas(data.data);
                    // NOTIFICAR LA CANCHA INICIAL DESPUÉS DE LA CARGA
                    onCanchaChange(data.data[0].cancha_id); 
                }

            } catch (err) {
                console.error("Fallo al cargar canchas:", err);
                setError("Error al cargar las canchas: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCanchas();
    }, []); 

    const handleSelectCourt = (index) => {
        setActiveCourtIndex(index);
        // NOTIFICAR CADA VEZ QUE LA CANCHA CAMBIA
        // Usamos la ID real del objeto de cancha para el fetch de horarios en la página
        onCanchaChange(canchas[index].cancha_id); 
    };

    const activeCourt = canchas[activeCourtIndex];

    if (isLoading) {
        return <div className={styles.loadingMessage}>Cargando canchas...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }
    
    if (!activeCourt) {
        return <div className={styles.noCanchas}>No se encontraron canchas disponibles.</div>;
    }

    return (
        <div className={styles.panelContainer}>
            
            <CourtHeader 
                courtNames={canchas.map(c => c.cancha_nombre)} 
                activeCourtIndex={activeCourtIndex}
                onSelectCourt={handleSelectCourt} 
            />

            <div className={styles.contentWrapper}>
                
                {/* Lado Izquierdo: Detalles de la cancha activa */}
                <div className={styles.detailsArea}>
                    <CourtDetails 
                        courtName={activeCourt.cancha_nombre} 
                        courtImageUrl={activeCourt.imagen_url} 
                        // PASAMOS EL ARRAY DE OBJETOS DIRECTAMENTE
                        specifications={activeCourt.caracteristicas} 
                        price={activeCourt.precio_base}
                    /> 
                </div>

                {/* Lado Derecho: Selector de Fecha y Lista de Horarios */}
                <div className={styles.scheduleArea}>
                    
                    {/* Selector de Días/Fechas */}
                    <DateSelector 
                        dates={calendarDates}
                        selectedDate={selectedDate}
                        onSelectDate={onSelectDate}
                    />
                    
                    {/* Lista de Horarios */}
                    <div className={styles.timeSlotList}>
                        {isTimeSlotLoading ? (
                            // 1. Mostrar estado de carga si es TRUE
                            <div className={styles.loadingSlots}>Cargando horarios...</div>
                        ) : timeSlots && timeSlots.length > 0 ? (
                            // 2. Mostrar la lista si no está cargando y hay datos
                            timeSlots.map(slot => (
                                <TimeSlot 
                                    key={slot.time}
                                    time={slot.time}
                                    status={slot.status}
                                    onReserve={() => onReserve(slot.time)} 
                                />
                            ))
                        ) : (
                            // 3. Mostrar mensaje de vacío si no hay datos y no está cargando
                            <p className={styles.noSlots}>No hay horarios disponibles para esta fecha.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}