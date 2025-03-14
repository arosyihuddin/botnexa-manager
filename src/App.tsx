
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense, useEffect } from "react";
import AuthMiddleware from "@/components/AuthMiddleware";
import { whatsAppWebSocket } from "@/lib/websocket";
import { auth } from "@/lib/firebase";
import { saveUserToSupabase } from "@/lib/supabase";
import LoadingState from "@/components/LoadingState";
import { WhatsAppService } from "@/services/whatsapp.service";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard";
import AISettings from "./pages/AISettings";
import Conversations from "./pages/Conversations";
import Reminders from "./pages/Reminders";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import LogActivity from "./pages/LogActivity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const WebSocketInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize WebSocket connection if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Connect WebSocket
        whatsAppWebSocket.connect();
        
        // Initialize WhatsApp service
        WhatsAppService.initialize();
        
        // Save user to Supabase
        saveUserToSupabase(user).catch(console.error);
      } else {
        whatsAppWebSocket.disconnect();
      }
    });
    
    return () => {
      unsubscribe();
      whatsAppWebSocket.disconnect();
    };
  }, []);
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="botnexa-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WebSocketInitializer>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Suspense fallback={<LoadingState type="full" />}><Index /></Suspense>} />
                <Route path="/login" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware requireAuth={false}><Login /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/register" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware requireAuth={false}><Register /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/forgot-password" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware requireAuth={false}><ForgotPassword /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/terms-of-service" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware requireAuth={false}><TermsOfService /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/privacy-policy" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware requireAuth={false}><PrivacyPolicy /></AuthMiddleware>
                  </Suspense>
                } />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Dashboard /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/ai-settings" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><AISettings /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/conversations" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Conversations /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/reminders" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Reminders /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/analytics" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Analytics /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/settings" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Settings /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/contacts" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><Contacts /></AuthMiddleware>
                  </Suspense>
                } />
                <Route path="/log-activity" element={
                  <Suspense fallback={<LoadingState type="full" />}>
                    <AuthMiddleware><LogActivity /></AuthMiddleware>
                  </Suspense>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WebSocketInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
