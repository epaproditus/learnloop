import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDevMode } from "../../contexts/DevModeContext";

export const LoginCard = () => {
  const navigate = useNavigate();
  const { setIsDevMode } = useDevMode();

  const handleDevModeLogin = () => {
    setIsDevMode(true);
    navigate("/teacher");
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl">👨‍🏫</div>
          <h1 className="text-2xl font-bold">Welcome to EduMath</h1>
          <p className="text-sm text-gray-500">Sign in to access your dashboard</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {/* TODO: Implement Google Auth */}}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4"
          />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleDevModeLogin}
        >
          Continue in Dev Mode
        </Button>
      </CardContent>
    </Card>
  );
};
