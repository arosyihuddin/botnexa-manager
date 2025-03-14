
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";
import AuthMiddleware from "@/components/AuthMiddleware";
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

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="botnexa-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Index /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<div>Loading...</div>}><Register /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<div>Loading...</div>}><ForgotPassword /></Suspense>} />
            <Route path="/terms-of-service" element={<Suspense fallback={<div>Loading...</div>}><TermsOfService /></Suspense>} />
            <Route path="/privacy-policy" element={<Suspense fallback={<div>Loading...</div>}><PrivacyPolicy /></Suspense>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Dashboard /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/ai-settings" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><AISettings /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/conversations" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Conversations /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/reminders" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Reminders /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/analytics" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Analytics /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/settings" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Settings /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/contacts" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><Contacts /></AuthMiddleware>
              </Suspense>
            } />
            <Route path="/log-activity" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthMiddleware><LogActivity /></AuthMiddleware>
              </Suspense>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

};

export default App;
