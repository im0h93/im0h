import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// User operations
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Resume operations
export async function getResumes(userId: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getResume(resumeId: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createResume(resumeData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('resumes')
    .insert(resumeData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateResume(resumeId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', resumeId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteResume(resumeId: string) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);
  
  if (error) throw error;
}

// Credit operations
export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data?.credits || 0;
}

export async function decrementCredits(userId: string, amount: number = 1) {
  const { data, error } = await supabase.rpc('decrement_credits', {
    user_id: userId,
    amount,
  });
  
  if (error) throw error;
  return data;
}

export async function addCredits(userId: string, amount: number, reason: string, adminId?: string) {
  // Create credit transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount,
      type: 'add',
      reason,
      admin_id: adminId,
    })
    .select()
    .single();
  
  if (transactionError) throw transactionError;
  
  // Update user credits
  const { data: user, error: userError } = await supabase
    .from('users')
    .update({ credits: supabase.raw(`credits + ${amount}`) })
    .eq('id', userId)
    .select()
    .single();
  
  if (userError) throw userError;
  return { transaction, user };
}

// Template operations
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Admin operations
export async function getAllUsers(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  
  const { data, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function banUser(userId: string, isBanned: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_banned: isBanned })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (error) throw error;
}

// Settings operations
export async function getPlatformSettings() {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*');
  
  if (error) throw error;
  
  // Convert to key-value object
  const settings: Record<string, unknown> = {};
  data?.forEach((setting) => {
    settings[setting.key] = setting.value;
  });
  
  return settings;
}

export async function updatePlatformSetting(key: string, value: unknown, updatedBy: string) {
  const { data, error } = await supabase
    .from('platform_settings')
    .upsert({
      key,
      value,
      description: `Updated by ${updatedBy}`,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    })
    .eq('key', key)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Analytics operations
export async function getAnalytics() {
  const { data, error } = await supabase.rpc('get_analytics');
  
  if (error) throw error;
  return data;
}

// Log admin action
export async function logAdminAction(adminId: string, action: string, entityType: string, entityId?: string, details?: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('admin_logs')
    .insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
