import { ProblemCreator } from "@/components/teacher/ProblemCreator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Sign Out
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Create New Problem</h2>
            <ProblemCreator />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Student Progress</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500">No active assignments yet.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;