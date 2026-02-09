import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addExperience, updateExperience, removeExperience } from '../../features/cv/cvSlice';
import { Experience } from '../../types/resume';
import { MonthYearPicker } from '../ui/MonthYearPicker';

const ExperienceEditor: React.FC = () => {
  const dispatch = useDispatch();
  const experienceList = useSelector((state: RootState) => state.cv.experience);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Date Picker State
  const [datePickerState, setDatePickerState] = useState<{
    isOpen: boolean;
    field: 'startDate' | 'endDate' | null;
    itemId: string | null;
    anchorEl: HTMLElement | null;
  }>({ isOpen: false, field: null, itemId: null, anchorEl: null });

  const handleAdd = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: 'Nombre de la Compañía',
      position: 'Título',
      location: 'Ubicación',
      startDate: '01/2024',
      endDate: 'Presente',
      description: '• Destaca tus logros, utilizando cifras si es posible.',
    };
    dispatch(addExperience(newExperience));
    setExpandedId(newExperience.id);
  };

  const handleUpdate = (id: string, field: keyof Experience, value: string) => {
    const item = experienceList.find((e) => e.id === id);
    if (item) {
      dispatch(updateExperience({ ...item, [field]: value }));
    }
  };

  const openDatePicker = (e: React.MouseEvent<HTMLInputElement>, id: string, field: 'startDate' | 'endDate') => {
    e.preventDefault(); // Prevent default focus
    // If selecting end date and current value is "Presente", maybe clear it or handle specially
    setDatePickerState({
      isOpen: true,
      field,
      itemId: id,
      anchorEl: e.currentTarget
    });
  };

  const handleDateChange = (value: string) => {
    if (datePickerState.itemId && datePickerState.field) {
      handleUpdate(datePickerState.itemId, datePickerState.field, value);
    }
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta experiencia?')) {
      dispatch(removeExperience(id));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="space-y-4 relative">
      <MonthYearPicker
        isOpen={datePickerState.isOpen}
        onClose={() => setDatePickerState(prev => ({ ...prev, isOpen: false }))}
        value={
          datePickerState.itemId && datePickerState.field
            ? experienceList.find(e => e.id === datePickerState.itemId)?.[datePickerState.field] || ''
            : ''
        }
        onChange={handleDateChange}
        anchorEl={datePickerState.anchorEl}
      />

      {experienceList.map((item) => (
        <div 
          key={item.id} 
          className={`bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
            expandedId === item.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Card Header (Preview) */}
          <div 
            onClick={() => toggleExpand(item.id)}
            className="p-4 cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.position || 'Título'}</h3>
                <div className="text-xs font-semibold text-blue-600 mb-1">{item.company || 'Compañía'}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>📅 {item.startDate} - {item.endDate}</span>
                  {item.location && <span>📍 {item.location}</span>}
                </div>
                {expandedId !== item.id && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-2">
                <button 
                  onClick={(e) => handleRemove(item.id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                <div className="p-1.5 text-gray-400">
                  {expandedId === item.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {expandedId === item.id && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Título</label>
                  <input
                    type="text"
                    value={item.position}
                    onChange={(e) => handleUpdate(item.id, 'position', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Senior Developer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Compañía</label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Tech Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Inicio</label>
                  <input
                    type="text"
                    readOnly
                    value={item.startDate}
                    onClick={(e) => openDatePicker(e, item.id, 'startDate')}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50"
                    placeholder="MM/AAAA"
                  />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Fin</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={item.endDate}
                      onClick={(e) => item.endDate !== 'Presente' && openDatePicker(e, item.id, 'endDate')}
                      className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${item.endDate === 'Presente' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                      placeholder="MM/AAAA"
                    />
                    <button
                      onClick={() => handleUpdate(item.id, 'endDate', item.endDate === 'Presente' ? '' : 'Presente')}
                      className={`px-2 text-xs border rounded transition-colors ${item.endDate === 'Presente' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      title="Marcar como actual"
                    >
                      Actual
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Ubicación</label>
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Madrid, España"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Descripción</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Describe tus responsabilidades y logros..."
                />
                <p className="text-[10px] text-gray-400 text-right">Usa guiones (-) para crear listas</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Agregar Experiencia
      </button>
    </section>
  );
};

export default ExperienceEditor;
