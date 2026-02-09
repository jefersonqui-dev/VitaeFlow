import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updatePersonalDetails } from '../../features/cv/cvSlice';
import { updateHeaderConfig } from '../../features/theme/themeSlice';
import fileService from '../../services/fileService';
import { ImageCropperModal } from './ImageCropperModal';
import { HeaderConfigMenu } from './HeaderConfigMenu';
import { MonthYearPicker } from '../ui/MonthYearPicker';
import RichTextEditor from '../ui/RichTextEditor';

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
        // Ensure photo is shown after upload
        dispatch(updateHeaderConfig({ showPhoto: true }));
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const togglePhotoVisibility = (show: boolean) => {
    dispatch(updateHeaderConfig({ showPhoto: show }));
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
      
      {/* Profile Picture Controls */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group w-28 h-28 flex-shrink-0">
          <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-gray-100 transition-all ${!headerConfig.showPhoto ? 'opacity-50 grayscale' : ''}`}>
            {personalDetails.profilePicture ? (
              <img src={personalDetails.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
            )}
          </div>
          
          {/* Overlay Controls */}
          <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 backdrop-blur-sm rounded-full ${
             !headerConfig.showPhoto 
               ? 'bg-gray-100/80 opacity-100' 
               : 'bg-black/60 opacity-0 group-hover:opacity-100'
          }`}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
              title="Cambiar Foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            
            <button
              onClick={() => togglePhotoVisibility(!headerConfig.showPhoto)}
              className={`w-9 h-9 text-white rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all ${
                headerConfig.showPhoto ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title={headerConfig.showPhoto ? "Ocultar Foto" : "Mostrar Foto"}
            >
              {headerConfig.showPhoto ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

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
          <RichTextEditor
            content={personalDetails.summary}
            onChange={(html) => dispatch(updatePersonalDetails({ summary: html }))}
            placeholder="Breve descripción de tu perfil profesional..."
          />
        </div>
      </div>
    </section>
  );
};


export default PersonalDetailsForm;
