import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("❌ الرجاء إدخال بريد إلكتروني صالح");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("❌ حدث خطأ، تأكد من صحة البريد الإلكتروني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg space-y-6">
        <h2 className="text-center text-xl font-bold">نسيت كلمة المرور</h2>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-blue focus:border-blue bg-background"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded ${
              loading ? "bg-gray-400" : "bg-blue hover:bg-darkTeal"
            }`}
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
