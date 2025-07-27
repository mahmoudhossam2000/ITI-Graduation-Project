import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../../Components/Navbar";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError("فشل إنشاء الحساب باستخدام جوجل. يرجى المحاولة مرة أخرى.");
      console.error("Google sign-up error:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }

    if (!formData.nationalId) {
      newErrors.nationalId = "الرقم القومي مطلوب";
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = "يجب أن يتكون الرقم القومي من 14 رقمًا";
    }

    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^01[0125]\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم هاتف غير صالح";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "nationalId" || name === "phone") &&
      value !== "" &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      toast.success(" تم انشاء الحساب بنجاح 🎉");
      navigate("/login");
    } catch (err) {
      toast.error("فشل إنشاء الحساب، حاول مرة أخرى.");
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      console.error("Signup error:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-darkTeal">
              إنشاء حساب جديد
            </h2>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-4" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  الاسم الكامل
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nationalId"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  الرقم القومي
                </label>
                <input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  maxLength="14"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.nationalId ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="الرقم القومي (14 رقم)"
                  value={formData.nationalId}
                  onChange={handleChange}
                />
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.nationalId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  maxLength="11"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="رقم الهاتف (11 رقم)"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  تأكيد كلمة المرور
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="تأكيد كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                إنشاء حساب
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignUp}
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FcGoogle className="w-5 h-5 ml-2" />
                  التسجيل باستخدام جوجل
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-700 text-md">لديك حساب بالفعل؟ </span>
            <Link
              to="/login"
              className="inline-block ml-2 ms-1 text-blue font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
