import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useDevMode } from "../../contexts/DevModeContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDevMode, setIsDevMode } = useDevMode();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google login process...");
      console.log("Current origin:", window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/teacher`,
        },
      });

      console.log("Auth response:", { data, error });

      if (error) {
        console.error("Detailed auth error:", error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Detailed error signing in with Google:', error);
      toast({
        title: "Login Failed",
        description: "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = (role: 'teacher' | 'student') => {
    setIsDevMode(true);
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  return (
    <Card className="w-[400px] p-6">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to LearnLoop</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Development Mode
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleDevLogin('teacher')}
            >
              Continue as Teacher
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDevLogin('student')}
            >
              Continue as Student
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}