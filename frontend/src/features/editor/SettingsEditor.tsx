import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setResume } from '../cv/cvSlice';
import { setCustomization } from '../theme/themeSlice';
import { Resume } from '../../types/resume';
import { Theme } from '../../types/theme';

const SettingsEditor: React.FC = () => {
  const dispatch = useDispatch();
  const cvState = useSelector((state: RootState) => state.cv);
  const themeState = useSelector((state: RootState) => state.theme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadJson = () => {
    const data = {
      cv: cvState,
      theme: themeState.customization,
      version: '1.0',
      date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vitaeflow-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestoreJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        if (json.cv) {
            // Validación básica
            if(window.confirm('¿Estás seguro de que quieres reemplazar tu CV actual con esta copia de seguridad? Esta acción no se puede deshacer.')) {
                dispatch(setResume(json.cv as Resume));
                if (json.theme) {
                    dispatch(setCustomization(json.theme as Theme));
                }
                alert('Copia de seguridad restaurada correctamente.');
            }
        } else {
            alert('El archivo no parece ser una copia de seguridad válida de VitaeFlow.');
        }
      } catch (error) {
        console.error('Error parsing JSON backup', error);
        alert('Error al leer el archivo. Asegúrate de que es un JSON válido.');
      }
    };
    reader.readAsText(file);
    
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos y empezar de cero?')) {
        // Podríamos tener una acción 'resetAll' o despachar un estado inicial vacío.
        // Por simplicidad, recargamos la página o seteamos un estado "casi" vacío.
        // Una opción mejor es setear un objeto Resume vacío.
        
        const emptyResume: Resume = {
            personalDetails: { fullName: '', jobTitle: '', email: '', phone: '', address: '', summary: '', links: [], profilePicture: '' },
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: []
        };
        
        dispatch(setResume(emptyResume));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Settings */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Ajustes</h2>
        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Gestión</span>
      </div>

      {/* Data Management Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Datos del Documento</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
            Guarda una copia de seguridad de tu trabajo actual o restaura una versión anterior.
        </p>

        <div className="grid grid-cols-1 gap-3">
            <button 
                onClick={handleDownloadJson}
                className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all group shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-sm">Descargar Backup</div>
                        <div className="text-[10px] text-gray-400 group-hover:text-blue-400">Guardar archivo .json</div>
                    </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-blue-400"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all group shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-sm">Restaurar Backup</div>
                        <div className="text-[10px] text-gray-400 group-hover:text-purple-400">Cargar archivo .json</div>
                    </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-purple-400"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleRestoreJson} 
                accept=".json" 
                className="hidden" 
            />
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Danger Zone */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Zona de Peligro
        </h3>
        
        <button 
            onClick={handleReset}
            className="w-full p-4 border border-red-100 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 hover:border-red-200 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Borrar todos los datos
        </button>
      </section>

      <hr className="border-gray-100" />

      {/* Utilities */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Utilidades</h3>
        <button 
            onClick={handlePrint}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-between group"
        >
            <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Impresión Nativa
            </span>
            <span className="text-xs text-gray-400 group-hover:text-gray-600">Ctrl + P</span>
        </button>
      </section>

      <div className="text-center pt-8 pb-4">
        <p className="text-[10px] text-gray-400">VitaeFlow Editor v1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsEditor;
