import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useDevMode } from "../contexts/DevModeContext";
import { AssignmentsList } from "../components/teacher/AssignmentsList";
import { StudentProgress } from "../components/teacher/StudentProgress";
import { WorkspaceArea } from "../components/teacher/WorkspaceArea";
import { supabase } from "../lib/supabase";
import type { Assignment } from "../types/Assignment";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { isDevMode, setIsDevMode } = useDevMode();
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit" | "progress">("list");
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

  const handleCreateAssignment = async (assignment: Partial<Assignment>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignment,
          teacher_id: user?.id || 'dev-user',
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentAssignment(data as Assignment);
        setCurrentView("edit");
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleUpdateAssignment = async (assignment: Partial<Assignment>) => {
    if (!currentAssignment) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      const { data, error } = await supabase
        .from('assignments')
        .update({
          ...assignment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentAssignment.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentAssignment(data as Assignment);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handlePublishAssignment = async (courseId: string, assignment: Assignment) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      const { error } = await supabase
        .from('assignments')
        .insert({
          ...assignment,
          teacher_id: user?.id || 'dev-user',
          status: 'published',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          google_classroom_id: courseId,
        });

      if (error) throw error;
      setCurrentView("list");
    } catch (error) {
      console.error('Error publishing assignment:', error);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setCurrentView("edit");
  };

  const handleViewProgress = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setCurrentView("progress");
  };

  const handleBack = () => {
    setCurrentView("list");
    setCurrentAssignment(null);
  };

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
          <div className="flex items-center gap-4">
            {currentView === "list" && (
              <Button onClick={() => setCurrentView("create")}>
                Create Assignment
              </Button>
            )}
            {!isDevMode && (
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "list" && (
          <AssignmentsList
            onEdit={handleEditAssignment}
            onViewProgress={handleViewProgress}
          />
        )}

        {(currentView === "create" || currentView === "edit") && (
          <WorkspaceArea
            assignment={currentAssignment}
            onCreate={handleCreateAssignment}
            onUpdate={handleUpdateAssignment}
            onPublish={handlePublishAssignment}
            onBack={handleBack}
          />
        )}

        {currentView === "progress" && currentAssignment && (
          <StudentProgress
            assignment={currentAssignment}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}
