import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updatePersonalDetails } from '../../features/cv/cvSlice';
import fileService from '../../services/fileService';
import { ImageCropperModal } from './ImageCropperModal';
import { HeaderConfigMenu } from './HeaderConfigMenu';
import { MonthYearPicker } from '../ui/MonthYearPicker';

const PersonalDetailsForm: React.FC = () => {
  const dispatch = useDispatch();
  const personalDetails = useSelector((state: RootState) => state.cv.personalDetails);
  
  // Date Picker State for DOB
  const [datePickerState, setDatePickerState] = useState<{
    isOpen: boolean;
    anchorEl: HTMLElement | null;
  }>({ isOpen: false, anchorEl: null });
  // Default fallback if headerConfig is undefined
  const headerConfig = useSelector((state: RootState) => state.theme.customization.headerConfig) || {
    showTitle: true,
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showLink: true,
    showAdditionalLink: true,
    showPhoto: true,
    uppercaseName: true,
    showDob: false,
    showNationality: false,
    photoStyle: 'circle'
  };

  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updatePersonalDetails({ [name]: value }));
  };
  
  const handleLinksChange = (index: number, value: string) => {
    const newLinks = [...(personalDetails.links || [])];
    if (newLinks[index]) {
      newLinks[index] = { ...newLinks[index], url: value };
    } else {
      newLinks[index] = { label: 'Link', url: value };
    }
    dispatch(updatePersonalDetails({ links: newLinks }));
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) return null;
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const openDatePicker = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDatePickerState({
      isOpen: true,
      anchorEl: e.currentTarget
    });
  };

  const handleDateChange = (value: string) => {
    dispatch(updatePersonalDetails({ dateOfBirth: value }));
  };

  const handleImageSave = async (base64Image: string) => {
    try {
      setUploading(true);
      const file = dataURLtoFile(base64Image, 'profile-picture.jpg');
      
      if (file) {
        const url = await fileService.uploadImage(file);
        dispatch(updatePersonalDetails({ profilePicture: url }));
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      <MonthYearPicker
        isOpen={datePickerState.isOpen}
        onClose={() => setDatePickerState(prev => ({ ...prev, isOpen: false }))}
        value={personalDetails.dateOfBirth || ''}
        onChange={handleDateChange}
        anchorEl={datePickerState.anchorEl}
        includeDay={true}
      />

      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Detalles Personales</h2>
        <HeaderConfigMenu />
      </div>
      
      {/* Profile Picture Upload - Visible only if showPhoto is enabled */}
      {headerConfig.showPhoto && (
        <div className="flex items-start gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {personalDetails.profilePicture ? (
                <img src={personalDetails.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-2xl">📷</span>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
              title="Upload Photo"
            >
              {uploading ? (
                <span className="animate-spin block h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Sube una foto profesional. Se recomienda 400x400px.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Cambiar foto
            </button>
          </div>
        </div>
      )}

      <ImageCropperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleImageSave}
        initialImage={personalDetails.profilePicture}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Nombre Completo</label>
          <input
            type="text"
            name="fullName"
            placeholder="Ej. Juan Pérez"
            value={personalDetails.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
        
        {headerConfig.showTitle && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Título Profesional</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Ej. Full Stack Developer"
              value={personalDetails.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        )}

        {headerConfig.showEmail && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
            <input
              type="email"
              name="email"
              placeholder="juan@ejemplo.com"
              value={personalDetails.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        )}

        {headerConfig.showPhone && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Teléfono</label>
            <input
              type="text"
              name="phone"
              placeholder="+34 600 000 000"
              value={personalDetails.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        )}

        {headerConfig.showLocation && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Dirección / Ubicación</label>
            <input
              type="text"
              name="address"
              placeholder="Madrid, España"
              value={personalDetails.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        )}

        {headerConfig.showLink && (
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase">Enlace (Web/LinkedIn)</label>
             <input
               type="text"
               placeholder="https://linkedin.com/in/..."
               value={personalDetails.links?.[0]?.url || ''}
               onChange={(e) => handleLinksChange(0, e.target.value)}
               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
             />
           </div>
        )}
        
        {headerConfig.showAdditionalLink && (
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase">Enlace Adicional</label>
             <input
               type="text"
               placeholder="https://github.com/..."
               value={personalDetails.links?.[1]?.url || ''}
               onChange={(e) => handleLinksChange(1, e.target.value)}
               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
             />
           </div>
        )}
        
        {headerConfig.showDob && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de Nacimiento</label>
            <input
              type="text"
              name="dateOfBirth"
              readOnly
              placeholder="DD/MM/AAAA"
              value={personalDetails.dateOfBirth || ''}
              onClick={openDatePicker}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer hover:bg-gray-50"
            />
          </div>
        )}
        
        {headerConfig.showNationality && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Nacionalidad</label>
            <input
              type="text"
              name="nationality"
              placeholder="Española"
              value={personalDetails.nationality || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        )}

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Perfil Profesional</label>
          <textarea
            name="summary"
            placeholder="Breve descripción de tu perfil profesional..."
            value={personalDetails.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y transition-shadow"
          />
        </div>
      </div>
    </section>
  );
};


export default PersonalDetailsForm;
