export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget?: string | null;
  timeline?: string | null;
  files?: string[] | null;
  status: string;
  language: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions?: any;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}
