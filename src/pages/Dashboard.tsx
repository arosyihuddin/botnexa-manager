
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, BarChart3, Settings, Users, MessageSquare, BrainCircuit, Calendar, Bell, 
  LogOut, Search, User, Menu, X, CheckCircle2
} from "lucide-react";
import QRScanner from "@/components/QRScanner";
import ChatHistory from "@/components/ChatHistory";
import { PageTransition } from "@/lib/animations";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate connection status after 5 seconds for demo
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);
  
  const handleLogout = () => {
    // This would be your actual logout logic
    navigate('/login');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar className="border-r border-border">
              <SidebarHeader className="py-4 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-botnexa-400 to-botnexa-600 flex items-center justify-center text-white font-bold text-lg">
                    B
                  </div>
                  <span className="font-bold text-xl">BotNexa</span>
                </div>
                
                {isMobile && (
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SidebarTrigger>
                )}
              </SidebarHeader>
              
              <SidebarContent className="px-2 py-2">
                <nav className="space-y-1">
                  <NavItem icon={<Home />} label="Dashboard" active />
                  <NavItem icon={<MessageSquare />} label="Conversations" />
                  <NavItem icon={<BrainCircuit />} label="AI Settings" />
                  <NavItem icon={<Calendar />} label="Reminders" />
                  <NavItem icon={<Users />} label="Contacts" />
                  <NavItem icon={<BarChart3 />} label="Analytics" />
                  <NavItem icon={<Settings />} label="Settings" />
                </nav>
              </SidebarContent>
              
              <SidebarFooter className="p-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header */}
              <header className="h-14 border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  {isMobile && (
                    <SidebarTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SidebarTrigger>
                  )}
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search..." 
                      className="w-[200px] pl-8 bg-background focus-visible:ring-botnexa-500"
                    />
                  </div>
                  
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-botnexa-500 rounded-full"></span>
                  </Button>
                  
                  <Avatar className="h-8 w-8 hidden sm:flex">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </header>
              
              {/* Content */}
              <main className="flex-1 overflow-auto p-4 md:p-6">
                {isConnected ? (
                  <ConnectedDashboard />
                ) : (
                  <ConnectionSetup />
                )}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </PageTransition>
  );
};

const ConnectionSetup = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Connect Your WhatsApp</h1>
        <p className="text-muted-foreground">
          To start using BotNexa, connect your WhatsApp account by scanning the QR code or entering a pairing code.
        </p>
      </div>
      
      <QRScanner />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Having trouble connecting? Check our{" "}
          <a href="#" className="text-botnexa-600 hover:text-botnexa-700 transition-colors">
            troubleshooting guide
          </a>{" "}
          or{" "}
          <a href="#" className="text-botnexa-600 hover:text-botnexa-700 transition-colors">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

const ConnectedDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, John!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your WhatsApp bot today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Bot Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total Messages" 
              value="2,384" 
              change="+12.5%"
              description="vs. last week"
              positive
            />
            <MetricCard 
              title="Active Users" 
              value="1,429" 
              change="+4.3%"
              description="vs. last week"
              positive
            />
            <MetricCard 
              title="Response Rate" 
              value="93.2%" 
              change="-0.8%"
              description="vs. last week"
              positive={false}
            />
            <MetricCard 
              title="Avg. Response Time" 
              value="28s" 
              change="-13.2%"
              description="vs. last week"
              positive={true}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Recent chat history with your bot</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChatHistory />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>Scheduled tasks and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-4">
                    <ReminderItem 
                      title="Team Meeting" 
                      date="Today, 2:00 PM" 
                      description="Discuss project progress"
                    />
                    <ReminderItem 
                      title="Follow up with Client" 
                      date="Tomorrow, 10:00 AM" 
                      description="Send proposal updates"
                    />
                    <ReminderItem 
                      title="RAG Setup" 
                      date="Tomorrow, 9:00 AM" 
                      description="Continue with the RAG configuration"
                    />
                    <ReminderItem 
                      title="Weekly Report" 
                      date="Friday, 4:00 PM" 
                      description="Prepare analytics summary"
                    />
                    <ReminderItem 
                      title="Team Lunch" 
                      date="Friday, 12:30 PM" 
                      description="Company cafeteria"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed insights and statistics about your WhatsApp bot performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics charts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>
                Manage your WhatsApp bot settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="botName" className="text-sm font-medium">Bot Name</label>
                    <Input id="botName" value="BotNexa Assistant" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium">Primary Language</label>
                    <Input id="language" value="English" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">AI Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how your AI agent interacts with users
                  </p>
                  
                  <div className="pt-2">
                    <div className="space-y-2">
                      <label htmlFor="personality" className="text-sm font-medium">Bot Personality</label>
                      <Input id="personality" value="Helpful, professional, and friendly" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button className="bg-botnexa-500 hover:bg-botnexa-600">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => (
  <button
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-botnexa-50 text-botnexa-700"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="ml-auto w-1 h-4 bg-botnexa-500 rounded-full" />}
  </button>
);

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  positive: boolean;
}

const MetricCard = ({ title, value, change, description, positive }: MetricCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          <span className={`text-xs font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

interface ReminderItemProps {
  title: string;
  date: string;
  description: string;
}

const ReminderItem = ({ title, date, description }: ReminderItemProps) => (
  <div className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 border-border">
    <div className="mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-botnexa-100 flex items-center justify-center">
      <Calendar className="h-4 w-4 text-botnexa-600" />
    </div>
    <div className="flex-1 space-y-1">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center">
        <Badge variant="outline" className="text-xs bg-botnexa-50 text-botnexa-700 border-botnexa-200">
          {date}
        </Badge>
      </div>
    </div>
  </div>
);

export default Dashboard;
