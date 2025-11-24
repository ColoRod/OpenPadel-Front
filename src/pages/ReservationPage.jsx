// src/pages/ReservationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../templates/MainLayout';
import ClubTitleBar from '../components/molecules/ClubTitleBar/ClubTitleBar'; 
import ReservationPanel from '../components/organisms/ReservationPanel/ReservationPanel';

const generateDates = () => {
    const dates = [];
    const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        
        dates.push({
            day: DAYS[nextDate.getDay()],
            date: nextDate.getDate(),
            month: MONTHS[nextDate.getMonth()],
            fullDate: nextDate,
        });
    }
    return dates;
};

export default function ReservationPage() {
    
    const [clubName] = useState("MERCEDES PADEL");
    const initialCalendarDates = generateDates();
    const [calendarDates] = useState(initialCalendarDates);

    const [selectedDate, setSelectedDate] = useState(initialCalendarDates[0].fullDate);
    const [timeSlots, setTimeSlots] = useState([]);
    
    //ESTADO UNIFICADO PARA LA CANCHA ACTIVA
    const [activeCanchaId, setActiveCanchaId] = useState(null); 
    const [isTimeSlotLoading, setIsTimeSlotLoading] = useState(false);

    const fetchTimeSlots = useCallback(async (canchaId, date) => {
        
        if (!canchaId) return; 

        setIsTimeSlotLoading(true);
        const formattedDate = date.toISOString().split('T')[0];
        const url = `/api/v1/horarios/${canchaId}?fecha=${formattedDate}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok && data.data) {
                setTimeSlots(data.data);
            } else {
                console.error("Error al cargar horarios:", data.message);
                setTimeSlots([]);
            }
        } catch (error) {
            console.error("Error de red al cargar horarios:", error);
            setTimeSlots([]);
        } finally {
            setIsTimeSlotLoading(false);
        }
    }, []); 

    // ----------------------------------------------------
    // 3. HANDLERS (Usan la función fetchTimeSlots)
    // ----------------------------------------------------
    
    // Handler llamado por ReservationPanel al cambiar de cancha o al cargar
    const handleCanchaChange = useCallback((newCanchaId) => {
        //newCanchaId ahora se usa como argumento
        setActiveCanchaId(newCanchaId);
        // Llama a la función de fetching con la nueva ID y la fecha actual
        fetchTimeSlots(newCanchaId, selectedDate); 
    }, [fetchTimeSlots, selectedDate]); // Depende de selectedDate y fetchTimeSlots

    // Handler llamado al seleccionar una fecha del calendario
    const handleSelectDate = useCallback((date) => {
        setSelectedDate(date);
        // Llama a la función de fetching con la cancha actual y la nueva fecha
        fetchTimeSlots(activeCanchaId, date);
    }, [activeCanchaId, fetchTimeSlots]); // Depende de activeCanchaId y fetchTimeSlots
    
    // Handler para crear una reserva
    const handleReserve = async (slotTime) => {
        //Aquí usamos activeCanchaId (el estado) que ya está definido
        if (!activeCanchaId) {
            alert("Por favor, seleccione una cancha primero.");
            return;
        }

        // --- Lógica de cálculo de horaFin (Asumimos 90 minutos) ---
        const [startTimeStr] = slotTime.split(' - '); 
        const [h, m] = startTimeStr.split(':').map(Number);
        const startDate = new Date(selectedDate);
        startDate.setHours(h, m, 0, 0);
        const endDate = new Date(startDate.getTime() + 90 * 60000); 
        const horaFin = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;

        const payload = {
            canchaId: activeCanchaId, // ⬅️ Usa la ID del estado
            fecha: selectedDate.toISOString().split('T')[0],
            horaInicio: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`,
            horaFin: horaFin
        };
        
        setIsTimeSlotLoading(true);

        try {
            const response = await fetch('/api/v1/horarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();

            if (response.ok) {
                alert(`¡Reserva de ${slotTime} PENDIENTE!`);
                // Recargar horarios para mostrar el slot como 'pending'
                fetchTimeSlots(activeCanchaId, selectedDate);
            } else {
                alert(`Error al reservar: ${result.message || 'El turno ya no está disponible.'}`);
            }

        } catch (error) {
            console.error("Fallo de red/reserva:", error);
            alert("Hubo un error de conexión al intentar reservar.");
        } finally {
            setIsTimeSlotLoading(false);
        }
    };
    
    // ----------------------------------------------------
    // 4. RENDERIZADO
    // ----------------------------------------------------

    return (
        <MainLayout> 
            <ClubTitleBar clubName={clubName} /> 
            
            <ReservationPanel 
                // Nueva prop para que el Panel notifique su cancha activa
                onCanchaChange={handleCanchaChange} 
                
                // Props de Fechas/Horarios
                calendarDates={calendarDates}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                
                // Slots y estado de carga
                timeSlots={timeSlots}
                isTimeSlotLoading={isTimeSlotLoading}
                onReserve={handleReserve}
            />
        </MainLayout>
    );
}