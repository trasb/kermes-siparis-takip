import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoxbqdiptsuhsbggzljo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveGJxZGlwdHN1aHNiZ2d6bGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MDM0OTgsImV4cCI6MjA0NTI3OTQ5OH0.Cn6mkCo1F8th0yuvMlidVrQG3SHvoPHk5STmErZmN6Q';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Role = 'waiter' | 'kitchen' | 'accounting' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};