
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthMiddlewareProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthMiddleware = ({ children, requireAuth = true }: AuthMiddlewareProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const publicPaths = ['/login', '/register', '/forgot-password', '/terms-of-service', '/privacy-policy'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && requireAuth) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate("/login");
      } else if (user && !requireAuth && publicPaths.includes(location.pathname)) {
        // Redirect already logged in users away from auth pages
        navigate("/dashboard");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, toast, requireAuth, location.pathname]);

  return <>{children}</>;
};

export default AuthMiddleware;
