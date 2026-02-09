import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ModernWaveLayout } from '../../templates/ModernWave';

const ResumePreview: React.FC = () => {
  const cvData = useSelector((state: RootState) => state.cv);
  const theme = useSelector((state: RootState) => state.theme.customization);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-scale logic to fit A4 in available width/height
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement?.parentElement; 
      if (!parent) return;

      const availableWidth = parent.clientWidth - 32; 
      // A4 width (210mm) @ 96 DPI is approx 794px
      const docWidthPx = 794; 
      
      // Permitimos que se encoja si no cabe, pero limitamos crecimiento a 1.05x
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

  return (
    <div className="flex flex-col items-center bg-transparent h-auto w-auto print:p-0 print:block">
      <div 
        ref={containerRef}
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out',
          width: '210mm' /* Force exact A4 width */
        }}
        className="origin-top print:transform-none print:m-0 shadow-2xl"
      >
        <ModernWaveLayout data={cvData} theme={theme} />
      </div>
    </div>
  );
};

export default ResumePreview;
