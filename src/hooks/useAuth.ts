import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";

export function useAuth(redirectUrl?: string) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn && redirectUrl) {
      navigate(`/login?redirect_url=${encodeURIComponent(redirectUrl)}`, { replace: true });
    }
  }, [isLoaded, isSignedIn, redirectUrl, navigate]);

  return { isAuthenticated: isSignedIn, isLoaded };
}
