-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS comments_post_idx ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS comments_user_idx ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS comments_parent_idx ON public.comments (parent_id);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments
CREATE POLICY "comments_select_approved" ON public.comments 
  FOR SELECT USING (is_approved = true);

-- Staff can read all comments
CREATE POLICY "comments_select_staff" ON public.comments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'moderator')
    )
  );

-- Users can see their own comments
CREATE POLICY "comments_select_own" ON public.comments 
  FOR SELECT USING (user_id = auth.uid());

-- Authenticated users can insert comments
CREATE POLICY "comments_insert_auth" ON public.comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "comments_update_own" ON public.comments 
  FOR UPDATE USING (user_id = auth.uid());

-- Moderators can update any comment (for approval)
CREATE POLICY "comments_update_moderator" ON public.comments 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'moderator')
    )
  );

-- Users can delete their own comments, admins can delete any
CREATE POLICY "comments_delete_own" ON public.comments 
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
