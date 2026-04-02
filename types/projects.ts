export type ProjectCategory = 'Security' | 'Web App' | 'Full-Stack' | 'DevOps' | 'Open Source' | 'security' | 'fullstack' | 'devops' | 'analytics' | 'tools';
export type SecurityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags?: string[];
  category: ProjectCategory;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  securityLevel?: SecurityLevel;
  featured: boolean;
  securityFeatures?: string[];
  highlights?: string[];
}