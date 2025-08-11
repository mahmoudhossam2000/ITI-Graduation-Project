import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../../Components/Navbar";
import { toast } from "react-toastify";

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

      // احضار عدد الشكاوى لهذا اليوزر (لو فيه)
      const complaintsSnap = await getDocs(collection(db, "complaints"));
      const userComplaints = complaintsSnap.docs.filter(
        (doc) => doc.data().userId === user.uid
      );
      const complaintCount = userComplaints.length;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        complaintCount,
        banned: false,
        createdAt: new Date(),
      });

      toast.success("تم إنشاء الحساب بنجاح 🎉");

      // تسجيل خروج المستخدم بعد التسجيل
      await signOut(auth);

      // إعادة توجيه المستخدم لصفحة تسجيل الدخول
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      toast.error("فشل إنشاء الحساب، حاول مرة أخرى.");
    }
  };

  return (
    <>
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
            {[
              { name: "name", label: "الاسم الكامل", type: "text" },
              {
                name: "phone",
                label: "رقم الهاتف",
                type: "text",
                maxLength: 11,
              },
              { name: "email", label: "البريد الإلكتروني", type: "email" },
              { name: "password", label: "كلمة المرور", type: "password" },
              {
                name: "confirmPassword",
                label: "تأكيد كلمة المرور",
                type: "password",
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1 text-right"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  maxLength={field.maxLength}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors[field.name] ? "border-red-300" : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
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
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FcGoogle className="w-5 h-5 ml-2" />
              التسجيل باستخدام جوجل
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-700 text-md">لديك حساب بالفعل؟ </span>
            <Link
              to="/login"
              className="inline-block ml-2 ms-1 text-blue font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
