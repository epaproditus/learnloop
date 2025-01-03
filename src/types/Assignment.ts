import type { Json } from "./supabase";
import type { TableRow } from "../lib/supabase";

export type AssignmentStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "not_started" | "in_progress" | "submitted" | "graded";
export type WorkspaceMode = "single" | "slideshow" | "infinite";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Block extends TableRow<"assignment_blocks"> {
  type: "text" | "answer" | "image";
  position?: Position;
  size?: Size;
  settings?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    answerType?: 'text' | 'multiple_choice';
    options?: string[];
    maxSize?: number;
    allowedTypes?: string[];
  };
}

export interface Submission extends TableRow<"student_submissions"> {
  student: TableRow<"profiles">;
}

export interface AssignmentRubric {
  workspace_mode?: WorkspaceMode;
  criteria?: Array<{
    name: string;
    points: number;
    description?: string;
  }>;
  [key: string]: Json | undefined;
}

export interface Assignment extends Omit<TableRow<"assignments">, "rubric"> {
  blocks: Block[];
  student_progress?: Submission[];
  rubric: AssignmentRubric | null;
}

export interface AssignmentBlock {
  id: string;
  type: "text" | "answer" | "image";
  content: string | null;
  order_index: number;
  position?: Position;
  size?: Size;
  settings?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    answerType?: 'text' | 'multiple_choice';
    options?: string[];
    maxSize?: number;
    allowedTypes?: string[];
  };
}
