import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  includeDay?: boolean;
}

const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ 
  value, 
  onChange, 
  isOpen, 
  onClose,
  anchorEl,
  includeDay = false
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(-1);
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // State for year range pagination (20 years per page)
  const [yearRangeStart, setYearRangeStart] = useState<number>(new Date().getFullYear() - 10);

  useEffect(() => {
    if (value) {
      if (value.includes('/')) {
        const parts = value.split('/');
        
        if (parts.length === 3) {
          // DD/MM/YYYY
          const [day, month, year] = parts.map(p => parseInt(p, 10));
          if (!isNaN(day)) setSelectedDay(day);
          if (!isNaN(month)) setSelectedMonth(month - 1);
          if (!isNaN(year)) {
            setSelectedYear(year);
            setViewYear(year);
            setYearRangeStart(year - 10);
          }
        } else if (parts.length === 2) {
          // MM/YYYY
          const [monthStr, yearStr] = parts;
          const monthIndex = parseInt(monthStr, 10) - 1;
          const year = parseInt(yearStr, 10);
          if (!isNaN(monthIndex) && !isNaN(year)) {
            setSelectedMonth(monthIndex);
            setSelectedYear(year);
            setViewYear(year);
            setYearRangeStart(year - 10);
            setSelectedDay(null);
          }
        }
      } else {
        // Assume YYYY
        const year = parseInt(value, 10);
        if (!isNaN(year)) {
          setSelectedYear(year);
          setViewYear(year);
          setYearRangeStart(year - 10);
          setSelectedMonth(-1);
          setSelectedDay(null);
        }
      }
    } else {
      const currentYear = new Date().getFullYear();
      setSelectedMonth(-1);
      setSelectedDay(null);
      setViewYear(currentYear);
      setYearRangeStart(currentYear - 10);
    }
  }, [value, isOpen]);

  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // Basic positioning logic - improve with boundary detection if needed
      let top = rect.bottom + scrollY + 5;
      let left = rect.left + scrollX;
      
      // Check if it goes off screen (bottom)
      if (top + 300 > document.body.scrollHeight) {
        top = rect.top + scrollY - 310; // Show above
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorEl]);

  const handleDaySelect = (day: number) => {
    if (selectedMonth === -1) return;
    
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = (selectedMonth + 1).toString().padStart(2, '0');
    onChange(`${formattedDay}/${formattedMonth}/${viewYear}`);
    onClose();
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (includeDay) {
      setSelectedMonth(monthIndex);
      setSelectedYear(viewYear);
    } else {
      const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
      onChange(`${formattedMonth}/${viewYear}`);
      onClose();
    }
  };

  const handleYearChange = (offset: number) => {
    setYearRangeStart(prev => prev + offset);
  };
  
  const handleYearOnlySelect = () => {
    onChange(`${viewYear}`);
    onClose();
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate array of years for the current view
  const years = Array.from({ length: 20 }, (_, i) => yearRangeStart + i);

  const renderContent = () => {
    if (includeDay && selectedMonth !== -1) {
      const daysInMonth = getDaysInMonth(viewYear, selectedMonth);
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <button 
              onClick={() => setSelectedMonth(-1)}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded flex items-center text-xs"
            >
              ← Volver
            </button>
            <span className="font-semibold text-gray-800">
              {MONTHS[selectedMonth]} {viewYear}
            </span>
            <div className="w-8"></div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className={`p-2 text-sm rounded-md transition-colors ${
                  selectedDay === day
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <button 
            onClick={() => handleYearChange(-20)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            &lt;
          </button>
          <span className="font-semibold text-gray-700 text-sm">
            {years[0]} - {years[years.length - 1]}
          </span>
          <button 
            onClick={() => handleYearChange(20)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setViewYear(year)}
              className={`p-2 text-sm rounded-md transition-colors ${
                viewYear === year
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`p-2 text-sm rounded-full transition-colors ${
                  !includeDay && selectedMonth === index && selectedYear === viewYear
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
          
          {!includeDay && (
            <button
              onClick={handleYearOnlySelect}
              className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors border border-dashed border-blue-200"
            >
              Solo Año ({viewYear})
            </button>
          )}
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose} 
      />
      <div 
        className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-[320px] p-4 animate-in fade-in zoom-in-95 duration-100"
        style={{ top: position.top, left: position.left }}
      >
        {renderContent()}
      </div>
    </>,
    document.body
  );
};
