import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ResumePreview: React.FC = () => {
  const resume = useSelector((state: RootState) => state.resume);
  const { personalDetails } = resume;

  return (
    <div className="p-8 bg-white shadow-lg min-h-[297mm] w-[210mm] mx-auto text-gray-800">
      <header className="border-b-2 border-gray-300 pb-4 mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold uppercase">{personalDetails.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-600">
            {personalDetails.email && <span>📧 {personalDetails.email}</span>}
            {personalDetails.phone && <span>📱 {personalDetails.phone}</span>}
            {personalDetails.address && <span>📍 {personalDetails.address}</span>}
          </div>
        </div>
        {personalDetails.profilePicture && (
          <img 
            src={personalDetails.profilePicture} 
            alt="Profile" 
            className="w-24 h-24 object-cover rounded-md border border-gray-200"
          />
        )}
      </header>

      {personalDetails.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-gray-200 mb-2">Summary</h3>
          <p className="text-sm leading-relaxed">{personalDetails.summary}</p>
        </section>
      )}

      {/* TODO: Add sections for Experience, Education, Skills */}
      <div className="text-center text-gray-400 mt-10 italic">
        (Experience and Education sections will appear here)
      </div>
    </div>
  );
};

export default ResumePreview;
