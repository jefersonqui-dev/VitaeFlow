import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateThemeColors, updateTypography, setLayout, updateColumnConfig } from '../theme/themeSlice';
import { LayoutId } from '../../types/theme';
import { BACKGROUND_PATTERNS } from '../../constants/backgrounds';

// Definición de Paletas Predefinidas
const COLOR_PALETTES = [
  {
    id: 'professional-blue',
    colors: { primary: '#2563EB', secondary: '#64748B', text: '#0F172A', background: '#FFFFFF', accent: '#E0F2FE' }
  },
  {
    id: 'midnight-slate',
    colors: { primary: '#0F172A', secondary: '#475569', text: '#1E293B', background: '#F8FAFC', accent: '#CBD5E1' }
  },
  {
    id: 'emerald-modern',
    colors: { primary: '#059669', secondary: '#4B5563', text: '#111827', background: '#FFFFFF', accent: '#D1FAE5' }
  },
  {
    id: 'ruby-executive',
    colors: { primary: '#DC2626', secondary: '#57534E', text: '#1C1917', background: '#FFFFFF', accent: '#FEE2E2' }
  },
  {
    id: 'royal-indigo',
    colors: { primary: '#4F46E5', secondary: '#6B7280', text: '#111827', background: '#FFFFFF', accent: '#E0E7FF' }
  },
  {
    id: 'dark-mode-sim',
    colors: { primary: '#3B82F6', secondary: '#94A3B8', text: '#F8FAFC', background: '#1E293B', accent: '#334155' }
  },
  {
    id: 'warm-earth',
    colors: { primary: '#B45309', secondary: '#78350F', text: '#292524', background: '#FFFBEB', accent: '#FEF3C7' }
  },
  {
    id: 'purple-haze',
    colors: { primary: '#7C3AED', secondary: '#6D28D9', text: '#111827', background: '#FFFFFF', accent: '#EDE9FE' }
  },
  {
    id: 'teal-ocean',
    colors: { primary: '#0D9488', secondary: '#115E59', text: '#134E4A', background: '#F0FDFA', accent: '#CCFBF1' }
  },
  {
    id: 'classic-black',
    colors: { primary: '#000000', secondary: '#666666', text: '#000000', background: '#FFFFFF', accent: '#E5E5E5' }
  }
];

const ThemeEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { customization, activeLayoutId } = useSelector((state: RootState) => state.theme);
  const { colors, typography, columnConfig } = customization;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado local para controlar si se muestra la edición avanzada de colores
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    dispatch(updateThemeColors({ [key]: value }));
  };

  const applyPalette = (paletteColors: typeof COLOR_PALETTES[0]['colors']) => {
    dispatch(updateThemeColors(paletteColors));
  };

  // Helper para detectar la paleta activa
  const isPaletteActive = (paletteColors: typeof COLOR_PALETTES[0]['colors']) => {
    return (
      colors.primary.toLowerCase() === paletteColors.primary.toLowerCase() &&
      colors.background.toLowerCase() === paletteColors.background.toLowerCase()
    );
  };

  const handleFontChange = (value: string) => {
    dispatch(updateTypography({ fontFamily: value }));
  };

  const handleLayoutChange = (layoutId: LayoutId) => {
    dispatch(setLayout(layoutId));
  };

  const handleColumnConfigChange = (left: number, right: number) => {
    dispatch(updateColumnConfig({ left, right }));
  };

  // Selector de imagen de fondo
  const handleBackgroundSelect = (value: string) => {
    dispatch(updateThemeColors({ backgroundImage: value }));
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateThemeColors({ backgroundImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFontSizeChange = (value: string) => {
    dispatch(updateTypography({ fontSize: { ...typography.fontSize, base: `${value}px` } }));
  };

  const handleLineHeightChange = (value: string) => {
    dispatch(updateTypography({ lineHeight: value }));
  };

  const fontOptions = [
    { label: 'Rubik (Custom)', value: 'CustomFont, sans-serif' },
    { label: 'Inter (Modern)', value: 'Inter, sans-serif' },
    { label: 'Merriweather (Classic)', value: 'Merriweather, serif' },
    { label: 'Roboto (Neutral)', value: 'Roboto, sans-serif' },
    { label: 'Open Sans (Friendly)', value: '"Open Sans", sans-serif' },
    { label: 'Playfair Display (Elegant)', value: '"Playfair Display", serif' },
  ];

  const layoutOptions: { id: LayoutId; label: string }[] = [
    { id: 'classic', label: 'Clásico' },
    { id: 'modern', label: 'Moderno' },
    { id: 'minimal', label: 'Minimalista' },
    { id: 'creative', label: 'Creativo' },
  ];

  const columnOptions = [
    { left: 30, right: 70, label: '30/70', id: 'col-30-70' },
    { left: 40, right: 60, label: '40/60', id: 'col-40-60' },
    { left: 50, right: 50, label: '50/50', id: 'col-50-50' },
    { left: 60, right: 40, label: '60/40', id: 'col-60-40' },
    { left: 70, right: 30, label: '70/30', id: 'col-70-30' },
  ];

  const currentLeftWidth = columnConfig?.leftColumnWidth || 60;

  return (
    <div className="space-y-8">
      {/* Layout Selection */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Distribución</h3>
        <div className="grid grid-cols-2 gap-3">
          {layoutOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleLayoutChange(option.id)}
              className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                activeLayoutId === option.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Column Configuration */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Disposición de Columnas</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columnOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleColumnConfigChange(option.left, option.right)}
              className={`flex-shrink-0 p-2 rounded-lg border-2 transition-all group ${
                currentLeftWidth === option.left
                  ? 'border-blue-600 ring-2 ring-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              title={`Izquierda: ${option.left}% | Derecha: ${option.right}%`}
            >
              <div className="flex gap-1 w-16 h-12 bg-gray-50 p-1 rounded border border-gray-100">
                <div 
                  className={`h-full rounded-sm transition-colors ${currentLeftWidth === option.left ? 'bg-blue-500' : 'bg-blue-200 group-hover:bg-blue-300'}`} 
                  style={{ width: `${option.left}%` }}
                ></div>
                <div 
                  className={`h-full rounded-sm transition-colors ${currentLeftWidth === option.left ? 'bg-blue-200' : 'bg-gray-200 group-hover:bg-gray-300'}`} 
                  style={{ width: `${option.right}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-center mt-1 font-medium text-gray-500">{option.left}/{option.right}</div>
            </button>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Typography */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Tipografía</h3>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Fuente Principal</label>
          <select
            value={typography.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size & Line Height Controls */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500">TAMAÑO DE FUENTE: {typography.fontSize.base}</label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">A</span>
              <input
                type="range"
                min="10"
                max="18"
                step="0.5"
                value={parseFloat(typography.fontSize.base)}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-lg text-gray-600">A</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500">INTERLINEADO: {typography.lineHeight}</label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">-</span>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={parseFloat(typography.lineHeight)}
                onChange={(e) => handleLineHeightChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs text-gray-600">+</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>condensado</span>
              <span>espacioso</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Background Selection Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Fondos</h3>
        
        {/* Grid limitado a 8 elementos (Sin fondo + 6 diseños + Upload) */}
        <div className="grid grid-cols-4 gap-3">
          {/* Opción Sin Fondo */}
          <button
            onClick={() => handleBackgroundSelect('')}
            className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
              !colors.backgroundImage 
                ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/50' 
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
            title="Sin fondo"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl text-gray-400">∅</span>
              <span className="text-gray-500 text-[10px] font-medium">Ninguno</span>
            </div>
          </button>

          {/* Muestra de los primeros 6 Patrones (Filtrando m1 a m6 si existen, o los primeros 6) */}
          {BACKGROUND_PATTERNS
            .filter(p => p.value !== '')
            .slice(5, 11) // Tomamos m1 a m6 (indices basados en la lista actual)
            .map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleBackgroundSelect(pattern.value)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all group ${
                colors.backgroundImage === pattern.value
                  ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              title={pattern.label}
            >
              {/* Thumbnail con Zoom */}
              <div 
                className="w-full h-full bg-no-repeat bg-top-left transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${pattern.value})`,
                  backgroundSize: '300%', 
                  backgroundColor: '#ffffff'
                }}
              />
              
              <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-[1px] text-[8px] font-medium text-center py-1 border-t border-gray-100 truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {pattern.label}
              </div>

              {colors.backgroundImage === pattern.value && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                </div>
              )}
            </button>
          ))}

          {/* Opción Subir Propio - Siempre visible en el slot 8 */}
          <div className="relative group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1"
              title="Subir imagen propia"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-blue-100 group-hover:text-blue-600">
                 <span className="text-sm">📤</span>
              </div>
              <span className="text-[9px] text-gray-500 font-medium group-hover:text-blue-600">Subir</span>
            </button>
            
            {/* Tooltip informativo sobre formatos */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 p-2 bg-gray-800 text-white text-[9px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center leading-tight">
              A4 (210x297mm)<br/>JPG, PNG, SVG
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>



        <input
          type="file"
          ref={fileInputRef}
          onChange={handleHeaderImageUpload}
          accept="image/*"
          className="hidden"
        />
        
        {colors.backgroundImage && !BACKGROUND_PATTERNS.some(p => p.value === colors.backgroundImage) && (
           <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
             <span>✨</span> Usando imagen personalizada
           </div>
        )}
      </section>

      <hr className="border-gray-100" />

      {/* Colors Section - New Palette UI */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Paleta de Colores</h3>
        
        {/* Grid de Paletas Predefinidas */}
        <div className="flex flex-wrap gap-4">
          {COLOR_PALETTES.map((palette) => {
            const isActive = isPaletteActive(palette.colors);
            return (
              <button
                key={palette.id}
                onClick={() => applyPalette(palette.colors)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group ${
                  isActive 
                    ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' 
                    : 'hover:scale-110 hover:shadow-md'
                }`}
                title="Aplicar paleta"
              >
                {/* Círculo Principal con gradiente o división para mostrar Primary/Accent */}
                <div 
                  className="w-full h-full rounded-full border border-gray-100 overflow-hidden shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${palette.colors.primary} 50%, ${palette.colors.secondary} 50%)`
                  }}
                />
                
                {/* Indicador de selección (Check) */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-[1px] rounded-full p-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Botón de "Más / Personalizar" */}
          <button
            onClick={() => setShowAdvancedColors(!showAdvancedColors)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed transition-all ${
              showAdvancedColors 
                ? 'border-blue-500 bg-blue-50 text-blue-600 rotate-45' 
                : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-gray-50'
            }`}
            title={showAdvancedColors ? "Cerrar personalización" : "Personalizar colores"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Editor Avanzado (Colapsable) */}
        {showAdvancedColors && (
          <div className="pt-4 pb-2 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
             <div className="flex items-center justify-between group">
              <label className="text-sm text-gray-700 font-medium">Color Principal</label>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-xs text-gray-400 font-mono uppercase">{colors.primary}</span>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <label className="text-sm text-gray-700 font-medium">Color Secundario</label>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-xs text-gray-400 font-mono uppercase">{colors.secondary}</span>
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <label className="text-sm text-gray-700 font-medium">Texto</label>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-xs text-gray-400 font-mono uppercase">{colors.text}</span>
                <input
                  type="color"
                  value={colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <label className="text-sm text-gray-700 font-medium">Fondo</label>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-xs text-gray-400 font-mono uppercase">{colors.background}</span>
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <label className="text-sm text-gray-700 font-medium">Acento</label>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-xs text-gray-400 font-mono uppercase">{colors.accent}</span>
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ThemeEditor;
