'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { Card, Button, Badge, Input } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Shield,
  Search,
  Plus,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { language } = useAppStore();
  
  // Mock admin data
  const stats = [
    { icon: Users, label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: '1,234', trend: '+15%', color: 'text-blue-500' },
    { icon: FileText, label: language === 'ar' ? 'السير الذاتية' : 'Total Resumes', value: '5,678', trend: '+28%', color: 'text-green-500' },
    { icon: CreditCard, label: language === 'ar' ? 'الرصيد المستخدم' : 'Credits Used', value: '12,345', trend: '+42%', color: 'text-purple-500' },
    { icon: DollarSign, label: language === 'ar' ? 'الإيرادات' : 'Revenue', value: '$8,900', trend: '+18%', color: 'text-orange-500' },
  ];
  
  const recentUsers = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', credits: 5, status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', credits: 2, status: 'active', joined: '2024-01-14' },
    { id: 3, name: 'محمد حسن', email: 'mohammed@example.com', credits: 0, status: 'banned', joined: '2024-01-13' },
    { id: 4, name: 'سارة أحمد', email: 'sara@example.com', credits: 8, status: 'active', joined: '2024-01-12' },
    { id: 5, name: 'خالد عمر', email: 'khaled@example.com', credits: 1, status: 'active', joined: '2024-01-11' },
  ];
  
  const whatsappSettings = {
    number: '+966501234567',
    message: 'مرحباً، أود إعادة شحن رصيدي في منصة مؤهل. المبلغ المطلوب: ',
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-red-600 dark:bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">{language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</span>
              <Badge variant="danger" size="sm">{language === 'ar' ? 'محمي' : 'PROTECTED'}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? 'نظرة عامة على المنصة' : 'Platform Overview'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'ar' 
                ? 'إدارة كاملة للمستخدمين والسير الذاتية والإعدادات' 
                : 'Complete management of users, resumes, and settings'}
            </p>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-3 rounded-xl bg-slate-100 dark:bg-slate-800', stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="success">{stat.trend}</Badge>
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
            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder={language === 'ar' ? 'بحث...' : 'Search...'} 
                      className="w-48"
                      icon={<Search className="w-4 h-4" />}
                    />
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {language === 'ar' ? 'المستخدم' : 'User'}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {language === 'ar' ? 'الرصيد' : 'Credits'}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {language === 'ar' ? 'إجراءات' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-900 dark:text-white font-medium">{user.credits}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                              {user.status === 'active' 
                                ? (language === 'ar' ? 'نشط' : 'Active')
                                : (language === 'ar' ? 'محظور' : 'Banned')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-sm">
                            {user.joined}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                {language === 'ar' ? 'تعديل' : 'Edit'}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
            
            {/* WhatsApp Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {language === 'ar' ? 'إعدادات الواتساب' : 'WhatsApp Settings'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
                    </label>
                    <Input defaultValue={whatsappSettings.number} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'ar' ? 'رسالة إعادة الشحن' : 'Recharge Message'}
                    </label>
                    <textarea 
                      className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                      rows={4}
                      defaultValue={whatsappSettings.message}
                    />
                  </div>
                  
                  <Button className="w-full">
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
              
              {/* Quick Actions */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة رصيد لمستخدم' : 'Add Credits to User'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    {language === 'ar' ? 'عرض جميع المستخدمين' : 'View All Users'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Activity className="w-4 h-4" />
                    {language === 'ar' ? 'سجل النشاطات' : 'Activity Logs'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="w-4 h-4" />
                    {language === 'ar' ? 'إعدادات المنصة' : 'Platform Settings'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
