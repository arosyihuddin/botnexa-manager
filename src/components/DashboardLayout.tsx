
import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, BarChart3, Settings, Users, MessageSquare, Calendar, Bell, 
  LogOut, Search, Menu, X, Activity, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageTransition } from "@/lib/animations";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const DashboardLayout = ({ children, title, showBackButton, onBack }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { toast } = useToast();
  
  // Update sidebar state when mobile status changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <SidebarProvider defaultOpen={!isMobile}>
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <Sidebar className="border-r border-border z-30">
              <SidebarHeader className="py-4 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-botnexa-400 to-botnexa-600 flex items-center justify-center text-white font-bold text-lg">
                    B
                  </div>
                  <span className="font-bold text-xl">BotNexa</span>
                </div>
                {isMobile && (
                  <SidebarTrigger>
                    <Menu className="h-5 w-5" />
                  </SidebarTrigger>
                )}
              </SidebarHeader>
              
              <SidebarContent className="px-2 py-2">
                <nav className="flex flex-col space-y-2">
                  <NavItem 
                    icon={<Home className="h-5 w-5" />} 
                    label="Dashboard" 
                    active={location.pathname === '/dashboard'} 
                    to="/dashboard" 
                  />
                  <NavItem 
                    icon={<MessageSquare className="h-5 w-5" />} 
                    label="Conversations" 
                    active={location.pathname === '/conversations'} 
                    to="/conversations" 
                  />
                  <NavItem 
                    icon={<Bot className="h-5 w-5" />} 
                    label="Bots" 
                    active={location.pathname === '/bot-management'} 
                    to="/bot-management" 
                  />
                  <NavItem 
                    icon={<Calendar className="h-5 w-5" />} 
                    label="Reminders" 
                    active={location.pathname === '/reminders'} 
                    to="/reminders" 
                  />
                  <NavItem 
                    icon={<Users className="h-5 w-5" />} 
                    label="Contacts" 
                    active={location.pathname === '/contacts'} 
                    to="/contacts" 
                  />
                  <NavItem 
                    icon={<BarChart3 className="h-5 w-5" />} 
                    label="Analytics" 
                    active={location.pathname === '/analytics'} 
                    to="/analytics" 
                  />
                  <NavItem 
                    icon={<Activity className="h-5 w-5" />} 
                    label="Log Activity" 
                    active={location.pathname === '/log-activity'} 
                    to="/log-activity" 
                  />
                  <NavItem 
                    icon={<Settings className="h-5 w-5" />} 
                    label="Settings" 
                    active={location.pathname === '/settings'} 
                    to="/settings" 
                  />
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
            <div className="flex-1 flex flex-col min-h-0 w-full">
              {/* Header */}
              <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                  {isMobile && (
                    <SidebarTrigger>
                      <X className="h-5 w-5" />
                    </SidebarTrigger>
                  )}
                  
                  {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                  
                  <h1 className="text-xl font-semibold">{title}</h1>
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
                  
                  <ThemeToggle />
                  
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
              <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 w-full">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </PageTransition>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to: string;
}

const NavItem = ({ icon, label, active, to }: NavItemProps) => {
  const navigate = useNavigate();
  
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-botnexa-50 text-botnexa-700 dark:bg-botnexa-950/20 dark:text-botnexa-300"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      onClick={() => to && navigate(to)}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1 h-4 bg-botnexa-500 rounded-full" />}
    </button>
  );
};

export default DashboardLayout;
