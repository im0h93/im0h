import React from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { useAppStore } from '@/store';
import { cn } from '@/utils/helpers';

// Hero Section
function HeroSection() {
  const { language } = useAppStore();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
            ✨ {language === 'ar' ? 'منصة رقم 1 في المنطقة العربية' : '#1 Platform in the Arab Region'}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {language === 'ar' ? (
              <>
                أنشئ سيرتك الذاتية
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                  باحترافية وسهولة
                </span>
              </>
            ) : (
              <>
                Build Your Resume
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                  Professionally & Easily
                </span>
              </>
            )}
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            {language === 'ar'
              ? 'منصة مؤهل تساعدك على إنشاء سيرة ذاتية احترافية متوافقة مع أنظمة ATS وزيادة فرصك في الحصول على الوظيفة المطلوبة'
              : 'Moahel helps you create a professional ATS-compatible resume and increase your chances of getting your dream job'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
              {language === 'ar' ? 'ابدأ مجاناً' : 'Start Free'} 🚀
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
              {language === 'ar' ? 'شاهد العرض' : 'Watch Demo'} ▶️
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {language === 'ar' ? '✓ 3 سير ذاتية مجانية ✓ لا يحتاج بطاقة ائتمان' : '✓ 3 Free Resumes ✓ No Credit Card Required'}
          </p>
        </motion.div>
        
        {/* Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: '📄', title: language === 'ar' ? 'قوالب احترافية' : 'Professional Templates', count: '10+' },
            { icon: '🎯', title: language === 'ar' ? 'تحليل ATS' : 'ATS Analysis', score: '95%' },
            { icon: '⚡', title: language === 'ar' ? 'تصدير سريع' : 'Fast Export', time: '< 1min' },
          ].map((feature, index) => (
            <Card key={index} hover className="p-6">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-brand-600 dark:text-brand-400 font-medium">
                {feature.count || feature.score || feature.time}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const { language } = useAppStore();
  
  const features = [
    {
      icon: '🎨',
      title: language === 'ar' ? 'قوالب متنوعة' : 'Diverse Templates',
      description: language === 'ar' 
        ? 'اختر من بين مجموعة واسعة من القوالب الاحترافية المناسبة لمختلف المجالات'
        : 'Choose from a wide range of professional templates suitable for various fields',
    },
    {
      icon: '🔍',
      title: language === 'ar' ? 'تحليل ATS ذكي' : 'Smart ATS Analysis',
      description: language === 'ar'
        ? 'تحليل متقدم لسيرتك الذاتية لضمان التوافق مع أنظمة التوظيف الآلية'
        : 'Advanced analysis of your resume to ensure compatibility with automated hiring systems',
    },
    {
      icon: '🌐',
      title: language === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
      description: language === 'ar'
        ? 'أنشئ سيرتك الذاتية بالعربية أو الإنجليزية أو كليهما معاً'
        : 'Create your resume in Arabic, English, or both together',
    },
    {
      icon: '📊',
      title: language === 'ar' ? 'إحصائيات متقدمة' : 'Advanced Analytics',
      description: language === 'ar'
        ? 'تابع أداء سيرتك الذاتية واحصل على نصائح مخصصة للتحسين'
        : 'Track your resume performance and get customized improvement tips',
    },
    {
      icon: '🔒',
      title: language === 'ar' ? 'أمان وخصوصية' : 'Security & Privacy',
      description: language === 'ar'
        ? 'بياناتك محمية بأعلى معايير الأمان والخصوصية'
        : 'Your data is protected with the highest security and privacy standards',
    },
    {
      icon: '💬',
      title: language === 'ar' ? 'دعم فني متواصل' : '24/7 Support',
      description: language === 'ar'
        ? 'فريق دعم جاهز لمساعدتك في أي وقت عبر الواتساب والبريد الإلكتروني'
        : 'Support team ready to help you anytime via WhatsApp and email',
    },
  ];
  
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'ar' ? 'كل ما تحتاجه لنجاحك المهني' : 'Everything You Need for Career Success'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'منصة متكاملة توفر لك جميع الأدوات اللازمة لإنشاء سيرة ذاتية احترافية'
              : 'An integrated platform that provides all the tools you need to create a professional resume'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const { language } = useAppStore();
  
  const plans = [
    {
      name: language === 'ar' ? 'مجاني' : 'Free',
      price: '0',
      period: language === 'ar' ? 'دائماً' : 'Forever',
      features: [
        language === 'ar' ? '3 سير ذاتية مجانية' : '3 Free Resumes',
        language === 'ar' ? 'قوالب أساسية' : 'Basic Templates',
        language === 'ar' ? 'تصدير PDF' : 'PDF Export',
        language === 'ar' ? 'تحليل ATS أساسي' : 'Basic ATS Analysis',
      ],
      cta: language === 'ar' ? 'ابدأ مجاناً' : 'Start Free',
      popular: false,
    },
    {
      name: language === 'ar' ? 'محترف' : 'Professional',
      price: '29',
      period: language === 'ar' ? 'شهرياً' : '/month',
      features: [
        language === 'ar' ? 'سير ذاتية غير محدودة' : 'Unlimited Resumes',
        language === 'ar' ? 'جميع القوالب' : 'All Templates',
        language === 'ar' ? 'تحليل ATS متقدم' : 'Advanced ATS Analysis',
        language === 'ar' ? 'دعم أولوي' : 'Priority Support',
        language === 'ar' ? 'رسائل تخصيص' : 'Cover Letters',
      ],
      cta: language === 'ar' ? 'اشترك الآن' : 'Subscribe Now',
      popular: true,
    },
    {
      name: language === 'ar' ? 'شركات' : 'Enterprise',
      price: '99',
      period: language === 'ar' ? 'شهرياً' : '/month',
      features: [
        language === 'ar' ? 'كل مميزات المحترف' : 'All Pro Features',
        language === 'ar' ? '5 حسابات إضافية' : '5 Additional Accounts',
        language === 'ar' ? 'API Access' : 'API Access',
        language === 'ar' ? 'مدير حساب مخصص' : 'Dedicated Account Manager',
        language === 'ar' ? 'تقارير مخصصة' : 'Custom Reports',
      ],
      cta: language === 'ar' ? 'تواصل معنا' : 'Contact Us',
      popular: false,
    },
  ];
  
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'ar' ? 'خطط تناسب الجميع' : 'Plans for Everyone'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اختر الخطة المناسبة لاحتياجاتك وابدأ رحلتك المهنية اليوم'
              : 'Choose the plan that suits your needs and start your career journey today'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'p-8 h-full relative',
                  plan.popular && 'ring-2 ring-brand-500 shadow-glow-indigo'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-sm font-medium rounded-full">
                    {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">
                    {plan.period}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Landing Page
export default function LandingPage() {
  const { language } = useAppStore();
  
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className={cn('min-h-screen', language === 'ar' ? 'font-arabic' : 'font-english')}>
          <Navbar />
          <main>
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
