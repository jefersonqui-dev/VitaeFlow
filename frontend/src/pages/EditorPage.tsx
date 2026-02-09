import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ResumePreview from '../components/preview/ResumePreview';

// Editors
import PersonalDetailsForm from '../components/editor/PersonalDetailsForm';
import ExperienceEditor from '../components/editor/ExperienceEditor';
import EducationEditor from '../components/editor/EducationEditor';
import SkillsEditor from '../components/editor/SkillsEditor';
import CertificationsEditor from '../components/editor/CertificationsEditor';
import ThemeEditor from '../features/editor/ThemeEditor';

// Icons (Lucide style simple SVGs)
const Icons = {
  Content: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  Design: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Templates: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

type NavItem = 'content' | 'design' | 'templates' | 'settings';

const EditorPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>('content');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const cvState = useSelector((state: RootState) => state.cv);
  const isLoading = false;

  const handleSave = () => {
    alert("Funcionalidad de guardado en mantenimiento.");
  };

  const navItems: { id: NavItem; label: string; icon: React.FC }[] = [
    { id: 'content', label: 'Contenido', icon: Icons.Content },
    { id: 'design', label: 'Diseño', icon: Icons.Design },
    { id: 'templates', label: 'Plantillas', icon: Icons.Templates },
    { id: 'settings', label: 'Ajustes', icon: Icons.Settings },
  ];

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden font-sans">
      {/* Top Bar Compacta */}
      <header className="bg-white border-b border-gray-200 h-14 flex justify-between items-center px-4 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">R</div>
          <span className="font-bold text-gray-800 tracking-tight">Resume SaaS</span>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={handleSave} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
             {isLoading ? 'Guardando...' : 'Descargar PDF'}
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 1. Sidebar Fijo de Navegación */}
        <nav className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-20 shrink-0 gap-4 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (!isPanelOpen) setIsPanelOpen(true);
              }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-16 group relative ${
                activeNav === item.id 
                  ? 'text-blue-600 bg-blue-50/80 font-medium' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon />
              <span className="text-[10px]">{item.label}</span>
              {activeNav === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        {/* 2. Panel Desplegable (Drawer) */}
        <aside 
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] relative z-10 shadow-xl ${
            isPanelOpen ? 'w-[420px] translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
          }`}
        >
          {/* Botón Flotante Colapsar/Expandir */}
          <div 
             className="absolute top-1/2 -right-0 translate-x-full -translate-y-1/2 z-50 pointer-events-none"
             style={{ width: '24px', height: '100px' }} 
          >
             <button 
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="pointer-events-auto bg-white border border-gray-200 border-l-0 rounded-r-lg p-1.5 shadow-md text-gray-500 hover:text-blue-600 hover:pl-2 transition-all flex items-center justify-center h-12 w-6"
                title={isPanelOpen ? "Cerrar panel" : "Abrir panel"}
             >
                {isPanelOpen ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
             </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
            <div className="p-6 pb-24 min-h-full"> 
              
              {activeNav === 'content' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-end mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Contenido</h2>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Secciones</span>
                  </div>
                  
                  <div className="space-y-4">
                    <EditorSection title="Detalles Personales" defaultOpen icon="👤">
                      <PersonalDetailsForm />
                    </EditorSection>
                    
                    <EditorSection title="Experiencia Laboral" icon="💼">
                      <ExperienceEditor />
                    </EditorSection>
                    
                    <EditorSection title="Educación" icon="🎓">
                      <EducationEditor />
                    </EditorSection>
                    
                    <EditorSection title="Habilidades" icon="⚡">
                      <SkillsEditor />
                    </EditorSection>
                    
                    <EditorSection title="Certificaciones" icon="📜">
                      <CertificationsEditor />
                    </EditorSection>
                  </div>
                </div>
              )}

              {activeNav === 'design' && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Diseño</h2>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Apariencia</span>
                  </div>
                  <ThemeEditor />
                </div>
              )}

              {activeNav === 'templates' && (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fadeIn">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="font-medium">Galería de Plantillas</p>
                    <p className="text-xs mt-2">Próximamente más diseños</p>
                 </div>
              )}

               {activeNav === 'settings' && (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fadeIn">
                    <div className="text-4xl mb-4">⚙️</div>
                    <p className="font-medium">Configuración</p>
                    <p className="text-xs mt-2">Gestiona tu cuenta y preferencias</p>
                 </div>
              )}

            </div>
          </div>
        </aside>

        {/* 3. Área Principal (Preview) */}
        <main className="flex-1 bg-gray-100/50 overflow-hidden relative flex flex-col">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
          
          {/* Padding reducido al mínimo para maximizar el PDF */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center p-4 transition-all duration-300 custom-scrollbar">
            <div className="w-full min-h-full flex justify-center items-start">
              <ResumePreview />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const EditorSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: string }> = ({ title, children, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border transition-all duration-200 rounded-xl bg-white overflow-hidden ${isOpen ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-gray-200 shadow-sm hover:border-blue-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center bg-white hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
           {icon && <span className="text-lg opacity-80">{icon}</span>}
           <span className={`font-semibold transition-colors ${isOpen ? 'text-blue-700' : 'text-gray-700'}`}>{title}</span>
        </div>
        <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${isOpen ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-gray-100 text-gray-400'}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-gray-50/30 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
};

export default EditorPage;
