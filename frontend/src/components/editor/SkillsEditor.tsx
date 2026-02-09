import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addSkill, updateSkill, removeSkill } from '../../features/cv/cvSlice';
import { Skill } from '../../types/resume';
import { v4 as uuidv4 } from 'uuid';

const PREDEFINED_CATEGORIES = [
  'Backend & Core',
  'Frontend & UI',
  'IA & Data Science',
  'Herramientas & DevOps',
  'Soft Skills',
  'Otras'
];

const SkillsEditor: React.FC = () => {
  const dispatch = useDispatch();
  const skills = useSelector((state: RootState) => state.cv.skills);
  
  // State for managing editing
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkillCategory, setNewSkillCategory] = useState<string | null>(null); // Stores category name when adding new skill to a specific category
  const [formState, setFormState] = useState<Partial<Skill>>({ name: '', level: 3 });

  // Separate skills into "Idiomas" and others
  const languageSkills = skills.filter(s => (s.category || '').toLowerCase() === 'idiomas');
  const technicalSkills = skills.filter(s => (s.category || '').toLowerCase() !== 'idiomas');

  // Group technical skills
  const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
    const cat = skill.category || 'Otras';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Handlers
  const handleSave = (category: string) => {
    if (!formState.name) return;

    if (editingSkillId) {
      dispatch(updateSkill({ 
        id: editingSkillId, 
        name: formState.name, 
        level: formState.level || 3,
        category: category 
      } as Skill));
    } else {
      dispatch(addSkill({
        id: uuidv4(),
        name: formState.name,
        level: formState.level || 3,
        category: category
      }));
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingSkillId(null);
    setNewSkillCategory(null);
    setFormState({ name: '', level: 3 });
  };

  const startEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setFormState({ name: skill.name, level: skill.level });
    setNewSkillCategory(null);
  };

  const startAdd = (category: string) => {
    setNewSkillCategory(category);
    setEditingSkillId(null);
    setFormState({ name: '', level: 3 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar?')) {
      dispatch(removeSkill(id));
    }
  };

  const renderSkillForm = (category: string, isLanguage = false) => (
    <div className="mt-3 p-3 bg-white border border-blue-200 rounded-md shadow-sm animate-in fade-in slide-in-from-top-1">
      <div className="flex gap-2 mb-2">
        <input
          autoFocus
          type="text"
          placeholder={isLanguage ? "Idioma (ej. Inglés)" : "Habilidad (ej. React)"}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={formState.name}
          onChange={e => setFormState({ ...formState, name: e.target.value })}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(category); }}
        />
        <select 
          className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
          value={formState.level}
          onChange={e => setFormState({ ...formState, level: parseInt(e.target.value) })}
        >
          {isLanguage ? (
            <>
              <option value={1}>Básico</option>
              <option value={2}>Intermedio</option>
              <option value={3}>Conversacional</option>
              <option value={4}>Avanzado</option>
              <option value={5}>Nativo</option>
            </>
          ) : (
            <>
              <option value={1}>Principiante</option>
              <option value={2}>Básico</option>
              <option value={3}>Intermedio</option>
              <option value={4}>Avanzado</option>
              <option value={5}>Experto</option>
            </>
          )}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Cancelar</button>
        <button 
          onClick={() => handleSave(category)} 
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
        >
          Guardar
        </button>
      </div>
    </div>
  );

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // Just start adding a skill to this new category to "create" it visually
      startAdd(newCategoryName);
      setAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (window.confirm(`¿Eliminar la categoría "${category}" y todas sus habilidades?`)) {
      const skillsToDelete = skills.filter(s => s.category === category);
      skillsToDelete.forEach(s => dispatch(removeSkill(s.id)));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* SECCIÓN 1: HABILIDADES TÉCNICAS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold text-gray-700">Habilidades Técnicas</h3>
          {!addingCategory ? (
            <button 
              onClick={() => setAddingCategory(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              + Nueva Categoría
            </button>
          ) : (
            <div className="flex gap-2 items-center animate-in fade-in slide-in-from-right-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Nombre categoría..." 
                className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') handleAddCategory() }}
              />
              <button onClick={handleAddCategory} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Ok</button>
              <button onClick={() => setAddingCategory(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(groupedTechnicalSkills).map(([category, items]) => (
            <div key={category} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-sm text-gray-700">{category}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar categoría"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                  <button 
                    onClick={() => startAdd(category)}
                    className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-2 py-1 rounded shadow-sm transition-colors"
                  >
                    + Añadir
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <div 
                      key={skill.id} 
                      className={`
                        relative group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all cursor-pointer select-none
                        ${editingSkillId === skill.id ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}
                      `}
                      onClick={() => startEdit(skill)}
                    >
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      {/* Level dots mini */}
                      <div className="flex gap-0.5 opacity-50">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1 h-1 rounded-full ${i < skill.level ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        ))}
                      </div>
                      
                      {/* Hover Actions */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(skill.id); }}
                        className="ml-1 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Inline Form for this Category */}
                {(newSkillCategory === category || items.some(i => i.id === editingSkillId)) && renderSkillForm(category)}
              </div>
            </div>
          ))}
          
          {/* If a new category is started but has no skills yet (handled by startAdd state logic mostly, but here for safety if we wanted empty state) */}
          {newSkillCategory && !Object.keys(groupedTechnicalSkills).includes(newSkillCategory) && (
             <div className="bg-blue-50 rounded-xl border border-blue-200 overflow-hidden">
               <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
                 <span className="font-semibold text-sm text-blue-800">{newSkillCategory}</span>
               </div>
               <div className="p-3">
                 {renderSkillForm(newSkillCategory)}
               </div>
             </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: IDIOMAS */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
            🌐 Idiomas
          </h3>
          <button 
            onClick={() => startAdd('Idiomas')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Añadir Idioma
          </button>
        </div>

        <div className="space-y-2">
          {languageSkills.map(lang => (
            <div 
              key={lang.id} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group cursor-pointer"
              onClick={() => startEdit(lang)}
            >
              <div>
                <span className="font-semibold text-gray-800">{lang.name}</span>
                <span className="text-gray-400 text-sm mx-2">•</span>
                <span className="text-sm text-blue-600 font-medium">
                  {lang.level === 5 ? 'Nativo' : lang.level === 4 ? 'Avanzado' : lang.level === 3 ? 'Conversacional' : 'Básico'}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(lang.id); }}
                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          ))}
          
          {languageSkills.length === 0 && !newSkillCategory && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
              No has añadido idiomas aún.
            </div>
          )}

          {/* Form for Languages */}
          {(newSkillCategory === 'Idiomas' || languageSkills.some(l => l.id === editingSkillId)) && renderSkillForm('Idiomas', true)}
        </div>
      </div>

    </div>
  );
};

export default SkillsEditor;
