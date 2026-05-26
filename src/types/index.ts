// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'super_admin';
  credits: number;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  language_preference: 'ar' | 'en';
}

export interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

// Resume Types
export interface Resume {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  language: 'ar' | 'en' | 'bilingual';
  data: ResumeData;
  ats_score?: number;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface ResumeData {
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: LanguageProficiency[];
  social_links: SocialLink[];
}

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  job_title: string;
  linkedin?: string;
  website?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_url?: string;
  credential_id?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  start_date: string;
  end_date?: string;
}

export interface LanguageProficiency {
  id: string;
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username?: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  preview_url: string;
  is_active: boolean;
  is_premium: boolean;
  supports_rtl: boolean;
  created_at: string;
}

// Credit and Recharge Types
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'add' | 'subtract' | 'usage' | 'refund';
  reason: string;
  created_at: string;
  admin_id?: string;
}

export interface RechargeRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  whatsapp_message?: string;
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

// Admin Types
export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, unknown>;
  created_at: string;
  ip_address?: string;
}

export interface PlatformSettings {
  id: string;
  key: string;
  value: string | boolean | number | Record<string, unknown>;
  description: string;
  updated_at: string;
  updated_by: string;
}

// Analytics Types
export interface AnalyticsData {
  total_users: number;
  active_users: number;
  total_resumes: number;
  resumes_generated_today: number;
  credit_usage: {
    total_used: number;
    total_added: number;
  };
  daily_signups: { date: string; count: number }[];
  template_usage: { template_id: string; count: number }[];
}

// ATS Analysis Types
export interface ATSAnalysis {
  overall_score: number;
  readability_score: number;
  keyword_score: number;
  format_score: number;
  sections_complete: number;
  total_sections: number;
  suggestions: ATSSuggestion[];
  keywords_found: string[];
  keywords_missing: string[];
}

export interface ATSSuggestion {
  type: 'error' | 'warning' | 'info';
  message: string;
  message_ar: string;
  section?: string;
  priority: 'high' | 'medium' | 'low';
}

// UI Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  title_ar: string;
  message: string;
  message_ar: string;
  read: boolean;
  created_at: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
