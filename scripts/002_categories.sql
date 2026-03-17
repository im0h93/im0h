-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  emoji TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "categories_select_public" ON public.categories 
  FOR SELECT USING (true);

-- Admin/Editor can manage categories
CREATE POLICY "categories_insert_staff" ON public.categories 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "categories_update_staff" ON public.categories 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "categories_delete_admin" ON public.categories 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default categories
INSERT INTO public.categories (name, slug, emoji, description, sort_order) VALUES
  ('تقنية', 'technology', '💻', 'مقالات عن التقنية والبرمجة', 1),
  ('أعمال', 'business', '💼', 'نصائح وأفكار للأعمال والمشاريع', 2),
  ('تطوير الذات', 'self-development', '🎯', 'تحسين الذات والمهارات الشخصية', 3),
  ('أخبار', 'news', '📰', 'آخر الأخبار والمستجدات', 4)
ON CONFLICT (slug) DO NOTHING;
