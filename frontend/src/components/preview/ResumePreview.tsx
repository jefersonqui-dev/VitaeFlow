import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ModernWaveLayout } from '../../templates/ModernWave';

const ResumePreview: React.FC = () => {
  const cvData = useSelector((state: RootState) => state.cv);
  const theme = useSelector((state: RootState) => state.theme.customization);
  
  // En el futuro, aquí podríamos tener un switch para múltiples layouts
  // const layoutId = useSelector((state: RootState) => state.theme.activeLayoutId);

  return (
    <div className="flex justify-center my-8 print:my-0">
      <ModernWaveLayout data={cvData} theme={theme} />
    </div>
  );
};

export default ResumePreview;
