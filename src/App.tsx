import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DevModeProvider } from "./contexts/DevModeContext";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudentAssignment from "./pages/StudentAssignment";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Auth state changed:", _event, session); // Debug log
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <DevModeProvider>
      <div className="min-h-screen bg-gray-50">
        <Router>
          <Routes>
            {/* Handle root route - redirect based on auth state */}
            <Route
              path="/"
              element={
                session ? (
                  <Navigate to="/teacher" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignment/:id"
              element={
                <ProtectedRoute>
                  <StudentAssignment />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </DevModeProvider>
  );
}

export default App;