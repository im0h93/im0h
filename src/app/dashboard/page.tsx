'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { Navbar, DashboardSidebar } from '@/components/layout';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { 
  FileText, 
  Plus, 
  Download, 
  TrendingUp, 
  CreditCard,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { language, user } = useAppStore();
  
  // Mock data - will be replaced with real data from Supabase
  const stats = [
    { 
      icon: FileText, 
      label: language === 'ar' ? 'السير الذاتية' : 'Resumes', 
      value: '5',
      trend: '+2',
      color: 'text-blue-500'
    },
    { 
      icon: CreditCard, 
      label: language === 'ar' ? 'الرصيد المتبقي' : 'Credits Left', 
      value: '3',
      trend: null,
      color: 'text-green-500'
    },
    { 
      icon: Award, 
      label: language === 'ar' ? 'متوسط درجة ATS' : 'Avg ATS Score', 
      value: '87%',
      trend: '+5%',
      color: 'text-purple-500'
    },
    { 
      icon: TrendingUp, 
      label: language === 'ar' ? 'المشاهدات' : 'Views', 
      value: '142',
      trend: '+12%',
      color: 'text-orange-500'
    },
  ];
  
  const recentResumes = [
    { id: 1, title: language === 'ar' ? 'سيرة ذاتية - مهندس برمجيات' : 'Software Engineer Resume', date: '2024-01-15', score: 92, template: 'Minimal' },
    { id: 2, title: language === 'ar' ? 'سيرة ذاتية - مدير مشاريع' : 'Project Manager Resume', date: '2024-01-10', score: 88, template: 'Executive' },
    { id: 3, title: language === 'ar' ? 'سيرة ذاتية - مصمم جرافيك' : 'Graphic Designer Resume', date: '2024-01-05', score: 85, template: 'Modern' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <DashboardSidebar />
      
      <main className={cn(
        'pt-24 pb-12 px-4 sm:px-6 lg:px-8',
        language === 'ar' ? 'mr-64' : 'ml-64'
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? `مرحباً، ${user?.full_name || 'مستخدم'}` : `Welcome, ${user?.full_name || 'User'}`} 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'ar' 
                ? 'إليك نظرة عامة على سيرتك الذاتية وأدائك' 
                : "Here's an overview of your resumes and performance"}
            </p>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-4"
          >
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              {language === 'ar' ? 'إنشاء سيرة جديدة' : 'Create New Resume'}
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              {language === 'ar' ? 'تصدير الكل' : 'Export All'}
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <CreditCard className="w-5 h-5" />
              {language === 'ar' ? 'شحن الرصيد' : 'Recharge Credits'}
            </Button>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-3 rounded-xl bg-slate-100 dark:bg-slate-800', stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    {stat.trend && (
                      <Badge variant="success">{stat.trend}</Badge>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Resumes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'آخر السير الذاتية' : 'Recent Resumes'}
                  </h2>
                  <a href="/dashboard/resumes" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                    {language === 'ar' ? 'عرض الكل' : 'View All'} →
                  </a>
                </div>
                
                <div className="space-y-4">
                  {recentResumes.map((resume, index) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {resume.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {resume.template} • {resume.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {resume.score}
                            </span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <p className="text-xs text-slate-500">ATS</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
            
            {/* Credits & Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Credits Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {language === 'ar' ? 'الرصيد المتبقي' : 'Remaining Credits'}
                </h3>
                
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold text-brand-600">3</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {language === 'ar' ? 'سيرة ذاتية متبقية' : 'resumes left'}
                  </p>
                </div>
                
                <Progress value={30} className="mb-4" />
                
                <Button className="w-full" variant="outline">
                  {language === 'ar' ? 'شحن الرصيد عبر واتساب' : 'Recharge via WhatsApp'} 💬
                </Button>
              </Card>
              
              {/* Tips Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {language === 'ar' ? 'نصائح لتحسين السيرة' : 'Resume Tips'}
                </h3>
                
                <ul className="space-y-3">
                  {[
                    language === 'ar' ? 'أضف كلمات مفتاحية من وصف الوظيفة' : 'Add keywords from job description',
                    language === 'ar' ? 'استخدم أفعال حركة قوية' : 'Use strong action verbs',
                    language === 'ar' ? 'قم بقياس إنجازاتك بالأرقام' : 'Quantify achievements with numbers',
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
