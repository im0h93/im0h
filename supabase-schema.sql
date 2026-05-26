-- Moahel ATS Resume Builder - Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  credits INTEGER DEFAULT 3,
  is_banned BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'ar' CHECK (language_preference IN ('ar', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  preview_url TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  supports_rtl BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  title TEXT NOT NULL,
  language TEXT DEFAULT 'ar' CHECK (language IN ('ar', 'en', 'bilingual')),
  data JSONB NOT NULL,
  ats_score INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('add', 'subtract', 'usage', 'refund')),
  reason TEXT NOT NULL,
  admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recharge requests table
CREATE TABLE recharge_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  whatsapp_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES users(id)
);

-- Admin logs table
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform settings table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Function to decrement credits
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  UPDATE users 
  SET credits = GREATEst(0, credits - amount),
      updated_at = NOW()
  WHERE id = user_id AND credits >= amount
  RETURNING credits INTO new_credits;
  
  IF new_credits IS NULL THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Log the transaction
  INSERT INTO credit_transactions (user_id, amount, type, reason)
  VALUES (user_id, amount, 'usage', 'Resume generation');
  
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analytics
CREATE OR REPLACE FUNCTION get_analytics()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'active_users', (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'),
    'total_resumes', (SELECT COUNT(*) FROM resumes),
    'resumes_generated_today', (SELECT COUNT(*) FROM resumes WHERE created_at > NOW() - INTERVAL '1 day'),
    'credit_usage', jsonb_build_object(
      'total_used', (SELECT COALESCE(SUM(amount), 0) FROM credit_transactions WHERE type = 'usage'),
      'total_added', (SELECT COALESCE(SUM(amount), 0) FROM credit_transactions WHERE type = 'add')
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY resumes_select_own ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY resumes_insert_own ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY resumes_update_own ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY resumes_delete_own ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all users
CREATE POLICY admins_select_all_users ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Insert default templates
INSERT INTO templates (name, name_ar, description, description_ar, template_data, is_active, supports_rtl) VALUES
('Minimal ATS', 'الحد الأدنى ATS', 'Clean and simple ATS-friendly template', 'قالب بسيط ونظيف متوافق مع ATS', 
 '{"header": {"style": "minimal"}, "sections": ["personal", "summary", "experience", "education", "skills"]}'::jsonb, 
 TRUE, TRUE),
('Executive Professional', 'المدير التنفيذي المحترف', 'Professional template for executives', 'قالب احترافي للمدراء التنفيذيين',
 '{"header": {"style": "executive"}, "sections": ["personal", "summary", "experience", "education", "skills", "certifications"]}'::jsonb,
 TRUE, TRUE),
('Modern Arabic', 'العربية الحديثة', 'Modern template optimized for Arabic resumes', 'قالب حديث محسن للسير الذاتية العربية',
 '{"header": {"style": "modern", "rtl": true}, "sections": ["personal", "summary", "experience", "education", "skills", "languages"]}'::jsonb,
 TRUE, TRUE);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
('whatsapp_number', '"+966501234567"', 'WhatsApp number for recharge'),
('whatsapp_recharge_message', '"مرحباً، أود إعادة شحن رصيدي في منصة مؤهل. المبلغ المطلوب: "', 'Recharge message template'),
('free_credits_per_user', '3', 'Free credits given to new users'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('site_title', '"مؤهل - Moahel"', 'Website title for SEO');
