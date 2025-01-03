import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase, ensureArray } from "../../lib/supabase";
import type { Assignment, Submission } from "../../types/Assignment";
import { formatDistanceToNow } from "date-fns";

interface StudentProgressProps {
  assignment: Assignment;
  onBack: () => void;
}

export function StudentProgress({ assignment, onBack }: StudentProgressProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, number>>({});

  useEffect(() => {
    loadSubmissions();
  }, [assignment.id]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('student_submissions')
        .select(`
          *,
          student:profiles(*)
        `)
        .eq('assignment_id', assignment.id);

      if (error) throw error;

      if (data) {
        const submissions = ensureArray(data) as Submission[];
        setSubmissions(submissions);
        
        // Initialize feedback and grades from existing data
        const feedbackMap: Record<string, string> = {};
        const gradesMap: Record<string, number> = {};
        
        submissions.forEach(submission => {
          if (submission.feedback) {
            feedbackMap[submission.id] = submission.feedback;
          }
          if (submission.grade !== null) {
            gradesMap[submission.id] = submission.grade;
          }
        });

        setFeedback(feedbackMap);
        setGrades(gradesMap);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSubmit = async (submissionId: string) => {
    try {
      setIsSaving(true);
      const grade = grades[submissionId];
      const feedbackText = feedback[submissionId];

      await supabase
        .from('student_submissions')
        .update({
          grade,
          feedback: feedbackText,
          graded_at: new Date().toISOString(),
          status: 'graded',
        })
        .eq('id', submissionId);

      // Refresh submissions
      await loadSubmissions();
    } catch (error) {
      console.error('Error saving grade:', error);
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
          >
            ← Back to Assignments
          </Button>
          <h1 className="text-2xl font-bold">Student Progress</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{assignment.title}</h2>
        {assignment.description && (
          <p className="text-gray-500 mb-4">{assignment.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Max Points: {assignment.max_points}</span>
          {assignment.due_date && (
            <span>Due: {formatDistanceToNow(new Date(assignment.due_date))} ago</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {submission.student.full_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={getStatusColor(submission.status)}>
                        {getStatusText(submission.status)}
                      </span>
                      {submission.submitted_at && (
                        <span>
                          • Submitted {formatDistanceToNow(new Date(submission.submitted_at))} ago
                        </span>
                      )}
                      {submission.time_spent && (
                        <span>
                          • Time spent: {Math.round(submission.time_spent / 60)} minutes
                        </span>
                      )}
                    </div>
                  </div>
                  {submission.status === 'submitted' && (
                    <Button
                      size="sm"
                      onClick={() => handleGradeSubmit(submission.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Grade'}
                    </Button>
                  )}
                </div>

                {submission.answers && (
                  <div className="space-y-4 mt-4">
                    <h4 className="font-medium">Answers</h4>
                    {Object.entries(submission.answers as Record<string, string>).map(([blockId, answer]) => (
                      <div key={blockId} className="bg-gray-50 p-4 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{answer}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {submission.status === 'submitted' && (
                  <div className="grid gap-4 mt-4">
                    <div>
                      <Label htmlFor={`grade-${submission.id}`}>Grade (out of {assignment.max_points})</Label>
                      <Input
                        id={`grade-${submission.id}`}
                        type="number"
                        min="0"
                        max={assignment.max_points}
                        value={grades[submission.id] || ''}
                        onChange={(e) => setGrades(prev => ({
                          ...prev,
                          [submission.id]: Number(e.target.value),
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
                      <textarea
                        id={`feedback-${submission.id}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                        value={feedback[submission.id] || ''}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          [submission.id]: e.target.value,
                        }))}
                      />
                    </div>
                  </div>
                )}

                {submission.status === 'graded' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Grade:</span>
                      <span>{submission.grade}/{assignment.max_points}</span>
                    </div>
                    {submission.feedback && (
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="mt-1 text-gray-700">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
