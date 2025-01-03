import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { supabase, ensureArray } from "../../lib/supabase";
import type { Assignment } from "../../types/Assignment";
import { formatDistanceToNow } from "date-fns";

interface AssignmentsListProps {
  onEdit: (assignment: Assignment) => void;
  onViewProgress: (assignment: Assignment) => void;
}

export function AssignmentsList({ onEdit, onViewProgress }: AssignmentsListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('assignments')
        .select(`
          *,
          blocks:assignment_blocks(*),
          student_progress:student_submissions(*)
        `)
        .eq('teacher_id', user.id)
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

  const getStudentProgressSummary = (assignment: Assignment) => {
    if (!assignment.student_progress?.length) return null;

    const progress = assignment.student_progress;
    const submitted = progress.filter(p => p.status === "submitted" || p.status === "graded").length;
    const total = progress.length;

    return `${submitted}/${total} submitted`;
  };

  const renderAssignmentCard = (assignment: Assignment) => {
    const isPublished = assignment.status === "published";
    const progressSummary = getStudentProgressSummary(assignment);

    return (
      <Card key={assignment.id} className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{assignment.title}</h3>
            {assignment.description && (
              <p className="text-sm text-gray-500">{assignment.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Created {formatDistanceToNow(new Date(assignment.created_at))} ago</span>
              {assignment.max_points && (
                <span>• {assignment.max_points} points</span>
              )}
              {progressSummary && (
                <span>• {progressSummary}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPublished ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProgress(assignment)}
                >
                  View Progress
                </Button>
                {assignment.google_classroom_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(assignment.google_classroom_link, '_blank')}
                  >
                    Open in Classroom
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(assignment)}
              >
                Edit Draft
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No assignments yet</p>
        </div>
      ) : (
        assignments.map(renderAssignmentCard)
      )}
    </div>
  );
}
