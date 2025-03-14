
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanLine, QrCode, RefreshCw, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWhatsAppWebSocket } from "@/lib/websocket";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { updateWhatsAppConnectionStatus } from "@/lib/supabase";

const QRScanner = () => {
  const [pairingCode, setPairingCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [qrExpiryProgress, setQrExpiryProgress] = useState(100);
  const [isConnecting, setIsConnecting] = useState(false);
  const [generatedPairingCode, setGeneratedPairingCode] = useState("");
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("idle");
  const isMobile = useIsMobile();
  const { connect, disconnect, subscribe, sendMessage } = useWhatsAppWebSocket();
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  // Connect to WebSocket when component mounts
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Subscribe to WebSocket events
  useEffect(() => {
    // Handle QR code updates
    const unsubQR = subscribe('qr', (data) => {
      setQrData(data.qrcode);
      setQrExpiryProgress(100);
      setConnectionStatus("awaiting_scan");
      setIsConnecting(false);
    });

    // Handle ready/authenticated state
    const unsubReady = subscribe('ready', (data) => {
      setConnectionStatus("connected");
      setIsConnecting(false);
      toast({
        title: "WhatsApp Connected",
        description: "Your WhatsApp account has been successfully connected.",
      });
      
      // Update connection status in Supabase
      if (currentUser) {
        updateWhatsAppConnectionStatus(currentUser.uid, true);
      }
    });

    // Handle disconnection
    const unsubDisconnect = subscribe('disconnected', () => {
      setConnectionStatus("disconnected");
      setIsConnecting(false);
      setQrData(null);
      
      toast({
        title: "WhatsApp Disconnected",
        description: "Your WhatsApp connection has been lost. Please reconnect.",
        variant: "destructive",
      });
      
      // Update connection status in Supabase
      if (currentUser) {
        updateWhatsAppConnectionStatus(currentUser.uid, false);
      }
    });

    // Handle errors
    const unsubError = subscribe('error', (data) => {
      setConnectionStatus("error");
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: data.message || "There was an error connecting to WhatsApp.",
        variant: "destructive",
      });
    });

    return () => {
      unsubQR();
      unsubReady();
      unsubDisconnect();
      unsubError();
    };
  }, [currentUser]);

  // QR code expiry timer
  useEffect(() => {
    if (!qrData || qrExpiryProgress <= 0) return;

    const totalTime = 20; // 20 seconds
    const interval = 200; // update every 200ms
    const step = 100 / (totalTime * 1000 / interval);

    const timer = setInterval(() => {
      setQrExpiryProgress((prev) => {
        const newValue = prev - step;
        if (newValue <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newValue;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [qrData]);

  // Request new QR code when progress expires
  useEffect(() => {
    if (qrExpiryProgress <= 0 && connectionStatus === "awaiting_scan") {
      refreshQRCode();
    }
  }, [qrExpiryProgress, connectionStatus]);

  const handlePairingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsConnecting(true);
    
    // Send phone number to backend for pairing code generation
    sendMessage('generate_pairing_code', { phone: pairingCode });
    
    // Simulate pairing code generation for now
    setTimeout(() => {
      const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      setGeneratedPairingCode(randomCode);
      setShowGeneratedCode(true);
      setIsConnecting(false);
    }, 1500);
  };

  const refreshQRCode = () => {
    setIsConnecting(true);
    sendMessage('request_qr', {});
    
    // Fallback in case WebSocket isn't responding
    setTimeout(() => {
      if (isConnecting) {
        setIsConnecting(false);
        toast({
          title: "Connection Timeout",
          description: "Could not get a new QR code. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    }, 10000);
  };
  
  const handleStartScan = () => {
    setIsScanning(true);
    setShowGeneratedCode(false);
    setIsConnecting(true);
    refreshQRCode();
  };

  const qrSize = isMobile ? "w-full max-w-[250px]" : "w-64";

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="scan" 
            onClick={handleStartScan}
          >
            Scan QR Code
          </TabsTrigger>
          <TabsTrigger 
            value="pair" 
            onClick={() => {
              setIsScanning(false);
              setShowGeneratedCode(false);
            }}
          >
            Pairing Code
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="p-4 sm:p-6">
          <div className="text-center space-y-4">
            <div className="text-lg font-medium">Scan the QR code with WhatsApp</div>
            <p className="text-sm text-muted-foreground pb-2">
              Open WhatsApp on your phone, tap Menu or Settings and select WhatsApp Web
            </p>
            
            <div className="relative mx-auto flex items-center justify-center">
              {/* QR Code with responsive size */}
              <div className={`${qrSize} h-auto aspect-square p-4 border-2 border-botnexa-500 rounded-lg relative`}>
                {isConnecting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-8 w-8 animate-spin text-botnexa-500" />
                  </div>
                ) : qrData ? (
                  <img 
                    src={`data:image/png;base64,${qrData}`} 
                    alt="WhatsApp QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : connectionStatus === "connected" ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 p-2 rounded-full mb-2">
                      <ScanLine className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-600">Connected</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <QrCode className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No QR code available</p>
                  </div>
                )}
                
                {/* Scanning animation */}
                {qrData && connectionStatus === "awaiting_scan" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-botnexa-500/50 animate-scan" />
                  </div>
                )}
              </div>
              
              {/* Style for the scanning animation */}
              <style>
                {`
                  @keyframes scan {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(0); }
                  }
                  .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                  }
                `}
              </style>
            </div>
            
            {/* QR Code expiry progress bar */}
            {qrData && (
              <div className="w-full max-w-xs mx-auto">
                <Progress value={qrExpiryProgress} className="h-1" />
              </div>
            )}
            
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={refreshQRCode}
                disabled={isConnecting || connectionStatus === "connected"}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh QR
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground pt-2">
              {qrData 
                ? "QR code will refresh automatically after 20 seconds" 
                : "Click Refresh QR to generate a new QR code"}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="pair" className="p-4 sm:p-6">
          <div className="text-center space-y-4">
            <div className="text-lg font-medium">Connect with pairing code</div>
            
            {showGeneratedCode ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground pb-2">
                  Enter this 8-digit code in your WhatsApp:
                </p>
                <div className="text-3xl font-mono tracking-wider bg-muted p-4 rounded-lg">
                  {generatedPairingCode}
                </div>
                <p className="text-sm text-muted-foreground pb-2">
                  This code will expire in 5 minutes
                </p>
                <Button 
                  onClick={() => setShowGeneratedCode(false)}
                  variant="outline"
                  className="mt-2"
                >
                  Generate New Code
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground pb-2">
                  1. Open WhatsApp on your phone
                  <br />
                  2. Tap Menu or Settings and select Linked Devices
                  <br />
                  3. Tap on "Link a Device"
                </p>
                
                <form onSubmit={handlePairingSubmit} className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full">
                      <Input
                        type="number"
                        placeholder="Enter your phone number"
                        value={pairingCode}
                        onChange={(e) => setPairingCode(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-botnexa-500 hover:bg-botnexa-600"
                      disabled={!pairingCode.trim() || isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Pairing Code"
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default QRScanner;
