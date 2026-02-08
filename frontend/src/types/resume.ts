export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  profilePicture?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Resume {
  personalDetails: PersonalDetails;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}
