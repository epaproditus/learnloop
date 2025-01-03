import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useDevMode } from "../contexts/DevModeContext";
import { supabase, ensureArray } from "../lib/supabase";
import type { Assignment } from "../types/Assignment";
import { formatDistanceToNow } from "date-fns";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isDevMode, setIsDevMode } = useDevMode();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      // Get all published assignments
      const { data } = await supabase
        .from('assignments')
        .select(`
          *,
          blocks:assignment_blocks(*),
          student_progress:student_submissions(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (data) {
        setAssignments(ensureArray(data) as Assignment[]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.student_progress?.length) return "not_started";
    return assignment.student_progress[0].status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "text-gray-500";
      case "in_progress":
        return "text-blue-500";
      case "submitted":
        return "text-green-500";
      case "graded":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "not_started":
        return "Not Started";
      case "in_progress":
        return "In Progress";
      case "submitted":
        return "Submitted";
      case "graded":
        return "Graded";
      default:
        return status;
    }
  };

  const renderAssignmentCard = (assignment: Assignment) => {
    const status = getAssignmentStatus(assignment);
    const statusColor = getStatusColor(status);
    const progress = assignment.student_progress?.[0];

    return (
      <Card key={assignment.id} className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{assignment.title}</h3>
            {assignment.description && (
              <p className="text-sm text-gray-500">{assignment.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Due {assignment.due_date ? formatDistanceToNow(new Date(assignment.due_date)) : 'No due date'}</span>
              {assignment.max_points && (
                <span>• {assignment.max_points} points</span>
              )}
              <span>• <span className={statusColor}>{getStatusText(status)}</span></span>
              {progress?.grade && (
                <span>• Grade: {progress.grade}/{assignment.max_points}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={status === "not_started" ? "default" : "outline"}
              onClick={() => navigate(`/student/assignment/${assignment.id}`)}
            >
              {status === "not_started" ? "Start" : "Continue"}
            </Button>
            {assignment.google_classroom_link && (
              <Button
                variant="outline"
                onClick={() => window.open(assignment.google_classroom_link!, '_blank')}
              >
                Open in Classroom
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Assignments</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No assignments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map(renderAssignmentCard)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
