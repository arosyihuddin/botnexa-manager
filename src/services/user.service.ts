
import { ApiService } from "./api.service";
import { auth } from "@/lib/firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { UserProfile, saveUserToSupabase, getUserProfile } from "@/lib/supabase";

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
   * Get current user profile
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      // First try to get from API
      const apiProfile = await this.getUserById(user.uid);
      
      // Save to Supabase for local caching/sync
      await saveUserToSupabase(user);
      
      return apiProfile;
    } catch (error) {
      console.error("Error fetching from API, falling back to Supabase", error);
      // Fallback to Supabase if API is not available
      return getUserProfile(user.uid);
    }
  }
  
  /**
   * Update user profile in both Firebase and Supabase
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
    
    // Update phone if provided and different
    if (profileData.phone_number && profileData.phone_number !== user.phoneNumber) {
      // Note: This requires additional verification in a real application
      console.log("Phone number update requested but requires verification");
    }
    
    // Update Supabase database
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
    
    return this.getUserBotsById(user.uid);
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
}
