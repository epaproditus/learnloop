import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideGraduationCap } from "lucide-react";

export const LoginCard = () => {
  const handleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Login clicked");
  };

  return (
    <Card className="w-[380px] shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <LucideGraduationCap className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Welcome to EduMath</CardTitle>
        <CardDescription>Sign in to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleLogin}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
};