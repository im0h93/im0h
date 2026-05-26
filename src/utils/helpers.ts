import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Arabic or English
export function formatDate(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Format currency
export function formatCurrency(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Calculate ATS score based on resume data
export function calculateATSScore(data: Record<string, unknown>): number {
  let score = 0;
  const maxScore = 100;
  
  // Personal info completeness (20 points)
  const personalInfo = data.personal_info as Record<string, unknown> | undefined;
  if (personalInfo) {
    const fields = ['full_name', 'email', 'phone', 'location', 'job_title'];
    const filledFields = fields.filter(f => personalInfo[f]);
    score += (filledFields.length / fields.length) * 20;
  }
  
  // Summary (15 points)
  if (data.summary && (data.summary as string).length > 50) {
    score += 15;
  } else if (data.summary && (data.summary as string).length > 0) {
    score += 7;
  }
  
  // Experience (25 points)
  const experience = data.experience as Array<Record<string, unknown>> | undefined;
  if (experience && experience.length > 0) {
    score += Math.min(25, experience.length * 8);
  }
  
  // Education (15 points)
  const education = data.education as Array<Record<string, unknown>> | undefined;
  if (education && education.length > 0) {
    score += Math.min(15, education.length * 7);
  }
  
  // Skills (15 points)
  const skills = data.skills as Array<Record<string, unknown>> | undefined;
  if (skills && skills.length > 0) {
    score += Math.min(15, skills.length * 2);
  }
  
  // Additional sections (10 points)
  const hasCertifications = data.certifications && (data.certifications as Array<unknown>).length > 0;
  const hasProjects = data.projects && (data.projects as Array<unknown>).length > 0;
  const hasLanguages = data.languages && (data.languages as Array<unknown>).length > 0;
  
  if (hasCertifications) score += 3;
  if (hasProjects) score += 4;
  if (hasLanguages) score += 3;
  
  return Math.round(Math.min(maxScore, score));
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Arabic format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Download file helper
export function downloadFile(content: string, filename: string, type: string = 'application/pdf') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// WhatsApp link generator
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

// RTL/LTR direction helper
export function getDirection(language: 'ar' | 'en'): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

// Localized strings
export const translations = {
  ar: {
    appName: 'مؤهل',
    tagline: 'أنشئ سيرتك الذاتية باحترافية',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    resumes: 'السير الذاتية',
    templates: 'القوالب',
    settings: 'الإعدادات',
    credits: 'الرصيد',
    recharge: 'إعادة الشحن',
    profile: 'الملف الشخصي',
    admin: 'الإدارة',
    create: 'إنشاء جديد',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    search: 'بحث',
    loading: 'جاري التحميل...',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    warning: 'تنبيه',
    info: 'معلومات',
  },
  en: {
    appName: 'Moahel',
    tagline: 'Build Your Resume Professionally',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    resumes: 'Resumes',
    templates: 'Templates',
    settings: 'Settings',
    credits: 'Credits',
    recharge: 'Recharge',
    profile: 'Profile',
    admin: 'Admin',
    create: 'Create New',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
};

export function t(key: keyof typeof translations.ar, lang: 'ar' | 'en' = 'ar'): string {
  return translations[lang][key] || translations.en[key as keyof typeof translations.en] || key;
}
