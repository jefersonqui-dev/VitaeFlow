import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addCertification, updateCertification, removeCertification } from '../../features/cv/cvSlice';
import { Certification } from '../../types/resume';
import { MonthYearPicker } from '../ui/MonthYearPicker';

const CertificationsEditor: React.FC = () => {
  const dispatch = useDispatch();
  const certificationsList = useSelector((state: RootState) => state.cv.certifications);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Date Picker State
  const [datePickerState, setDatePickerState] = useState<{
    isOpen: boolean;
    itemId: string | null;
    anchorEl: HTMLElement | null;
  }>({ isOpen: false, itemId: null, anchorEl: null });

  const handleAdd = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: 'Nombre de la Certificación',
      issuer: 'Entidad Emisora',
      date: '2024',
    };
    dispatch(addCertification(newCert));
    setExpandedId(newCert.id);
  };

  const handleUpdate = (id: string, field: keyof Certification, value: string) => {
    const item = certificationsList.find((c) => c.id === id);
    if (item) {
      dispatch(updateCertification({ ...item, [field]: value }));
    }
  };

  const openDatePicker = (e: React.MouseEvent<HTMLInputElement>, id: string) => {
    e.preventDefault();
    setDatePickerState({
      isOpen: true,
      itemId: id,
      anchorEl: e.currentTarget
    });
  };

  const handleDateChange = (value: string) => {
    if (datePickerState.itemId) {
      handleUpdate(datePickerState.itemId, 'date', value);
    }
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta certificación?')) {
      dispatch(removeCertification(id));
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
          datePickerState.itemId
            ? certificationsList.find(c => c.id === datePickerState.itemId)?.date || ''
            : ''
        }
        onChange={handleDateChange}
        anchorEl={datePickerState.anchorEl}
        includeDay={false}
      />

      {certificationsList.map((item) => (
        <div 
          key={item.id} 
          className={`bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
            expandedId === item.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Preview Header */}
          <div 
            onClick={() => toggleExpand(item.id)}
            className="p-4 cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.name || 'Certificación'}</h3>
                <div className="text-xs text-gray-500">{item.issuer || 'Emisor'}</div>
                <div className="text-xs text-gray-400 mt-1">📅 {item.date}</div>
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Nombre de la Certificación</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. AWS Certified Solutions Architect"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Entidad Emisora</label>
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => handleUpdate(item.id, 'issuer', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Amazon Web Services"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de Obtención</label>
                <input
                  type="text"
                  readOnly
                  value={item.date}
                  onClick={(e) => openDatePicker(e, item.id)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50"
                  placeholder="AAAA o MM/AAAA"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Agregar Certificación
      </button>
    </section>
  );
};

export default CertificationsEditor;
