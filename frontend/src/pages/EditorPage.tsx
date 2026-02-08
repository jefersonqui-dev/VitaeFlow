import React from 'react';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import ResumePreview from '../components/ResumePreview';
import { useDispatch, useSelector } from 'react-redux';
import { saveResume } from '../store/resumeSlice';
import { AppDispatch, RootState } from '../store';

const EditorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const resumeState = useSelector((state: RootState) => state.resume);

  const handleSave = () => {
    // We pass the whole resume state (excluding loading flags which are stripped or ignored by backend usually, 
    // but better to sanitize. For now, passing state is "okay" as prototype)
    dispatch(saveResume(resumeState));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resume SaaS Builder</h1>
        <button 
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-bold"
        >
          {resumeState.isLoading ? 'Saving...' : 'Save Resume'}
        </button>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex gap-8">
        <div className="w-1/3 space-y-6 overflow-y-auto h-[calc(100vh-100px)]">
          <PersonalDetailsForm />
        </div>

        <div className="w-2/3 bg-gray-500 p-8 overflow-y-auto h-[calc(100vh-100px)] flex justify-center">
          <ResumePreview />
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
