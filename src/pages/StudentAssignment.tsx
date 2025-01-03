import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useDevMode } from "../contexts/DevModeContext";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";

type Tables = Database['public']['Tables'];
type Assignment = Tables['assignments']['Row'] & {
  blocks: Tables['assignment_blocks']['Row'][];
  student_progress?: Tables['student_submissions']['Row'][];
};

export default function StudentAssignment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDevMode } = useDevMode();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      // Get assignment with blocks and student progress
      const { data: assignment } = await supabase
        .from('assignments')
        .select(`
          *,
          blocks:assignment_blocks(*),
          student_progress:student_submissions(*)
        `)
        .eq('id', id)
        .single();

      if (assignment) {
        setAssignment(assignment);
        
        // Load existing answers if in progress
        const progress = assignment.student_progress?.[0];
        if (progress?.answers) {
          setAnswers(progress.answers as Record<string, string>);
        }

        // Update submission status if just starting
        if (!progress && !isDevMode) {
          await supabase
            .from('student_submissions')
            .insert({
              assignment_id: assignment.id,
              student_id: user.id,
              status: 'in_progress',
              started_at: new Date().toISOString(),
            });
        }
      }
    } catch (error) {
      console.error('Error loading assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (blockId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blockId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMode) return;

      // Calculate time spent
      const progress = assignment.student_progress?.[0];
      const startTime = progress?.started_at ? new Date(progress.started_at) : new Date();
      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

      if (!isDevMode) {
        // Update submission
        await supabase
          .from('student_submissions')
          .upsert({
            assignment_id: assignment.id,
            student_id: user.id,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            answers,
            time_spent: timeSpent,
          });
      }

      navigate('/student');
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/student')}
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {assignment.description && (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700">{assignment.description}</p>
            </div>
          )}

          <div className="space-y-6">
            {assignment.blocks.map((block) => (
              <div key={block.id} className="bg-white p-6 rounded-lg shadow">
                {block.type === 'text' && (
                  <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                )}
                {block.type === 'answer' && (
                  <div className="space-y-2">
                    <label
                      htmlFor={block.id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Answer
                    </label>
                    <textarea
                      id={block.id}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={answers[block.id] || ''}
                      onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                    />
                  </div>
                )}
                {block.type === 'image' && (
                  <img
                    src={block.content}
                    alt="Assignment content"
                    className="max-w-full h-auto"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
