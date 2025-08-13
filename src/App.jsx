import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./Pages/LandingPage";
import ComplaintForm from "./Components/ComplaintForm";
import ComplaintSearch from "./Components/ComplaintSearch";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ComplaintHistory from "./Components/ComplaintHistory";
import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Components/features/authority_Dashboard/Layout";
import Dashboard from "./Pages/Dashboard";
import Complaints from "./Pages/Complaints";
import ComplaintReports from "./Pages/ComplaintReports";

import ModeratorLayout from "./Components/Moderator/ModeratorLayout";
import DashboardModerator from "./Pages/DashboardModerator";
import ComplaintsPage from "./Components/Moderator/ComplaintsTable";
import UsersPage from "./Components/Moderator/UsersTable";

import AdminDashboard from "./Components/Admin/AdminDashboard";
import DepartmentDashboard from "./Components/Dashboard/DepartmentDashboard";

// ====== ROUTE GUARDS ======
const PrivateRoute = ({ children }) => {
  const { currentUser, isAdmin, isDepartment, isGovernorate, userData } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!userData) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isDepartment || isGovernorate) return <Navigate to="/department/dashboard" replace />;
  return children;
};

const RoleRedirect = ({ children }) => {
  const { currentUser, userData, isAdmin, isDepartment, isGovernorate } = useAuth();
  if (!currentUser) return children;
  if (!userData) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isDepartment || isGovernorate) return <Navigate to="/department/dashboard" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, userData } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!userData) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const DepartmentRoute = ({ children }) => {
  const { currentUser, isDepartment, isGovernorate } = useAuth();
  return currentUser && (isDepartment || isGovernorate)
    ? children
    : <Navigate to="/login" replace />;
};

// ====== MAIN APP CONTENT ======
function AppContent() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        icon={false}
        toastClassName="custom-toast"
      />

      <Routes>
        {/* Public Pages */}
        <Route
          index
          element={
            <RoleRedirect>
              <LandingPage />
            </RoleRedirect>
          }
        />
        <Route
          path="/"
          element={
            <RoleRedirect>
              <LandingPage />
            </RoleRedirect>
          }
        />
        <Route path="/submitComplaint" element={<ComplaintForm />} />
        <Route path="/traceComplaint" element={<ComplaintSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Department/Governorate Dashboard */}
        <Route
          path="/department/dashboard"
          element={
            <DepartmentRoute>
              <DepartmentDashboard />
            </DepartmentRoute>
          }
        />

        {/* Citizen Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaintHistory"
          element={
            <PrivateRoute>
              <ComplaintHistory />
            </PrivateRoute>
          }
        />

        {/* Department Layout Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaint-reports" element={<ComplaintReports />} />
        </Route>

        {/* Moderator Routes */}
        <Route path="/moderator" element={<ModeratorLayout />}>
          <Route index element={<DashboardModerator />} />
          <Route path="dashboard" element={<DashboardModerator />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// ====== MAIN APP ======
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
