import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import Unauthorized from "./Pages/Unauthorized";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Authority/Dashboard
import Layout from "./Components/features/authority_Dashboard/Layout";
import Dashboard from "./Pages/Dashboard";
import Complaints from "./Pages/Complaints";
import ComplaintReports from "./Pages/ComplaintReports";

// Moderator
import ModeratorLayout from "./Components/Moderator/ModeratorLayout";
import DashboardModerator from "./Pages/DashboardModerator";
import ComplaintsPage from "./Components/Moderator/ComplaintsTable";
import UsersPage from "./Components/Moderator/UsersTable";

// Admin & Department
import AdminDashboard from "./Components/Admin/AdminDashboard";
import DepartmentDashboard from "./Components/Dashboard/DepartmentDashboard";

// ====== ROUTE GUARDS ======

// Generic Private Route
const PrivateRoute = ({ children, allowedRoles = null }) => {
  const {
    currentUser,
    userData,
    isAdmin,
    isDepartment,
    isGovernorate,
    isMinistry,
    preventNavigation,
  } = useAuth();
  const location = useLocation();

  // If not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Wait until user data is loaded
  if (!userData) return null;

  // Block navigation during certain processes
  if (preventNavigation) return children;

  // Role restriction check
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Redirect based on role if logged in
const RoleRedirect = ({ children }) => {
  const { currentUser, userData, isAdmin } = useAuth();

  if (!currentUser) return children;
  if (!userData) return null;

  if (isAdmin) return <Navigate to="/admin" replace />;

  return children;
};

// Admin-only route
const AdminRoute = ({ children }) => {
  const { currentUser, userData, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!userData) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Department/Governorate/Ministry route
const DepartmentRoute = ({ children }) => {
  const { currentUser, isDepartment, isGovernorate, isMinistry, userData } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!userData) return null;
  return (isDepartment || isGovernorate || isMinistry) ? children : <Navigate to="/unauthorized" replace />;
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
        <Route path="/unauthorized" element={<Unauthorized />} />

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
            <PrivateRoute allowedRoles={["citizen"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaintHistory"
          element={
            <PrivateRoute allowedRoles={["citizen"]}>
              <ComplaintHistory />
            </PrivateRoute>
          }
        />

        {/* Department Layout Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["department", "moderator", "ministry"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaint-reports" element={<ComplaintReports />} />
        </Route>

        {/* Moderator Routes */}
        <Route
          path="/moderator"
          element={
            <PrivateRoute allowedRoles={["moderator"]}>
              <ModeratorLayout />
            </PrivateRoute>
          }
        >
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
