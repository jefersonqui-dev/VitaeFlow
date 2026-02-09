import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal } from '../ui/Modal';
import getCroppedImg from '../../utils/canvasUtils';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Image: string) => void;
  initialImage?: string;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialImage
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setIsPreviewMode(false);
      setPreviewImage(null);
      setZoom(1);
    }
  }, [isOpen]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePreview = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setPreviewImage(croppedImage);
        setIsPreviewMode(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = () => {
    if (previewImage) {
      onSave(previewImage);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subir foto">
      <div className="flex flex-col items-center p-6 gap-6">
        
        {!imageSrc ? (
          // Paso 1: Selección de archivo
          <div className="w-full flex flex-col items-center gap-4 py-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <label className="cursor-pointer bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Seleccionar imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500">JPG, PNG o WEBP</p>
          </div>
        ) : !isPreviewMode ? (
          // Paso 2: Edición (Crop & Zoom)
          <div className="w-full flex flex-col gap-4">
            <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect" // Cuadrado como en la ref 1, aunque el resultado es round
                showGrid={false}
              />
            </div>
            
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-gray-500">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setImageSrc(null)}
                className="flex-1 py-2.5 px-4 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleGeneratePreview}
                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        ) : (
          // Paso 3: Previsualización Final
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-indigo-100">
              <img src={previewImage!} alt="Preview" className="w-full h-full object-cover" />
            </div>
            
            <div className="text-center text-sm text-gray-600 px-4">
              Así se verá tu foto de perfil en el currículum.
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="flex-1 py-2.5 px-4 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
