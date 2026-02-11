import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ModernWaveLayout } from '../../templates/ModernWave';
import api from '../../services/api';

export interface ResumePreviewHandle {
  handleDownload: () => Promise<void>;
  isDownloading: boolean;
}

const ResumePreview = forwardRef<ResumePreviewHandle, {}>((_, ref) => {
  const cvData = useSelector((state: RootState) => state.cv);
  const theme = useSelector((state: RootState) => state.theme.customization);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // Default scale 1 for full preview (Real Size)
  const [previewScale, setPreviewScale] = useState(1);

  // Expose download function to parent via ref
  useImperativeHandle(ref, () => ({
    handleDownload,
    isDownloading
  }));

  // Auto-scale logic for main view
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement?.parentElement; 
      if (!parent) return;

      const availableWidth = parent.clientWidth - 32; 
      // A4 width (210mm) @ 96 DPI is approx 794px
      const docWidthPx = 794; 
      
      const newScale = Math.min(Math.max((availableWidth) / docWidthPx, 0.3), 1.05);
      setScale(newScale);
    };

    handleResize();
    
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current?.parentElement?.parentElement) {
      observer.observe(containerRef.current.parentElement.parentElement);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      setIsDownloading(true);

      // 1. Clonar nodo para limpiar estilos de escala (transform)
      const clone = containerRef.current.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.margin = '0 auto';
      clone.style.boxShadow = 'none'; // Quitar sombras si las hubiera en el preview

      // 2. Capturar estilos actuales (Tailwind + Custom)
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(node => node.outerHTML)
        .join('');
      
      const content = clone.outerHTML;
      
      // 3. Construir Payload HTML completo
      const htmlPayload = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <base href="${window.location.origin}/" />
            ${styles}
            <style>
              body { margin: 0; padding: 0; background: white; }
              @page { size: A4; margin: 0; }
              /* Asegurar que el contenedor ocupe el full width A4 */
              .print\\:m-0 { margin: 0 !important; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;

      // 4. Enviar al Backend
      const response = await api.post('/pdf', { html: htmlPayload }, {
        responseType: 'blob' // Importante para archivos binarios
      });

      // 5. Descargar archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed', error);
      alert('Error al generar el PDF. Asegúrate de que el backend esté corriendo.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace copiado al portapapeles");
  };

  const handlePremium = () => {
    alert("Funcionalidad Premium");
  };

  return (
    <div className="flex flex-col items-center bg-transparent h-auto w-auto print:p-0 print:block relative">
      {/* Documento Principal */}
      <div 
        ref={containerRef}
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out',
          width: '210mm' /* Force exact A4 width */
        }}
        className="origin-top print:transform-none print:m-0"
      >
        <ModernWaveLayout data={cvData} theme={theme} />
      </div>

      {/* Barra de Herramientas Flotante (Sticky + Absolute) */}
      <div 
        className="absolute top-0 h-full print:hidden pointer-events-none"
        style={{ 
          // Posicionado desde el centro hacia la derecha, casi pegado al documento (gap reducido)
          left: `calc(50% + ${(794 * scale) / 2}px + 4px)`,
        }}
      >
        <div className="sticky top-0 flex flex-col gap-2 pointer-events-auto">
          <button 
            onClick={() => setShowFullPreview(true)}
            className="w-9 h-9 bg-white rounded-md shadow-sm hover:shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all border border-gray-200"
            title="Vista Previa Pantalla Completa"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-9 h-9 bg-white rounded-md shadow-sm hover:shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all border border-gray-200 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Descargar PDF"
          >
            {isDownloading ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            )}
          </button>

          <button 
            onClick={handleShare}
            className="w-9 h-9 bg-white rounded-md shadow-sm hover:shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all border border-gray-200"
            title="Compartir enlace"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>

          <button 
            onClick={handlePremium}
            className="w-9 h-9 bg-amber-400 rounded-md shadow-sm hover:shadow-md hover:bg-amber-500 flex items-center justify-center text-white transition-all border border-amber-300"
            title="Funciones Premium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
          </button>
        </div>
      </div>

      {/* Modal Vista Previa Full Screen */}
      {showFullPreview && (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-900/80 backdrop-blur-md animate-fadeIn overflow-auto" onClick={(e) => {
             if (e.target === e.currentTarget) setShowFullPreview(false);
        }}>
          {/* Botón Cerrar */}
          <button 
            onClick={() => setShowFullPreview(false)}
            className="fixed top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all z-[60]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
          </button>

          {/* Contenedor del Documento */}
          <div className="py-10 flex flex-col items-center min-h-min pointer-events-none">
            <div 
               style={{ 
                 transform: `scale(${previewScale})`, 
                 transformOrigin: 'top center',
                 // Forzar que el width sea el del A4 real para que el renderizado sea correcto antes de escalar
                 width: '210mm'
               }}
               className="shadow-2xl pointer-events-auto"
            >
               <ModernWaveLayout data={cvData} theme={theme} />
            </div>
            {/* Espaciador inferior para compensar el layout flow del transform scale si es necesario, 
                pero con flex-col y py-10 suele funcionar bien para scroll */}
          </div>
        </div>
      )}
    </div>
  );
});

export default ResumePreview;
