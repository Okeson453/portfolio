export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: EmploymentType;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
}