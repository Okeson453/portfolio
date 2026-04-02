import { LucideIcon } from 'lucide-react';

export type SkillCategory = 'Security' | 'Frontend' | 'Backend' | 'DevOps' | 'Tools';
export type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Basic';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years: number;
  proficiency: number;
  icon: LucideIcon;
  description: string;
  tags: string[];
}