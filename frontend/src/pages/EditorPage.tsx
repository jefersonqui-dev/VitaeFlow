import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ResumePreview from '../components/preview/ResumePreview';
import { ModernWaveLayout } from '../templates/ModernWave/Layout';
import { Resume } from '../types/resume';
import { Theme } from '../types/theme';

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

// Dummy Data for Preview
const PREVIEW_DATA: Resume = {
  personalDetails: {
    fullName: 'Alex Morgan',
    jobTitle: 'Product Designer',
    email: 'alex@example.com',
    phone: '+1 234 567 890',
    address: 'New York, USA',
    summary: 'Diseñador creativo con enfoque en UX/UI y branding digital.',
    links: [],
    profilePicture: '' // Empty so it shows placeholder or initial if logic exists, or just looks clean
  },
  experience: [
    { id: '1', company: 'Creative Studio', position: 'Senior Designer', startDate: '2020', endDate: 'Present', description: 'Liderazgo de equipo.' },
    { id: '2', company: 'Tech Corp', position: 'UX Designer', startDate: '2018', endDate: '2020', description: 'Diseño de interfaces.' }
  ],
  education: [
    { id: '1', institution: 'Design Academy', degree: 'Master in Arts', startDate: '2016', endDate: '2018' }
  ],
  skills: [
    { id: '1', name: 'Figma', level: 5, category: 'Design' },
    { id: '2', name: 'React', level: 3, category: 'Dev' }
  ],
  projects: [],
  certifications: [],
};

const PREVIEW_THEME: Theme = {
  id: 'preview',
  name: 'Preview',
  colors: {
    primary: '#2563EB',
    secondary: '#64748B',
    text: '#0F172A',
    background: '#FFFFFF',
    accent: '#E0F2FE',
    backgroundImage: ''
  },
  typography: {
    fontFamily: 'Rubik, sans-serif',
    fontSize: { base: '14px', h1: '24px', h2: '18px', small: '12px' },
    lineHeight: '1.5'
  },
  headerConfig: {
    showTitle: true,
    showPhone: false,
    showEmail: false,
    showLocation: false,
    showLink: false,
    showAdditionalLink: false,
    showPhoto: true,
    uppercaseName: true,
    showDob: false,
    showNationality: false,
    photoStyle: 'circle'
  },
  columnConfig: { leftColumnWidth: 60, rightColumnWidth: 40 },
  spacing: { margin: '0', padding: '0', gap: '0' }
};

const EditorPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>('content');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
      {/* Top Bar Profesional - VitaeFlow */}
      <header className="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-5 shadow-sm z-20 shrink-0 font-sans">
        
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          {/* Logo VitaeFlow */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500 group-hover:scale-110 transition-transform duration-300">
              <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12C20 7.58172 16.4183 4 12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl text-gray-800 tracking-tight relative top-[1px]">VitaeFlow</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-gray-600 relative">
            <div className="relative">
              <button 
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${isCreateMenuOpen ? 'text-indigo-700 bg-indigo-50' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
              >
                <span>Crear nuevo</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1"/></svg>
              </button>

              {/* Dropdown Menu */}
              {isCreateMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCreateMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Documentos</span>
                    </div>
                    
                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3 group">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Nuevo CV</div>
                        <div className="text-xs text-gray-500">Empezar desde cero</div>
                      </div>
                    </button>

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3 group">
                      <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Hacer copia</div>
                        <div className="text-xs text-gray-500">Duplicar documento actual</div>
                      </div>
                    </button>

                    <div className="px-4 py-2 border-t border-b border-gray-50 mt-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Plantillas</span>
                    </div>

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3 group">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Currículum Vitae</div>
                        <div className="text-xs text-gray-500">Plantillas profesionales A4</div>
                      </div>
                    </button>

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3 group">
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Carta de Presentación</div>
                        <div className="text-xs text-gray-500">Diseños a juego con tu CV</div>
                      </div>
                    </button>

                    <div className="px-4 py-2 border-t border-b border-gray-50 mt-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Importar</span>
                    </div>

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3 group">
                      <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Subir PDF / LinkedIn</div>
                        <div className="text-xs text-gray-500">Analizar y convertir datos</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <a href="#" className="hover:text-gray-900 transition-colors">Documentos</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Trabajos guardados</a>
            <a href="#" className="flex items-center gap-1 hover:text-gray-900 transition-colors group">
              Ejemplos de CV 
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><path d="M7 17L17 7"/><path d="M7 7H17V17"/></svg>
            </a>
          </nav>
        </div>

        {/* Center: Document Status */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
           <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
           </div>
           <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[200px]">
                {cvState.personalDetails.jobTitle || 'CV Sin Título'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                (Guardado)
              </span>
           </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
           {/* CTA Mejorar */}
           <button className="hidden sm:flex px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wide rounded-md shadow-sm transition-all transform hover:-translate-y-0.5 items-center gap-2">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
             Mejorar
           </button>

           <div className="h-6 w-px bg-gray-200 mx-1"></div>

           {/* Descargar (Main Action) */}
           <button 
             onClick={handleSave} 
             className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md shadow-md transition-all flex items-center gap-2"
           >
             <span>{isLoading ? '...' : 'Descargar'}</span>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
           </button>

           {/* User Profile */}
           <div className="relative">
             <button 
               onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               className="w-9 h-9 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white border border-gray-200 hover:ring-emerald-100 transition-all"
             >
               JD
             </button>

             {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">JD</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">John Doe</div>
                        <div className="text-xs text-gray-500 truncate">john.doe@example.com</div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Mi Cuenta
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Suscripción (Pro)
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Ajustes
                      </button>
                    </div>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
             )}
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 1. Sidebar Fijo de Navegación */}
        <nav className="w-20 bg-white border-r border-gray-200 flex flex-col py-6 z-20 shrink-0 gap-4 shadow-[2px_0_10px_rgba(0,0,0,0.02)] relative">
          
          {navItems.map((item) => (
            <div key={item.id} className="w-full flex justify-center relative z-10">
              <button
                onClick={() => {
                  setActiveNav(item.id);
                  if (!isPanelOpen) setIsPanelOpen(true);
                }}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-16 group ${
                  activeNav === item.id 
                    ? 'text-blue-600 bg-blue-50/80 font-medium' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon />
                <span className="text-[10px]">{item.label}</span>
                
                {/* Indicador de estado (Punto) */}
                <div 
                   className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                     activeNav === item.id ? 'bg-blue-600 ring-2 ring-white' : 'bg-gray-300'
                   }`}
                />
              </button>
            </div>
          ))}

          {/* Botón de expansión cuando el panel está cerrado */}
          {!isPanelOpen && (
             <div 
                className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 z-50 pointer-events-none"
                style={{ width: '24px', height: '100px' }} 
             >
               <button 
                  onClick={() => setIsPanelOpen(true)}
                  className="pointer-events-auto bg-white border border-gray-200 border-l-0 rounded-r-lg p-1.5 shadow-md text-gray-500 hover:text-blue-600 hover:pl-2 transition-all flex items-center justify-center h-12 w-6"
                  title="Abrir panel"
               >
                  <Icons.ChevronRight />
               </button>
             </div>
          )}
        </nav>

        {/* 2. Panel Desplegable (Drawer) */}
        <aside 
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] relative z-10 shadow-xl ${
            isPanelOpen ? 'w-[380px] translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
          }`}
        >
          {/* Botón Flotante Colapsar (Solo visible cuando está abierto) */}
          {isPanelOpen && (
            <div 
               className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 z-50 pointer-events-none"
               style={{ width: '24px', height: '100px' }} 
            >
               <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="pointer-events-auto bg-white border border-gray-200 border-l-0 rounded-r-lg p-1.5 shadow-md text-gray-500 hover:text-blue-600 hover:pl-2 transition-all flex items-center justify-center h-12 w-6"
                  title="Cerrar panel"
               >
                  <Icons.ChevronLeft />
               </button>
            </div>
          )}

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
                 <div className="animate-fadeIn space-y-6">
                    <div className="flex justify-between items-end mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Plantillas</h2>
                      <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Galería</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {/* Modern Wave Card - Real Component Render */}
                       <div 
                          className="group relative aspect-[210/297] bg-white rounded-lg border-2 border-blue-500 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                          onClick={() => alert('Plantilla ya activa')}
                       >
                          {/* Contenedor Escalado para el Layout Real */}
                          <div className="w-full h-full overflow-hidden bg-white relative">
                             <div 
                               style={{ 
                                 width: '210mm', // Ancho real A4
                                 height: '297mm', // Alto real A4
                                 transform: 'scale(0.23)', // Escala calculada para encajar en el card (~170px width)
                                 transformOrigin: 'top left',
                                 pointerEvents: 'none', // Evitar interacción con el contenido mini
                                 userSelect: 'none'
                               }}
                             >
                                <ModernWaveLayout data={PREVIEW_DATA} theme={PREVIEW_THEME} />
                             </div>
                          </div>

                          <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors flex items-center justify-center z-10">
                             <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-sm">
                                Seleccionar
                             </div>
                          </div>
                          
                          <div className="absolute top-2 right-2 z-10">
                             <div className="bg-blue-600 text-white rounded-full p-1 shadow-sm">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                             </div>
                          </div>
                       </div>

                       {/* Placeholder para futuras plantillas */}
                       <div className="aspect-[210/297] bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2 hover:bg-gray-100 transition-colors cursor-not-allowed">
                          <span className="text-2xl">➕</span>
                          <span className="text-xs font-medium">Próximamente</span>
                       </div>
                    </div>
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 transition-all duration-300 custom-scrollbar relative">
            <div className="w-full flex justify-center items-start mb-8 min-h-0 shrink-0">
              <ResumePreview />
            </div>

            {/* Espaciador flexible para empujar el footer si sobra espacio */}
            <div className="flex-grow min-h-[4rem]"></div>

            <EditorFooter />
          </div>
        </main>
      </div>
    </div>
  );
};

// Footer Component independiente
const EditorFooter: React.FC = () => {
  return (
    <footer className="w-full max-w-[210mm] mt-8 pb-12 opacity-80 shrink-0 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="text-[10px] text-gray-400 italic font-medium">Currículums que los reclutadores aman</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <span>© 2026 VitaeFlow. Todos los derechos reservados.</span>
        </div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-800 transition-colors">Ejemplos de CV</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Mejorar</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Términos</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors">
          <span>Idioma</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </div>
      </div>
      
      <div className="mt-3 text-[9px] text-gray-400 text-center">
        This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
      </div>
    </footer>
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
