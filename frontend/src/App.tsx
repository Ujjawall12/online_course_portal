import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { AdminLayout } from '@/components/AdminLayout';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Dashboard } from '@/pages/Dashboard';
import { AvailableCourses } from '@/pages/AvailableCourses';
import { MyPreferences } from '@/pages/MyPreferences';
import { AllotmentResult } from '@/pages/AllotmentResult';
import { MyEnrollments } from '@/pages/MyEnrollments';
import { Profile } from '@/pages/Profile';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminStudents } from '@/pages/AdminStudents';
import { AdminCourses } from '@/pages/AdminCourses';
import { AdminAllotment } from '@/pages/AdminAllotment';

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#F5F7FB]">
      <p className="text-muted-foreground">Forgot password – Phase 2.</p>
    </div>
  );
}

// Role-based redirect: students go to /, admins go to /admin/dashboard
function RoleBased() {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<AvailableCourses />} />
            <Route path="preferences" element={<MyPreferences />} />
            <Route path="result" element={<AllotmentResult />} />
            <Route path="enrollments" element={<MyEnrollments />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminStudents />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCourses />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/allotment"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAllotment />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
