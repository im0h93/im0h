-- Create static pages table
CREATE TABLE IF NOT EXISTS public.static_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "pages_select_published" ON public.static_pages 
  FOR SELECT USING (is_published = true);

-- Staff can read all pages
CREATE POLICY "pages_select_staff" ON public.static_pages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Admin can manage pages
CREATE POLICY "pages_insert_admin" ON public.static_pages 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "pages_update_admin" ON public.static_pages 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "pages_delete_admin" ON public.static_pages 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.static_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default pages
INSERT INTO public.static_pages (slug, title, content, meta_description) VALUES
  ('about', 'من نحن', '<h2>مرحباً بكم في مكسب</h2><p>مكسب هي منصة عربية متخصصة في نشر المحتوى القيّم والمفيد للقارئ العربي. نسعى لتقديم مقالات عالية الجودة في مجالات التقنية، الأعمال، وتطوير الذات.</p><h3>رؤيتنا</h3><p>أن نكون المصدر الأول للمحتوى العربي الهادف والموثوق.</p><h3>رسالتنا</h3><p>إثراء المحتوى العربي بمقالات قيّمة تساهم في تطوير المجتمع العربي.</p>', 'تعرف على منصة مكسب - منصة عربية للمحتوى القيّم'),
  ('privacy', 'سياسة الخصوصية', '<h2>سياسة الخصوصية</h2><p>نحن في مكسب نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية.</p><h3>جمع المعلومات</h3><p>نجمع المعلومات التي تقدمونها لنا طوعاً عند التسجيل أو التعليق.</p><h3>استخدام المعلومات</h3><p>نستخدم معلوماتكم لتحسين تجربة الاستخدام وتقديم محتوى مخصص.</p><h3>حماية المعلومات</h3><p>نستخدم أحدث تقنيات الأمان لحماية بياناتكم.</p>', 'سياسة الخصوصية لمنصة مكسب'),
  ('archive', 'الفهرس', '<h2>فهرس الموقع</h2><p>استعرض جميع المقالات والتصنيفات المتوفرة في الموقع.</p>', 'فهرس موقع مكسب - استعرض جميع المقالات'),
  ('contact', 'اتصل بنا', '<h2>تواصل معنا</h2><p>نسعد بتواصلكم معنا. يمكنكم إرسال استفساراتكم واقتراحاتكم من خلال نموذج التواصل أدناه.</p>', 'تواصل مع فريق مكسب'),
  ('feedback', 'الشكاوي والاقتراحات', '<h2>شاركنا رأيك</h2><p>نقدر ملاحظاتكم واقتراحاتكم لتحسين المنصة. لا تترددوا في مشاركة أي فكرة أو ملاحظة.</p>', 'أرسل شكوى أو اقتراح لمنصة مكسب')
ON CONFLICT (slug) DO NOTHING;
