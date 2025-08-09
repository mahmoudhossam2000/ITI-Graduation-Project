import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

const Topbar = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      // Silently fail; toast system is used elsewhere
      // eslint-disable-next-line no-console
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <img src={logo} alt="Site Logo" className="h-auto w-20" />
        </Link>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* {currentUser?.email && (
            <span className="hidden sm:inline-block text-sm text-gray-600">
              {currentUser.email}
            </span>
          )} */}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
