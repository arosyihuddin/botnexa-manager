
import { ApiService } from "./api.service";
import { auth } from "@/lib/firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { saveUserToSupabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  created_at: string;
  subscription_tier: 'free' | 'premium' | 'business';
}

export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface UserBot {
  id: string;
  name: string;
  status: 'online' | 'offline';
  isConnected: boolean;
  lastConnection?: string;
  type: string;
}

export class UserService extends ApiService {
  /**
   * Get current user profile from API
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      // Get user profile from API
      return await this.getUserById(user.uid);
    } catch (error) {
      console.error("Error fetching user profile from API", error);
      throw error;
    }
  }
  
  /**
   * Update user profile in both Firebase and API backend
   */
  static async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    // Update relevant fields in Firebase if applicable
    if (profileData.full_name) {
      await updateProfile(user, { displayName: profileData.full_name });
    }
    
    if (profileData.avatar_url) {
      await updateProfile(user, { photoURL: profileData.avatar_url });
    }
    
    // Update email if provided and different
    if (profileData.email && profileData.email !== user.email) {
      await updateEmail(user, profileData.email);
    }
    
    // Update API backend
    return this.apiRequest<UserProfile>('/user/profile', 'PUT', profileData);
  }
  
  /**
   * Get user settings
   */
  static async getUserSettings(): Promise<UserSettings> {
    return this.apiRequest<UserSettings>('/user/settings');
  }
  
  /**
   * Update user settings
   */
  static async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return this.apiRequest<UserSettings>('/user/settings', 'PUT', settings);
  }
  
  /**
   * Upload profile picture
   */
  static async uploadProfilePicture(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ avatarUrl: string }> {
    return this.uploadFile('/user/profile-picture', file, onProgress);
  }
  
  /**
   * Update subscription tier
   */
  static async updateSubscriptionTier(
    tier: 'free' | 'premium' | 'business'
  ): Promise<UserProfile | null> {
    return this.apiRequest<UserProfile | null>(
      '/user/subscription',
      'PUT',
      { tier }
    );
  }

  /**
   * Get user bots
   */
  static async getUserBots(): Promise<UserBot[]> {
    const user = auth.currentUser;
    if (!user) return [];
    
    return this.apiRequest<UserBot[]>(`/users/${user.uid}/bots`);
  }

  /**
   * Get user bots by user ID
   */
  static async getUserBotsById(userId: string): Promise<UserBot[]> {
    return this.apiRequest<UserBot[]>(`/users/${userId}/bots`);
  }

  /**
   * Toggle bot status (on/off)
   */
  static async toggleBotStatus(botId: string, isActive: boolean): Promise<UserBot> {
    return this.apiRequest<UserBot>(
      `/bots/${botId}/status`,
      'PUT',
      { status: isActive ? 'online' : 'offline' }
    );
  }
  
  /**
   * Create a new bot
   */
  static async createBot(botData: { name: string, type: string }): Promise<UserBot> {
    return this.apiRequest<UserBot>('/bots', 'POST', botData);
  }
  
  /**
   * Delete a bot
   */
  static async deleteBot(botId: string): Promise<void> {
    return this.apiRequest<void>(`/bots/${botId}`, 'DELETE');
  }
  
  /**
   * Handle user registration with Firebase and Supabase
   */
  static async registerUser(userData: { 
    email: string; 
    password: string; 
    fullName: string;
  }): Promise<any> {
    try {
      // Register with API first
      const apiResponse = await this.register(userData);
      
      // Create user in Firebase
      const userCredential = await auth.createUserWithEmailAndPassword(
        userData.email, 
        userData.password
      );
      
      // Update profile in Firebase
      await updateProfile(userCredential.user, {
        displayName: userData.fullName
      });
      
      // Save user data to Supabase via our helper
      await saveUserToSupabase(userCredential.user);
      
      return userCredential.user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }
  
  /**
   * Handle user login with Firebase and Supabase
   */
  static async loginUser(email: string, password: string): Promise<any> {
    try {
      // Login with API
      const apiResponse = await this.login(email, password);
      
      // Sign in with Firebase
      const userCredential = await auth.signInWithEmailAndPassword(
        email, 
        password
      );
      
      // Update or create Supabase record
      await saveUserToSupabase(userCredential.user);
      
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}
