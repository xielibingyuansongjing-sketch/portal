import React, { useState, useMemo } from 'react';
import type { ScheduleEvent, User } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons/Icons';
import EventModal from './EventModal';
import { EVENT_COLORS } from '../constants';

interface ScheduleProps {
  events: ScheduleEvent[];
  user: User | null;
  addEvent: (event: Omit<ScheduleEvent, 'id' | 'authorId' | 'authorName'>, date: string) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (eventId: number) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ events, user, addEvent, updateEvent, deleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set(EVENT_COLORS.map(c => c.key)));

  const availableYears = useMemo(() => {
    const year = new Date().getFullYear();
    return [year - 1, year, year + 1, year + 2];
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => selectedColors.has(event.color));
  }, [events, selectedColors]);

  const handleColorFilterChange = (colorKey: string) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(colorKey)) {
        newSet.delete(colorKey);
      } else {
        newSet.add(colorKey);
      }
      return newSet;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(Number(e.target.value), currentDate.getMonth(), 1));
  };

  const handleOpenModalForNew = (date: Date) => {
    if (!user) return;
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date + 'T00:00:00'));
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventData: Omit<ScheduleEvent, 'id' | 'authorId' | 'authorName' | 'date'>) => {
    if (selectedEvent) { // Editing existing event
        updateEvent({ ...selectedEvent, ...eventData });
    } else if (selectedDate) { // Adding new event
        const dateString = selectedDate.toISOString().split('T')[0];
        addEvent({ ...eventData, date: dateString }, dateString);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    handleCloseModal();
  };
  
  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, event: ScheduleEvent) => {
    if (user?.id !== event.authorId || event.endDate) { // Prevent dragging multi-day events
        e.preventDefault();
        return;
    }
    setDraggedEventId(event.id);
    e.dataTransfer.setData('text/plain', event.id.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    setDraggedEventId(null);
    e.currentTarget.style.opacity = '1';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if(draggedEventId) {
        e.currentTarget.classList.add('bg-brand-blue-light');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
     e.currentTarget.classList.remove('bg-brand-blue-light');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newDate: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-brand-blue-light');
    const eventId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const eventToMove = events.find(ev => ev.id === eventId);
    
    if (eventToMove && eventToMove.date !== newDate) {
        updateEvent({ ...eventToMove, date: newDate });
    }
    setDraggedEventId(null);
  };


  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calendarDays = [];
    
    // Previous month's days
    for (let i = 0; i < startDayOfWeek; i++) {
        const date = new Date(year, month, i - startDayOfWeek + 1);
        calendarDays.push({ date, isCurrentMonth: false });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        calendarDays.push({ date, isCurrentMonth: true });
    }

    // Next month's days
    const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month + 1, i);
        calendarDays.push({ date, isCurrentMonth: false });
    }

    return calendarDays.map(({date, isCurrentMonth}, index) => {
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.getTime() === today.getTime();
      
      const dayEvents = filteredEvents.filter(e => {
        const eventStart = new Date(e.date + 'T00:00:00');
        const eventEnd = e.endDate ? new Date(e.endDate + 'T00:00:00') : eventStart;
        return date >= eventStart && date <= eventEnd;
      });

      return (
        <div 
          key={index} 
          className={`
            border border-slate-200 p-2 flex flex-col h-28 sm:h-32 md:h-36 transition-colors duration-200
            ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'}
            ${user && isCurrentMonth ? 'hover:bg-slate-100' : ''}
          `}
          onClick={() => isCurrentMonth && user && handleOpenModalForNew(date)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => isCurrentMonth && handleDrop(e, dateString)}
          aria-label={`予定を追加 ${date.toLocaleDateString()}`}
          role="button"
          tabIndex={user && isCurrentMonth ? 0 : -1}
        >
          <time
            dateTime={dateString}
            className={`
              font-semibold text-sm
              ${isToday ? 'bg-brand-blue text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
              ${isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}
            `}
          >
            {date.getDate()}
          </time>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {dayEvents.map(event => {
                const canDrag = user?.id === event.authorId && !event.endDate;
                const colorInfo = EVENT_COLORS.find(c => c.key === event.color) || EVENT_COLORS[0];
                return (
                  <button 
                    key={event.id}
                    draggable={canDrag}
                    onDragStart={(e) => handleDragStart(e, event)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                    }}
                    className={`block w-full text-left text-xs ${colorInfo.bgClass} ${colorInfo.textClass} p-1 rounded-md truncate ${colorInfo.hoverBgClass} ${canDrag ? 'cursor-grab' : 'cursor-default'}`}
                    aria-label={`予定詳細: ${event.title}`}
                  >
                    {event.startTime ? `${event.startTime} ` : ''}{event.title}
                  </button>
                )
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm h-full flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center space-x-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="前の月">
                <ChevronLeftIcon className="h-6 w-6 text-slate-600" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 w-36 text-center">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="次の月">
                <ChevronRightIcon className="h-6 w-6 text-slate-600" />
            </button>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="ml-4 text-sm border-slate-300 rounded-md"
              aria-label="年を選択"
            >
              {availableYears.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600 hidden md:inline">絞り込み:</span>
            {EVENT_COLORS.map(color => (
                <button
                    key={color.key}
                    onClick={() => handleColorFilterChange(color.key)}
                    className={`w-6 h-6 rounded-full ${color.bgClass} transition-transform duration-150 ${selectedColors.has(color.key) ? 'ring-2 ring-offset-1 ring-brand-blue' : 'opacity-50'}`}
                    aria-label={`${color.name}で絞り込み`}
                    title={color.name}
                />
            ))}
          </div>
          {user && (
            <button
              onClick={() => handleOpenModalForNew(new Date())}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              予定を追加
            </button>
          )}
        </div>
      </header>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-200 border border-slate-200">
        <div className="grid grid-cols-7 col-span-7 auto-rows-fr">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-slate-600 py-1 bg-slate-50">{day}</div>
            ))}
        </div>
        {renderCalendar()}
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        date={selectedDate}
        user={user}
      />
    </div>
  );
};

export default Schedule;