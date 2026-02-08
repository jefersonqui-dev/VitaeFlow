import api from './api';
import { Resume } from '../types/resume';

const createResume = async (resumeData: Partial<Resume>) => {
  const response = await api.post('/resumes', resumeData);
  return response.data;
};

const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

const getResumeById = async (id: string) => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

const updateResume = async (id: string, resumeData: Partial<Resume>) => {
  const response = await api.put(`/resumes/${id}`, resumeData);
  return response.data;
};

const resumeService = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
};

export default resumeService;
