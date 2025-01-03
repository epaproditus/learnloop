import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'learnloop-auth',
    flowType: "pkce",
  },
});

// Helper types for better type inference
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Helper functions for type casting
export function ensureArray<T>(data: T | T[] | null): T[] {
  if (Array.isArray(data)) return data;
  if (data === null) return [];
  return [data];
}

export function ensureNonNullable<T>(data: T | null): T {
  if (data === null) throw new Error("Unexpected null value");
  return data;
}
