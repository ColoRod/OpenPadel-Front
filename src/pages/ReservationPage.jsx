// src/pages/ReservationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../templates/AppLayout';
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
    const { clubName: clubNameParam, canchaName: canchaNameParam } = useParams();
    
    const [clubName, setClubName] = useState(clubNameParam ? decodeURIComponent(clubNameParam) : 'Cargando...');
    const [canchaName, setCanchaName] = useState(canchaNameParam ? decodeURIComponent(canchaNameParam) : 'Cargando...');
    const initialCalendarDates = generateDates();
    const [calendarDates] = useState(initialCalendarDates);

    const [selectedDate, setSelectedDate] = useState(initialCalendarDates[0].fullDate);
    const [timeSlots, setTimeSlots] = useState([]);
    
    //ESTADO UNIFICADO PARA LA CANCHA ACTIVA
    const [activeCanchaId, setActiveCanchaId] = useState(null); 
    const [isTimeSlotLoading, setIsTimeSlotLoading] = useState(false);

    // Fetch cancha ID from name and set as active on load
    useEffect(() => {
        const fetchCanchaIdByName = async () => {
                try {
                    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                    const url = `${API_BASE}/api/v1/canchas/club/${encodeURIComponent(clubNameParam)}`;
                    console.log('[ReservationPage] Fetching canchas for club:', clubNameParam, url);
                    const response = await fetch(url);

                    if (!response.ok) {
                        console.error('[ReservationPage] Response not ok:', response.status);
                        throw new Error("Error fetching canchas");
                    }

                    const data = await response.json();
                    console.log('[ReservationPage] Raw canchas response:', data);

                    // Normalize to array
                    let canchas = [];
                    if (Array.isArray(data)) canchas = data;
                    else if (data && Array.isArray(data.data)) canchas = data.data;
                    else if (data && Array.isArray(data.canchas)) canchas = data.canchas;

                    // Try to find cancha by a few possible name keys
                    const decodedCanchaName = canchaNameParam ? decodeURIComponent(canchaNameParam) : '';
                    const selectedCancha = canchas.find(c => (c.nombre && c.nombre === decodedCanchaName) || (c.cancha_nombre && c.cancha_nombre === decodedCanchaName) || (c.nombre_cancha && c.nombre_cancha === decodedCanchaName));

                    if (selectedCancha) {
                        setActiveCanchaId(selectedCancha.cancha_id || selectedCancha.id || selectedCancha.canchaId);
                        setCanchaName(selectedCancha.nombre || selectedCancha.cancha_nombre || selectedCancha.nombre_cancha);
                    } else if (canchas.length > 0) {
                        // Fallback to first cancha
                        const first = canchas[0];
                        setActiveCanchaId(first.cancha_id || first.id || first.canchaId);
                        setCanchaName(first.nombre || first.cancha_nombre || first.nombre_cancha || 'Cancha');
                    }
                } catch (error) {
                    console.error("Error fetching cancha:", error);
                }
            };

        if (clubNameParam && canchaNameParam) {
            setClubName(decodeURIComponent(clubNameParam));
            fetchCanchaIdByName();
        }
    }, [clubNameParam, canchaNameParam]);

    const fetchTimeSlots = useCallback(async (canchaId, date) => {
        
        if (!canchaId) return; 

        setIsTimeSlotLoading(true);
        const formattedDate = date.toISOString().split('T')[0];
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const url = `${API_BASE}/api/v1/horarios/${canchaId}?fecha=${formattedDate}`;

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
    
    const navigate = useNavigate();

    // Handler llamado por ReservationPanel al cambiar de cancha o al cargar
    // Ahora acepta (newCanchaId, newCanchaName) y actualiza la URL
    const handleCanchaChange = useCallback((newCanchaId, newCanchaName) => {
        setActiveCanchaId(newCanchaId);
        // Actualizar el nombre local de la cancha si viene
        if (newCanchaName) {
            setCanchaName(newCanchaName);
            // Actualizar la URL para reflejar la cancha seleccionada
            // Mantener el club actual en la ruta
            if (clubName) {
                const newUrl = `/reserva/${encodeURIComponent(clubName)}/${encodeURIComponent(newCanchaName)}`;
                console.log('[ReservationPage] Navigating to', newUrl);
                navigate(newUrl, { replace: false });
            }
        }
        // Llama a la función de fetching con la nueva ID y la fecha actual
        fetchTimeSlots(newCanchaId, selectedDate);
    }, [fetchTimeSlots, selectedDate, clubName, navigate]); // Depende de selectedDate, fetchTimeSlots, clubName, navigate

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

        // Obtener el userId del usuario autenticado
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("Usuario no autenticado. Por favor, inicie sesión nuevamente.");
            return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.id || user.user_id;
        
        if (!userId) {
            alert("No se pudo obtener el ID del usuario.");
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
            canchaId: activeCanchaId,
            userId: userId,
            fecha: selectedDate.toISOString().split('T')[0],
            horaInicio: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`,
            horaFin: horaFin
        };
        
        setIsTimeSlotLoading(true);

        try {
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_BASE}/api/v1/horarios`, {
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
                console.error('Reserva failed response:', response.status, result);
                alert(`Error al reservar:${result.message || 'El turno ya no está disponible.'}`);
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
        <AppLayout title={'RESERVA'}> 
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
                // Filtrar canchas por club seleccionado
                filterClubName={clubName}
            />
        </AppLayout>
    );
}