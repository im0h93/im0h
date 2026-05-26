import React, { useEffect } from 'react';
import { useAppStore } from '@/store';
import { cn } from '@/utils/helpers';
import { motion } from 'framer-motion';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useAppStore();
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  return <>{children}</>;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { language, isRTL } = useAppStore();
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);
  
  return <>{children}</>;
}

// Navbar Component
export function Navbar() {
  const { theme, setTheme, language, setLanguage, isAuthenticated, user } = useAppStore();
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl',
        'border-b border-slate-200/50 dark:border-slate-800/50'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'مؤهل' : 'Moahel'}
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {language === 'ar' ? 'المميزات' : 'Features'}
            </a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {language === 'ar' ? 'القوالب' : 'Templates'}
            </a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {language === 'ar' ? 'الأسعار' : 'Pricing'}
            </a>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-lg shadow-brand-500/30"
              >
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </a>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-lg shadow-brand-500/30"
                >
                  {language === 'ar' ? 'إنشاء حساب' : 'Register'}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Sidebar Component for Dashboard
export function DashboardSidebar() {
  const { sidebarOpen, toggleSidebar, language } = useAppStore();
  
  const menuItems = [
    { icon: '📊', label: language === 'ar' ? 'نظرة عامة' : 'Overview', href: '/dashboard' },
    { icon: '📄', label: language === 'ar' ? 'سيرتي الذاتية' : 'My Resumes', href: '/dashboard/resumes' },
    { icon: '✨', label: language === 'ar' ? 'إنشاء جديد' : 'Create New', href: '/resume/builder' },
    { icon: '🎨', label: language === 'ar' ? 'القوالب' : 'Templates', href: '/dashboard/templates' },
    { icon: '💳', label: language === 'ar' ? 'الرصيد' : 'Credits', href: '/dashboard/credits' },
    { icon: '⚙️', label: language === 'ar' ? 'الإعدادات' : 'Settings', href: '/dashboard/settings' },
  ];
  
  return (
    <aside
      className={cn(
        'fixed top-16 bottom-0 z-30 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 md:w-20',
        'bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl',
        'border-l border-slate-200/50 dark:border-slate-800/50',
        language === 'ar' ? 'right-0' : 'left-0'
      )}
    >
      <div className="p-4 space-y-2 overflow-y-auto h-full">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg',
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'transition-colors'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </a>
        ))}
      </div>
    </aside>
  );
}

// Footer Component
export function Footer() {
  const { language } = useAppStore();
  
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'مؤهل' : 'Moahel'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {language === 'ar' 
                ? 'منصة احترافية لبناء السير الذاتية المتوافقة مع أنظمة ATS'
                : 'Professional platform for building ATS-compatible resumes'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'المميزات' : 'Features'}</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'الأسعار' : 'Pricing'}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              {language === 'ar' ? 'الدعم' : 'Support'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'اتصل بنا' : 'Contact Us'}</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              {language === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} {language === 'ar' ? 'مؤهل. جميع الحقوق محفوظة.' : 'Moahel. All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
