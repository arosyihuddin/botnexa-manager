
import { ApiService } from "./api.service";
import { whatsAppWebSocket } from "@/lib/websocket";
import { auth } from "@/lib/firebase";

export interface WhatsAppStatus {
  connected: boolean;
  phone?: string;
  qrCode?: string;
  lastSyncTimestamp?: string;
  batteryLevel?: number;
  botStatus: 'online' | 'offline';
}

export class WhatsAppService extends ApiService {
  private static status: WhatsAppStatus = {
    connected: false,
    botStatus: 'offline'
  };
  
  /**
   * Initialize WhatsApp service and websocket listeners
   */
  static initialize(): void {
    // Set up WebSocket message handling
    whatsAppWebSocket.subscribe('whatsapp_status', (data) => {
      this.handleStatusUpdate(data);
    });
    
    whatsAppWebSocket.subscribe('whatsapp_qr', (data) => {
      this.handleQRUpdate(data.qrCode);
    });
    
    // Request initial status when WebSocket connects
    whatsAppWebSocket.subscribe('ready', () => {
      whatsAppWebSocket.sendMessage('get_whatsapp_status');
    });

    // Check bot status on initialization
    this.checkBotStatus();
  }
  
  /**
   * Check if bot is active before attempting to connect
   */
  private static async checkBotStatus(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get bot status from API
      const bots = await this.apiRequest<any[]>(`/users/${user.uid}/bots`);
      
      if (bots && bots.length > 0) {
        const whatsappBot = bots.find(bot => bot.type === 'whatsapp');
        
        if (whatsappBot) {
          this.status.botStatus = whatsappBot.status;
          
          // If bot is online, connect to WebSocket
          if (whatsappBot.status === 'online') {
            whatsAppWebSocket.connect();
          }
        }
      }
    } catch (error) {
      console.error('Error checking bot status:', error);
    }
  }
  
  /**
   * Handle WhatsApp status updates from WebSocket
   */
  private static handleStatusUpdate(data: any): void {
    this.status = {
      ...this.status,
      connected: data.connected,
      phone: data.phone,
      lastSyncTimestamp: data.lastSyncTimestamp,
      batteryLevel: data.batteryLevel
    };
  }
  
  /**
   * Handle QR code updates from WebSocket
   */
  private static handleQRUpdate(qrCode: string): void {
    this.status.qrCode = qrCode;
    // Trigger any registered QR code listeners
    this.qrListeners.forEach(listener => listener(qrCode));
  }
  
  // Store QR code update listeners
  private static qrListeners: ((qrCode: string) => void)[] = [];
  
  /**
   * Register a listener for QR code updates
   */
  static onQRCodeUpdate(listener: (qrCode: string) => void): () => void {
    this.qrListeners.push(listener);
    return () => {
      this.qrListeners = this.qrListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Get current WhatsApp connection status
   */
  static getStatus(): WhatsAppStatus {
    return this.status;
  }
  
  /**
   * Manually request a new QR code
   */
  static async requestNewQRCode(): Promise<void> {
    // First, check if bot is active
    if (this.status.botStatus !== 'online') {
      throw new Error('Bot is not active. Please activate the bot first.');
    }
    
    return this.apiRequest<void>('/whatsapp/request-qr', 'POST');
  }
  
  /**
   * Logout from WhatsApp
   */
  static async logout(): Promise<void> {
    return this.apiRequest<void>('/whatsapp/logout', 'POST');
  }
  
  /**
   * Restart WhatsApp connection
   */
  static async restart(): Promise<void> {
    return this.apiRequest<void>('/whatsapp/restart', 'POST');
  }
  
  /**
   * Toggle bot status (on/off)
   */
  static async toggleBotStatus(isActive: boolean): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Update bot status in API
      const response = await this.apiRequest<{id: string, status: 'online' | 'offline'}>(
        '/whatsapp/bot-status',
        'PUT',
        { status: isActive ? 'online' : 'offline' }
      );
      
      // Update local status
      this.status.botStatus = response.status;
      
      // Connect or disconnect WebSocket based on status
      if (isActive) {
        whatsAppWebSocket.connect();
      } else {
        whatsAppWebSocket.disconnect();
      }
      
      return;
    } catch (error) {
      console.error('Error toggling bot status:', error);
      throw error;
    }
  }
  
  /**
   * Check if the bot is active
   */
  static isBotActive(): boolean {
    return this.status.botStatus === 'online';
  }
}
