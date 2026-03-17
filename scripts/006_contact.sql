-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'contact' CHECK (submission_type IN ('contact', 'complaint', 'suggestion')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS contact_type_idx ON public.contact_submissions (submission_type);
CREATE INDEX IF NOT EXISTS contact_read_idx ON public.contact_submissions (is_read);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert submissions (no auth required)
CREATE POLICY "contact_insert_anon" ON public.contact_submissions 
  FOR INSERT WITH CHECK (true);

-- Only staff can read submissions
CREATE POLICY "contact_select_staff" ON public.contact_submissions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'moderator')
    )
  );

-- Only admin can update/delete submissions
CREATE POLICY "contact_update_admin" ON public.contact_submissions 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "contact_delete_admin" ON public.contact_submissions 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
