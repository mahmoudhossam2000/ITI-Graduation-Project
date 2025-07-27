import React, { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error(" كلمة المرور يجب أن تكون على الأقل 6 أحرف ❌");
      return;
    }

    if (!oobCode) {
      toast.error("الرابط غير صالح أو انتهت صلاحيته ❌ ");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("تم تغيير كلمة المرور بنجاح 🎉");
      navigate("/login");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("حدث خطأ أثناء تغيير كلمة المرور ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md space-y-6">
        <h2 className="text-center text-xl font-bold">تعيين كلمة مرور جديدة</h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="كلمة مرور جديدة (6 أحرف على الأقل)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:ring-blue focus:border-blue bg-background"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded ${
              loading ? "bg-gray-400" : "bg-blue hover:bg-darkTeal"
            }`}
          >
            {loading ? "جاري التعيين..." : "تغيير كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
