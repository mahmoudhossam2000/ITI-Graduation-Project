import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import Navbar from "../../Components/Navbar";
import { BiShowAlt } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      const user = await signInWithGoogle();
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName || "مستخدم جوجل",
        email: user.email,
        phone: "",
        complaintCount: 0,
        banned: false,
        role: "user",
        createdAt: new Date(),
      });

      toast.success("تم إنشاء الحساب باستخدام جوجل بنجاح");
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

    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // update displayName in Firebase Auth
      await updateProfile(user, {
        displayName: formData.name,
      });

      // fetch all complaints related user
      const complaintsSnap = await getDocs(collection(db, "complaints"));
      const userComplaints = complaintsSnap.docs.filter(
        (doc) => doc.data().userId === user.uid
      );
      const complaintCount = userComplaints.length;

      // store userData in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        complaintCount,
        banned: false,
        role: "user",
        createdAt: new Date(),
      });

      toast.success("تم إنشاء الحساب بنجاح 🎉");

      // logout after signup(علشان اجبره يوديني للوجن الاول)
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      toast.error("فشل إنشاء الحساب، حاول مرة أخرى.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-darkTeal">
            إنشاء حساب جديد
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSignup}>
            {/* Name */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
                htmlFor="name">
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder=" ادخل الاسم بالكامل"
                value={formData.name}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
                htmlFor="phone">
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="ادخل رقم الهاتف"
                maxLength={11}
                value={formData.phone}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
                htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ادخل بريدك الالكتروني"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
                htmlFor="password">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="absolute left-3 top-1/2 transform  text-gray-400 hover:text-gray-600"
                tabIndex={-1}>
                {showPassword ? <BiShowAlt size={20}/> : <BiSolidHide size={20}/>}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
                htmlFor="confirmPassword">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="أعد إدخال كلمة المرور"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((show) => !show)}
                className="absolute left-3 top-1/2 transform text-gray-400 hover:text-gray-600"
                tabIndex={-1}>
                {showConfirmPassword ? <BiShowAlt size={20}/> : <BiSolidHide size={20}/>}

              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              إنشاء حساب
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FcGoogle className="w-5 h-5 ml-2" />
              التسجيل باستخدام جوجل
            </button>
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
