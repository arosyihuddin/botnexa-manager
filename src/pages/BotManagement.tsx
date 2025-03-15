
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, Trash2, Bot, MessageSquare, BotOff, QrCode, Loader2, Settings } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserService, UserBot } from "@/services/user.service";
import { WhatsAppService } from "@/services/whatsapp.service";
import DashboardLayout from "@/components/DashboardLayout";
import QRScanner from "@/components/QRScanner";
import { PageTransition } from "@/lib/animations";

const BotManagement = () => {
  const [bots, setBots] = useState<UserBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<UserBot | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBots = async () => {
      try {
        setIsLoading(true);
        const userBots = await UserService.getUserBots();
        setBots(userBots);
      } catch (error) {
        console.error("Error loading bots:", error);
        toast({
          title: "Error",
          description: "Could not load your bots. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBots();
  }, [toast]);

  const handleToggleBot = async (bot: UserBot) => {
    try {
      const result = await UserService.toggleBotStatus(bot.id, !bot.isConnected);
      
      // If we're turning a bot on, show the QR code
      if (!bot.isConnected) {
        setSelectedBot(bot);
        setShowQrCode(true);
      }
      
      // Refresh bot list
      const updatedBots = await UserService.getUserBots();
      setBots(updatedBots);
      
      toast({
        title: bot.isConnected ? "Bot Deactivated" : "Bot Activated",
        description: bot.isConnected 
          ? `${bot.name} has been turned off` 
          : `${bot.name} has been turned on`,
      });
    } catch (error) {
      console.error("Error toggling bot status:", error);
      toast({
        title: "Error",
        description: "Could not change bot status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteBot = async (botId: string) => {
    try {
      await UserService.deleteBot(botId);
      setBots(bots.filter(bot => bot.id !== botId));
      toast({
        title: "Bot Deleted",
        description: "The bot has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast({
        title: "Error",
        description: "Could not delete the bot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenBotSettings = (botId: string) => {
    navigate(`/bot-settings/${botId}`);
  };

  return (
    <DashboardLayout title="Bot Management">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Manage Your Bots</h2>
              <p className="text-muted-foreground">
                Create, configure, and control your messaging bots.
              </p>
            </div>
            <CreateBotDialog onBotCreated={(newBot) => setBots([...bots, newBot])} />
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex flex-col animate-pulse">
                  <CardHeader className="bg-muted/20 h-24"></CardHeader>
                  <CardContent className="flex-1 space-y-4 py-4">
                    <div className="h-5 bg-muted/20 rounded"></div>
                    <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 h-16"></CardFooter>
                </Card>
              ))}
            </div>
          ) : bots.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No Bots Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You don't have any bots set up yet. Create your first bot to start automating your messaging.
                </p>
                <CreateBotDialog onBotCreated={(newBot) => setBots([...bots, newBot])} />
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot) => (
                <Card key={bot.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={bot.status === 'online' ? "default" : "outline"}
                        className={bot.status === 'online' ? "bg-green-500" : ""}
                      >
                        {bot.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
                      <Badge variant="outline">{bot.type}</Badge>
                    </div>
                    <CardTitle className="mt-2">{bot.name}</CardTitle>
                    <CardDescription>
                      {bot.isConnected 
                        ? `Connected since ${bot.lastConnection || 'recently'}`
                        : 'Not connected'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {bot.isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                          <div 
                            className={`h-2.5 w-2.5 rounded-full ${
                              bot.isConnected ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={bot.status === 'online'} 
                        onCheckedChange={() => handleToggleBot(bot)}
                      />
                      <span className="text-sm">
                        {bot.status === 'online' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleOpenBotSettings(bot.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteBot(bot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* QR Code Dialog */}
        <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect {selectedBot?.name}</DialogTitle>
              <DialogDescription>
                Scan this QR code with WhatsApp to connect your account
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <QRScanner />
            </div>
            <DialogFooter>
              <Button onClick={() => setShowQrCode(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

interface CreateBotDialogProps {
  onBotCreated: (bot: UserBot) => void;
}

const CreateBotDialog = ({ onBotCreated }: CreateBotDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateBot = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your bot",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number for your bot",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      // Use the correct endpoint to create bot
      const response = await fetch('http://localhost:3000/api/v1/bots/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'nama bot': name.trim(),
          'nomor telpon': phoneNumber.trim(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create bot');
      }
      
      const newBot = await response.json();
      
      onBotCreated(newBot);
      setOpen(false);
      setName("");
      setPhoneNumber("");
      
      toast({
        title: "Bot Created",
        description: `${newBot.name} has been created successfully.`,
      });
    } catch (error) {
      console.error("Error creating bot:", error);
      toast({
        title: "Error",
        description: "Could not create the bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-botnexa-500 hover:bg-botnexa-600">
          <Plus className="mr-2 h-4 w-4" />
          New Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Bot</DialogTitle>
          <DialogDescription>
            Set up a new messaging bot for your account
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              placeholder="My WhatsApp Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the phone number in international format (e.g., +1234567890)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBot} 
            disabled={isCreating}
            className="bg-botnexa-500 hover:bg-botnexa-600"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Bot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BotManagement;
