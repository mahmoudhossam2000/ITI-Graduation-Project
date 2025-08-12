import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import Unauthorized from "./Pages/Unauthorized";
import ModeratorLayout from "./Components/Moderator/ModeratorLayout";
import DashboardModerator from "./Pages/DashboardModerator";
import ComplaintsPage from "./Components/Moderator/ComplaintsTable";
import UsersPage from "./Components/Moderator/UsersTable";

import AdminDashboard from "./Components/Admin/AdminDashboard";
import DepartmentDashboard from "./Components/Dashboard/DepartmentDashboard";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

const PrivateRoute = ({ children, allowedRoles = null }) => {
  const {
    currentUser,
    isAdmin,
    isDepartment,
    isGovernorate,
    isMinistry,
    userData,
    preventNavigation,
  } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute Debug:", {
    currentUser: currentUser?.uid,
    userData,
    allowedRoles,
    isAdmin,
    isDepartment,
    isGovernorate,
    isMinistry,
    preventNavigation,
  });

  // If not logged in, redirect to login
  if (!currentUser) {
    console.log("No current user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but userData hasn't loaded yet, show loading or return null
  if (!userData) {
    console.log("No userData yet, showing loading");
    return null; // or a loading spinner
  }

  // If navigation is prevented (e.g., during account creation), don't redirect
  if (preventNavigation) {
    console.log("Navigation prevented, showing children");
    return children;
  }

  // If specific roles are required, check if user has access
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    console.log("=== ROLE CHECK FAILED ===");
    console.log("Allowed roles:", allowedRoles);
    console.log("User role:", userData.role);
    console.log("User data:", userData);
    console.log("Role check result:", !allowedRoles.includes(userData.role));
    console.log("Redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect to appropriate dashboard based on user role (only if no specific roles required)
  if (!allowedRoles) {
    if (isAdmin) {
      console.log("User is admin, redirecting to admin dashboard");
      return <Navigate to="/admin" replace />;
    }

    if (isDepartment || isGovernorate) {
      console.log(
        "User is department/governorate, redirecting to department dashboard"
      );
      return <Navigate to="/department/dashboard" replace />;
    }
  }

  // If regular user or authorized role, show the protected content
  console.log("User authorized, showing protected content");
  return children;
};

const RoleRedirect = ({ children }) => {
  const {
    currentUser,
    userData,
    isAdmin,
    isDepartment,
    isGovernorate,
    preventNavigation,
  } = useAuth();

  // If not logged in, show the public page
  if (!currentUser) {
    return children;
  }

  // Wait until userData resolves
  if (!userData) {
    return null; // or a loading spinner
  }

  // If navigation is prevented (e.g., during account creation), don't redirect
  if (preventNavigation) {
    return children;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Don't redirect department/governorate/ministry users - let them access the landing page
  // They can navigate to their dashboard when needed
  console.log(
    "User is department/governorate/ministry, allowing access to landing page"
  );
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, userData } = useAuth();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user data is still loading
  if (!userData) {
    return null; // or a loading spinner
  }

  // If user is not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the children
  return children;
};

const DepartmentRoute = ({ children }) => {
  const { currentUser, isDepartment, isGovernorate, isMinistry, userData } =
    useAuth();

  console.log("DepartmentRoute Debug:", {
    currentUser: currentUser?.uid,
    userData: userData?.role,
    isDepartment,
    isGovernorate,
    isMinistry,
    hasAccess: currentUser && (isDepartment || isGovernorate || isMinistry),
  });

  return currentUser && (isDepartment || isGovernorate || isMinistry) ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

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
        {/* general page */}
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

        {/* Department/Governorate Auth */}
        <Route path="/login" element={<Login />} />

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

        <Route path="*" element={<NotFound />} />

        {/* citizen profile */}
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
        {/* department routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["department", "moderator"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaint-reports" element={<ComplaintReports />} />
        </Route>

        {/* moderator routes*/}
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
      </Routes>
    </>
  );
}

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
