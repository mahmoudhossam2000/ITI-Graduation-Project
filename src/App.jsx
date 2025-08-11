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
import Layout from "./Components/features/authority_Dashboard/Layout";
import Dashboard from "./Pages/Dashboard";
import Complaints from "./Pages/Complaints";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ComplaintHistory from "./Components/ComplaintHistory";
import NotFound from "./Pages/NotFound";
import ComplaintReports from "./Pages/ComplaintReports";
import Unauthorized from "./Pages/Unauthorized";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userData || !userData.role) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
  // return currentUser ? children : <Navigate to="/login" />;
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
        <Route index element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/submitComplaint" element={<ComplaintForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/traceComplaint" element={<ComplaintSearch />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
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
