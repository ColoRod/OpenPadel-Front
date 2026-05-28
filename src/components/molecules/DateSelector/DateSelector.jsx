// src/components/molecules/DateSelector/DateSelector.jsx
import { useState, useRef, useEffect } from 'react';
import DateNumber from '../../atoms/DateNumber/DateNumber';
import styles from './DateSelector.module.scss';

const DAYS_LABELS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTHS_LABELS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function DateSelector({ dates, selectedDate, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const dropdownRef = useRef(null);

  // Cerrar el calendario si el usuario hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const handleCalendarDayClick = (date) => {
    onSelectDate(date);
    setCalendarOpen(false);
  };

  // Generar los días del mes para el calendario
  const buildCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Dom
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells = [];

    // Celdas vacías antes del primer día
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }
    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(calendarYear, calendarMonth, d));
    }
    return cells;
  };

  const cells = buildCalendarDays();

  // No permitir navegar a meses anteriores al actual
  const isPrevDisabled =
    calendarYear < today.getFullYear() ||
    (calendarYear === today.getFullYear() && calendarMonth <= today.getMonth());

  return (
    <div className={styles.selectorContainer}>
      {/* Lista horizontal de los próximos 14 días — sin cambios */}
      <div className={styles.dateList}>
        {dates.map((dayData) => (
          <DateNumber
            key={dayData.fullDate.getTime()}
            day={dayData.day}
            date={dayData.date}
            month={dayData.month}
            isActive={selectedDate && selectedDate.toDateString() === dayData.fullDate.toDateString()}
            onClick={() => onSelectDate(dayData.fullDate)}
          />
        ))}
      </div>

      {/* Botón + y dropdown calendario */}
      <div className={styles.calendarWrapper} ref={dropdownRef}>
        <button
          className={`${styles.addButton} ${calendarOpen ? styles.addButtonActive : ''}`}
          onClick={() => setCalendarOpen(o => !o)}
          title="Elegir otra fecha"
        >
          {calendarOpen ? '✕' : '+'}
        </button>

        {calendarOpen && (
          <div className={styles.calendarDropdown}>
            {/* Cabecera con navegación de mes */}
            <div className={styles.calendarHeader}>
              <button
                className={styles.monthNavBtn}
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
              >
                ‹
              </button>
              <span className={styles.monthTitle}>
                {MONTHS_LABELS[calendarMonth]} {calendarYear}
              </span>
              <button className={styles.monthNavBtn} onClick={handleNextMonth}>
                ›
              </button>
            </div>

            {/* Etiquetas de días de la semana */}
            <div className={styles.weekLabels}>
              {DAYS_LABELS.map(d => (
                <span key={d} className={styles.weekLabel}>{d}</span>
              ))}
            </div>

            {/* Grilla de días */}
            <div className={styles.calendarGrid}>
              {cells.map((date, i) => {
                if (!date) return <span key={`empty-${i}`} />;

                const isPast = date < today;
                const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <button
                    key={date.getTime()}
                    className={`
                      ${styles.calendarDay}
                      ${isPast ? styles.calendarDayPast : ''}
                      ${isSelected ? styles.calendarDaySelected : ''}
                      ${isToday && !isSelected ? styles.calendarDayToday : ''}
                    `}
                    onClick={() => !isPast && handleCalendarDayClick(date)}
                    disabled={isPast}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}