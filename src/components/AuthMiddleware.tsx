
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthMiddlewareProps {
  children: ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default AuthMiddleware;
