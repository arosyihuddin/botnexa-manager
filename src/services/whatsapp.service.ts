
import { ApiService } from "./api.service";
import { whatsAppWebSocket } from "@/lib/websocket";
import { updateWhatsAppConnectionStatus } from "@/lib/supabase";

export interface WhatsAppStatus {
  connected: boolean;
  phone?: string;
  qrCode?: string;
  lastSyncTimestamp?: string;
  batteryLevel?: number;
}

export class WhatsAppService extends ApiService {
  private static status: WhatsAppStatus = {
    connected: false
  };
  
  /**
   * Initialize WhatsApp service and websocket listeners
   */
  static initialize(): void {
    // Set up WebSocket message handling
    whatsAppWebSocket.addMessageListener('whatsapp_status', (data) => {
      this.handleStatusUpdate(data);
    });
    
    whatsAppWebSocket.addMessageListener('whatsapp_qr', (data) => {
      this.handleQRUpdate(data.qrCode);
    });
    
    // Request initial status when WebSocket connects
    whatsAppWebSocket.addConnectListener(() => {
      whatsAppWebSocket.send({
        type: 'get_whatsapp_status'
      });
    });
  }
  
  /**
   * Handle WhatsApp status updates from WebSocket
   */
  private static handleStatusUpdate(data: any): void {
    this.status = {
      connected: data.connected,
      phone: data.phone,
      lastSyncTimestamp: data.lastSyncTimestamp,
      batteryLevel: data.batteryLevel
    };
    
    // Update Supabase with connection status
    if (data.userId) {
      updateWhatsAppConnectionStatus(data.userId, data.connected);
    }
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
}
