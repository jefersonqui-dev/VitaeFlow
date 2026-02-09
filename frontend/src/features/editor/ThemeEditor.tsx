import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateThemeColors, updateTypography, setLayout, updateColumnConfig } from '../theme/themeSlice';
import { LayoutId } from '../../types/theme';
import { BACKGROUND_PATTERNS } from '../../constants/backgrounds';

const ThemeEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { customization, activeLayoutId } = useSelector((state: RootState) => state.theme);
  const { colors, typography, columnConfig } = customization;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    dispatch(updateThemeColors({ [key]: value }));
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
        
        <div className="grid grid-cols-4 gap-3">
          {/* Opción Sin Fondo */}
          <button
            onClick={() => handleBackgroundSelect('')}
            className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
              !colors.backgroundImage 
                ? 'border-blue-600 ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            title="Sin fondo"
          >
            <span className="text-gray-400 text-xs">Ninguno</span>
          </button>

          {/* Patrones Predefinidos */}
          {BACKGROUND_PATTERNS.filter(p => p.value !== '').map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleBackgroundSelect(pattern.value)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                colors.backgroundImage === pattern.value
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={pattern.label}
            >
              <img 
                src={pattern.value} 
                alt={pattern.label} 
                className="w-full h-full object-cover"
              />
              {colors.backgroundImage === pattern.value && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
              )}
            </button>
          ))}

          {/* Opción Subir Propio */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 group"
            title="Subir imagen propia"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📤</span>
            <span className="text-[10px] text-gray-500 font-medium">Subir</span>
          </button>
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

      {/* Colors */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Paleta de Colores</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between group">
            <label className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Color Principal</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">{colors.primary}</span>
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between group">
            <label className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Color Secundario</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">{colors.secondary}</span>
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between group">
            <label className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Texto</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">{colors.text}</span>
              <input
                type="color"
                value={colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between group">
            <label className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Fondo</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">{colors.background}</span>
              <input
                type="color"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
            </div>
          </div>

           <div className="flex items-center justify-between group">
            <label className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Acento</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">{colors.accent}</span>
              <input
                type="color"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeEditor;
