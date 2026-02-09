import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume, PersonalDetails, Experience, Education, Skill } from '../../types/resume';

// Estado inicial limpio, solo datos del CV
const initialState: Resume = {
  personalDetails: {
    fullName: 'Jeferson Quiguantar',
    jobTitle: 'Java Full Stack Developer',
    email: 'jefersonquiguantar@gmail.com',
    phone: '+57 3206776241',
    address: 'Guachucal-Nariño-Colombia',
    summary: 'Desarrollador Java Full Stack con experiencia en la construcción de aplicaciones web escalables y robustas. Apasionado por la arquitectura de software limpia y el aprendizaje continuo de nuevas tecnologías.',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/jeferson-quiguantar' },
      { label: 'GitHub', url: 'https://github.com/jefersonqui-dev' }
    ],
    profilePicture: '/profile-placeholder.jpg', // Placeholder logic handled in component
  },
  experience: [
    {
      id: '1',
      company: 'DevSenior Academy',
      position: 'Full Stack Developer',
      location: 'Remoto',
      startDate: '02/2026',
      endDate: 'Presente',
      description: '• Diseñé una aplicación distribuida de gestión de tareas implementando una arquitectura de microservicios con Spring Boot y Eureka.\n• Integré Spring Security con JWT para la autenticación y Spring Data JPA/Hibernate para la persistencia de datos en bases de datos relacionales.\n• Desarrollé interfaces reactivas y dinámicas utilizando React, garantizando una experiencia de usuario fluida y conectada eficientemente con el ecosistema de APIs REST.'
    },
    {
      id: '2',
      company: 'Tech Solutions Inc.',
      position: 'Junior Developer',
      location: 'Bogotá, Colombia',
      startDate: '01/2024',
      endDate: '12/2025',
      description: 'Colaboración en el desarrollo de módulos frontend con React y Redux. Mantenimiento de APIs RESTful en Java.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Universidad de Nariño',
      degree: 'Ingeniería de Sistemas',
      startDate: '2018',
      endDate: '2023'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos y panel de administración.',
      link: 'https://github.com/jefersonqui-dev/ecommerce',
      technologies: ['Java', 'Spring Boot', 'React', 'MySQL']
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'Oracle Certified Professional: Java SE 11 Developer',
      issuer: 'Oracle',
      date: '2024'
    }
  ],
  skills: [
    { id: '1', name: 'Spring Boot', level: 5, category: 'Backend & Core' },
    { id: '2', name: 'Hibernate', level: 4, category: 'Backend & Core' },
    { id: '3', name: 'JPA', level: 4, category: 'Backend & Core' },
    { id: '4', name: 'JDBC', level: 4, category: 'Backend & Core' },
    { id: '5', name: 'SQL', level: 4, category: 'Backend & Core' },
    { id: '6', name: 'PostgreSQL', level: 4, category: 'Backend & Core' },
    { id: '7', name: 'MySQL', level: 4, category: 'Backend & Core' },
    { id: '8', name: 'REST Architecture', level: 4, category: 'Backend & Core' },
    { id: '9', name: 'OpenCV', level: 3, category: 'IA & Data Science' },
    { id: '10', name: 'Machine Learning', level: 3, category: 'IA & Data Science' },
    { id: '11', name: 'Analisis de Datos', level: 3, category: 'IA & Data Science' },
    { id: '12', name: 'Git/GitHub', level: 4, category: 'Herramientas & DevOps' },
    { id: '13', name: 'Docker', level: 3, category: 'Herramientas & DevOps' },
    { id: '14', name: 'Scrum', level: 4, category: 'Herramientas & DevOps' },
  ],
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setResume: (state, action: PayloadAction<Resume>) => {
      return action.payload;
    },
    updatePersonalDetails: (state, action: PayloadAction<Partial<PersonalDetails>>) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<Experience>) => {
      const index = state.experience.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = action.payload;
      }
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
    },
    // Similar para Education y Skills...
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<Education>) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = action.payload;
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<Skill>) => {
      const index = state.skills.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = action.payload;
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(s => s.id !== action.payload);
    },
    addCertification: (state, action: PayloadAction<Certification>) => {
      state.certifications.push(action.payload);
    },
    updateCertification: (state, action: PayloadAction<Certification>) => {
      const index = state.certifications.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.certifications[index] = action.payload;
      }
    },
    removeCertification: (state, action: PayloadAction<string>) => {
      state.certifications = state.certifications.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setResume,
  updatePersonalDetails,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  updateSkill,
  removeSkill,
  addCertification,
  updateCertification,
  removeCertification
} = cvSlice.actions;

export default cvSlice.reducer;
