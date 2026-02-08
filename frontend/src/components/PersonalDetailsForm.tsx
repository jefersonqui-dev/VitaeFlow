import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updatePersonalDetails } from '../store/resumeSlice';
import fileService from '../services/fileService';

const PersonalDetailsForm: React.FC = () => {
  const dispatch = useDispatch();
  const personalDetails = useSelector((state: RootState) => state.resume.personalDetails);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updatePersonalDetails({ [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await fileService.uploadImage(file);
      dispatch(updatePersonalDetails({ profilePicture: url }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console and ensure AWS creds are set in backend.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Personal Details</h2>
      
      {/* Image Upload */}
      <div className="mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
          {personalDetails.profilePicture ? (
            <img src={personalDetails.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Img</div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-3 rounded"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={personalDetails.fullName}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={personalDetails.email}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={personalDetails.phone}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
         <input
          type="text"
          name="address"
          placeholder="Address"
          value={personalDetails.address}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={personalDetails.summary}
          onChange={handleChange}
          className="p-2 border rounded w-full h-24"
        />
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
