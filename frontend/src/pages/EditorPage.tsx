import React, { useState } from 'react';
import PersonalDetailsForm from '../components/editor/PersonalDetailsForm';
import ResumePreview from '../components/preview/ResumePreview';
import ThemeEditor from '../features/editor/ThemeEditor';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import ExperienceEditor from '../components/editor/ExperienceEditor';
import EducationEditor from '../components/editor/EducationEditor';

// Componentes de formulario simples para secciones adicionales
const ContentEditorSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </section>
);

const ExperienceEditorSection: React.FC = () => (
  <ContentEditorSection title="Experiencia Laboral">
    <ExperienceEditor />
  </ContentEditorSection>
);

import SkillsEditor from '../components/editor/SkillsEditor';

const SkillsEditorSection: React.FC = () => (
  <ContentEditorSection title="Habilidades">
    <SkillsEditor />
  </ContentEditorSection>
);

const EducationEditorSection: React.FC = () => (
  <ContentEditorSection title="Educación">
    <EducationEditor />
  </ContentEditorSection>
);

type EditorTab = 'content' | 'design' | 'settings';
type ContentSection = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

import CertificationsEditor from '../components/editor/CertificationsEditor';

const CertificationsEditorSection: React.FC = () => (
  <ContentEditorSection title="Certificaciones">
    <CertificationsEditor />
  </ContentEditorSection>
);

const EditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('content');
  const [activeContentSection, setActiveContentSection] = useState<ContentSection>('personal');
  const cvState = useSelector((state: RootState) => state.cv);

  const handleSave = () => {
    console.log("Guardar pendiente de migración:", cvState);
    alert("Funcionalidad de guardado en mantenimiento durante el refactor.");
  };

  const isLoading = false;

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-6 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <h1 className="text-lg font-bold text-gray-800">Resume Builder</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden md:inline">Ultimo guardado: Pendiente</span>
          <button 
            onClick={handleSave}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Descargar PDF / Guardar'}
          </button>
        </div>
      </header>
      
      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Editor Area */}
        <aside className="w-full md:w-[450px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'content' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contenido
            </button>
            <button 
              onClick={() => setActiveTab('design')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'design' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Diseño
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ajustes
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50/50">
            {activeTab === 'content' && (
              <div className="p-6">
                 {/* Section Navigation (Sub-tabs within Content) */}
                <div className="mb-6 pb-2 border-b border-gray-200 overflow-x-auto">
                   <div className="flex gap-2">
                     <button 
                        onClick={() => setActiveContentSection('personal')}
                        className={`border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${activeContentSection === 'personal' ? 'bg-white border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                     >
                       Personal
                     </button>
                     <button 
                        onClick={() => setActiveContentSection('experience')}
                        className={`border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${activeContentSection === 'experience' ? 'bg-white border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                     >
                       Experiencia
                     </button>
                     <button 
                        onClick={() => setActiveContentSection('education')}
                        className={`border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${activeContentSection === 'education' ? 'bg-white border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                     >
                       Educación
                     </button>
                     <button 
                        onClick={() => setActiveContentSection('skills')}
                        className={`border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${activeContentSection === 'skills' ? 'bg-white border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                     >
                       Habilidades
                     </button>
                     <button 
                        onClick={() => setActiveContentSection('certifications')}
                        className={`border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${activeContentSection === 'certifications' ? 'bg-white border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                     >
                       Certificaciones
                     </button>
                   </div>
                </div>
                
                {activeContentSection === 'personal' && <PersonalDetailsForm />}
                {activeContentSection === 'experience' && <ExperienceEditorSection />}
                {activeContentSection === 'education' && <EducationEditorSection />}
                {activeContentSection === 'skills' && <SkillsEditorSection />}
                {activeContentSection === 'certifications' && <CertificationsEditorSection />}
                
                {activeContentSection === 'projects' && (
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      Sección en desarrollo...
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'design' && (
              <div className="p-6">
                <ThemeEditor />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-10 text-center text-gray-500">
                <span className="text-4xl block mb-2">⚙️</span>
                <p>Configuración de cuenta próximamente</p>
              </div>
            )}
          </div>
        </aside>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 overflow-auto flex justify-center p-8 md:p-12 relative">
          <div className="scale-[0.6] md:scale-[0.7] lg:scale-[0.85] origin-top transition-transform duration-300">
             <ResumePreview />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
