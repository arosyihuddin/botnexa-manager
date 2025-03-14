import { createClient } from '@supabase/supabase-js';
import { User } from 'firebase/auth';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  created_at: string;
  whatsapp_connected: boolean;
  subscription_tier?: 'free' | 'premium' | 'business';
}

// Save Firebase user to Supabase database
export const saveUserToSupabase = async (firebaseUser: User): Promise<UserProfile | null> => {
  if (!firebaseUser) return null;

  const userData = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    full_name: firebaseUser.displayName || '',
    avatar_url: firebaseUser.photoURL || '',
    phone_number: firebaseUser.phoneNumber || '',
    whatsapp_connected: false,
    subscription_tier: 'free' as const,
  };

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', firebaseUser.uid)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user from Supabase:', fetchError);
    return null;
  }

  // If user doesn't exist, create them
  if (!existingUser) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error saving user to Supabase:', error);
      return null;
    }

    return data;
  }

  // Otherwise, update existing user data
  const { data, error } = await supabase
    .from('users')
    .update({
      email: firebaseUser.email || existingUser.email,
      full_name: firebaseUser.displayName || existingUser.full_name,
      avatar_url: firebaseUser.photoURL || existingUser.avatar_url,
      phone_number: firebaseUser.phoneNumber || existingUser.phone_number,
    })
    .eq('id', firebaseUser.uid)
    .select()
    .single();

  if (error) {
    console.error('Error updating user in Supabase:', error);
    return existingUser;
  }

  return data;
};

// Get user profile from Supabase
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

// Update WhatsApp connection status
export const updateWhatsAppConnectionStatus = async (userId: string, connected: boolean): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ whatsapp_connected: connected })
    .eq('id', userId);

  if (error) {
    console.error('Error updating WhatsApp connection status:', error);
  }
};
