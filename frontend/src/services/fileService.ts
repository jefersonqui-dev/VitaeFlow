import api from './api';
import axios from 'axios';

const USE_LOCAL_STORAGE = true; // Change this to false when AWS is configured

const uploadImage = async (file: File): Promise<string> => {
  if (USE_LOCAL_STORAGE) {
    // Local Upload Flow
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/upload/local', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.publicUrl;
  } else {
    // AWS S3 Direct Upload Flow
    // 1. Get Presigned URL from Backend
    const { data } = await api.post('/upload/presigned-url', {
      fileType: file.type,
      folder: 'profile-pictures'
    });
  
    const { uploadUrl, publicUrl } = data;
  
    // 2. Upload directly to S3 (PUT)
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  
    return publicUrl;
  }
};

const fileService = {
  uploadImage,
};

export default fileService;
