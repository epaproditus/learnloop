but import { useState, useEffect } from "react";
import { Assignment } from "../../types/Assignment";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { googleClassroom } from "../../services/googleClassroom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import type { GoogleClassroomCourse } from "../../types/google-classroom";

interface PublishDialogProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (courseId: string, assignment: Assignment) => Promise<void>;
}

export function PublishDialog({
  assignment,
  open,
  onOpenChange,
  onPublish,
}: PublishDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [maxPoints, setMaxPoints] = useState(assignment.max_points || 100);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    if (open) {
      loadCourses();
    }
  }, [open]);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const courses = await googleClassroom.getCourses();
      setCourses(courses);
      if (courses.length > 0) {
        setSelectedCourseId(courses[0].id);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedCourseId) return;

    try {
      setIsLoading(true);
      const updatedAssignment: Assignment = {
        ...assignment,
        max_points: maxPoints,
        due_date: dueDate || undefined,
      };
      await onPublish(selectedCourseId, updatedAssignment);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to publish assignment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish to Google Classroom</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Course</Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="points">Maximum Points</Label>
            <Input
              id="points"
              type="number"
              min="0"
              max="100"
              value={maxPoints}
              onChange={(e) => setMaxPoints(Number(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading || !selectedCourseId}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
