import React from 'react';
import { ThemeProvider, LanguageProvider } from '@/components/layout';
import { useAppStore } from '@/store';
import { cn } from '@/utils/helpers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useAppStore();
  
  return (
    <html suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900',
        'text-slate-900 dark:text-white',
        language === 'ar' ? 'font-arabic' : 'font-english'
      )}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
