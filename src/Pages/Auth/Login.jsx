import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { BiShowAlt, BiSolidHide } from "react-icons/bi";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const navigate = useNavigate();
  const {
    signInWithGoogle,
    loginWithEmail,
    userData,
    currentUser,
    setCurrentUser,
  } = useAuth();

  // Google Login
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("تم تسجيل الدخول باستخدام جوجل 🎉");
      navigate("/");
    } catch (error) {
      setError("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
      toast.error("فشل تسجيل الدخول باستخدام جوجل ❌");
      console.error("Google sign-in error:", error);
    }
  };

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setHasAttemptedLogin(true);
    // setCurrentUser(null);

    try {
      await loginWithEmail(email, password);
      toast.success("تم تسجيل الدخول بنجاح 🎉");
      navigate("/");
    } catch (err) {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة ❌");
      setError("فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-darkTeal">تسجيل الدخول</h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right"
                >
                  البريد الإلكتروني
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    className="absolute left-3 top-1/4 transform text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <BiShowAlt size={20} /> : <BiSolidHide size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-blue"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5 ml-2" />
                تسجيل الدخول باستخدام جوجل
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-700 text-md">
              ليس لديك حساب؟
              <Link
                to="/signup"
                className="ml-1 text-blue font-semibold hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
