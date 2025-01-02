import { useState } from "react";
import { ProblemCreator } from "../components/teacher/ProblemCreator";
import { WorkspaceArea } from "../components/teacher/WorkspaceArea";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDevMode } from "../contexts/DevModeContext";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { isDevMode, setIsDevMode } = useDevMode();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDevMode(!isDevMode)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
            >
              {isDevMode ? "Dev Mode: ON" : "Dev Mode: OFF"}
            </Button>
          </div>
          {!isDevMode && (
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Sign Out
            </Button>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left sidebar - Problem Blocks */}
          <div className="w-80 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Problem Blocks</h2>
            <div className="space-y-4">
              <ProblemCreator />
            </div>
          </div>

          {/* Main workspace area */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Assignment Workspace</h2>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Preview</Button>
                <Button size="sm">Publish</Button>
              </div>
            </div>
            <WorkspaceArea />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
