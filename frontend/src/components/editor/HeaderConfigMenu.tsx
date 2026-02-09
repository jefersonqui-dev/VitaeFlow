import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateHeaderConfig } from '../../features/theme/themeSlice';

export const HeaderConfigMenu: React.FC = () => {
  const dispatch = useDispatch();
  // Safe selector with default fallback
  const headerConfig = useSelector((state: RootState) => state.theme.customization.headerConfig) || {
    showTitle: true,
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showLink: true,
    showAdditionalLink: true,
    showPhoto: true,
    uppercaseName: true,
    showDob: false,
    showNationality: false,
    photoStyle: 'circle' as const
  };

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (key: keyof typeof headerConfig) => {
    // @ts-ignore - dynamic key access
    dispatch(updateHeaderConfig({ [key]: !headerConfig[key] }));
  };

  const setPhotoStyle = (style: 'circle' | 'square') => {
    dispatch(updateHeaderConfig({ photoStyle: style }));
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Configurar campos visibles"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-72 p-4 text-sm text-gray-700 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Campos Visibles</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
            <Toggle label="Título Profesional" checked={headerConfig.showTitle} onChange={() => toggle('showTitle')} />
            <Toggle label="Teléfono" checked={headerConfig.showPhone} onChange={() => toggle('showPhone')} />
            <Toggle label="Email" checked={headerConfig.showEmail} onChange={() => toggle('showEmail')} />
            <Toggle label="Ubicación" checked={headerConfig.showLocation} onChange={() => toggle('showLocation')} />
            <Toggle label="Enlace Principal" checked={headerConfig.showLink} onChange={() => toggle('showLink')} />
            <Toggle label="Enlace Adicional" checked={headerConfig.showAdditionalLink} onChange={() => toggle('showAdditionalLink')} />
            <Toggle label="Foto de Perfil" checked={headerConfig.showPhoto} onChange={() => toggle('showPhoto')} />
            
            <div className="border-t border-gray-100 my-1 pt-1"></div>
            
            <Toggle label="Fecha de Nacimiento" checked={headerConfig.showDob} onChange={() => toggle('showDob')} />
            <Toggle label="Nacionalidad" checked={headerConfig.showNationality} onChange={() => toggle('showNationality')} />
            
            <div className="border-t border-gray-100 my-1 pt-1"></div>

            <Toggle label="Nombre en Mayúsculas" checked={headerConfig.uppercaseName} onChange={() => toggle('uppercaseName')} />
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Estilo Foto</span>
              <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                <button 
                  onClick={() => setPhotoStyle('circle')}
                  className={`p-1.5 px-3 rounded-md transition-all text-xs font-medium flex items-center gap-1 ${headerConfig.photoStyle === 'circle' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <div className="w-3 h-3 rounded-full border-2 border-current"></div>
                  Circle
                </button>
                <button 
                  onClick={() => setPhotoStyle('square')}
                  className={`p-1.5 px-3 rounded-md transition-all text-xs font-medium flex items-center gap-1 ${headerConfig.photoStyle === 'square' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <div className="w-3 h-3 rounded-sm border-2 border-current"></div>
                  Square
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center cursor-pointer group" onClick={onChange}>
    <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
    <div className={`w-9 h-5 flex items-center bg-gray-200 rounded-full p-1 duration-200 ease-in-out ${checked ? 'bg-blue-500' : ''}`}>
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-200 ease-in-out ${checked ? 'translate-x-4' : ''}`}></div>
    </div>
  </div>
);
