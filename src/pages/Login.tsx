import { LoginCard } from "../components/auth/LoginCard";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to LearnLoop</h1>
          <p className="mt-2 text-gray-600">
            Sign in with your Google account or use dev mode
          </p>
        </div>

        <LoginCard />
      </div>
    </div>
  );
}
