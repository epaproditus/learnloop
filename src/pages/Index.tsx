import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useDevMode } from "../contexts/DevModeContext";
import { LoginCard } from "../components/auth/LoginCard";

const Index = () => {
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to LearnLoop</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to continue
          </p>
        </div>

        <LoginCard />
      </div>
    </div>
  );
};

export default Index;