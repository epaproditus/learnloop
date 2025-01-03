export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          title: string
          description: string | null
          teacher_id: string
          created_at: string
          updated_at: string
          published_at: string | null
          status: "draft" | "published" | "archived"
          google_classroom_id: string | null
          google_classroom_link: string | null
          max_points: number | null
          due_date: string | null
          rubric: Json | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          teacher_id: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          status: "draft" | "published" | "archived"
          google_classroom_id?: string | null
          google_classroom_link?: string | null
          max_points?: number | null
          due_date?: string | null
          rubric?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          teacher_id?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          status?: "draft" | "published" | "archived"
          google_classroom_id?: string | null
          google_classroom_link?: string | null
          max_points?: number | null
          due_date?: string | null
          rubric?: Json | null
        }
      }
      assignment_blocks: {
        Row: {
          id: string
          assignment_id: string
          type: string
          content: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          type: string
          content?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          type?: string
          content?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      student_submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          status: "not_started" | "in_progress" | "submitted" | "graded"
          started_at: string | null
          submitted_at: string | null
          graded_at: string | null
          grade: number | null
          feedback: string | null
          answers: Json | null
          time_spent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          status: "not_started" | "in_progress" | "submitted" | "graded"
          started_at?: string | null
          submitted_at?: string | null
          graded_at?: string | null
          grade?: number | null
          feedback?: string | null
          answers?: Json | null
          time_spent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          status?: "not_started" | "in_progress" | "submitted" | "graded"
          started_at?: string | null
          submitted_at?: string | null
          graded_at?: string | null
          grade?: number | null
          feedback?: string | null
          answers?: Json | null
          time_spent?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
