import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../Components/Navbar";
import { auth } from "../firebase/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isGoogleUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  // change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("يرجى إدخال كلمة المرور الحالية والجديدة");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("تم تغيير كلمة المرور بنجاح 🎉");
      setIsModalOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.log("حدث خطأ أثناء تغيير كلمة المرور:", error);

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("كلمة المرور الحالية غير صحيحة");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("تأكد من الاتصال بالإنترنت");
      } else {
        toast.error("حدث خطأ أثناء تغيير كلمة المرور");
      }
    } finally {
      setLoading(false);
    }
  };

  // delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (isGoogleUser) {
      try {
        await deleteUser(auth.currentUser);
        toast.success("تم حذف الحساب بنجاح 🎉");
        navigate("/login");
      } catch (error) {
        console.log("حدث خطأ أثناء حذف الحساب:", error);
        toast.error("حدث خطأ أثناء حذف الحساب");
      }
      return;
    }

    if (!deletePassword) {
      toast.error("يرجى إدخال كلمة المرور الحالية");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        deletePassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      toast.success("تم حذف الحساب بنجاح 🎉");
      navigate("/login");
    } catch (error) {
      console.log("حدث خطأ أثناء حذف الحساب:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("كلمة المرور الحالية غير صحيحة");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("تأكد من الاتصال بالإنترنت");
      } else {
        toast.error("حدث خطأ أثناء حذف الحساب");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            الملف الشخصي
          </h1>

          <div className="space-y-8">
            {/* معلومات الحساب */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-darkTeal mb-4 text-right">
                معلومات الحساب
              </h2>

              <div className="space-y-4 text-right">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                  <p className="text-base font-medium text-gray-600">
                    البريد الإلكتروني
                  </p>
                  <p className="text-base font-medium text-sky-950 mt-2 sm:mt-0">
                    {currentUser?.email}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <p className="text-base font-medium text-gray-600">
                    حالة الحساب
                  </p>
                  <span className="mt-2 sm:mt-0 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-200 text-green-700">
                    مفعل
                  </span>
                </div>
              </div>
            </div>

            {/* الإعدادات */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-darkTeal mb-4 text-right">
                الإعدادات
              </h2>

              {isGoogleUser && (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-right text-sm mb-4">
                  أنت مسجل بحساب Google. لإدارة كلمة المرور، يرجى التوجه إلى{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold"
                  >
                    إعدادات حساب Google
                  </a>
                  .
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {!isGoogleUser && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-background hover:bg-blue-700 border border-[#ccc] text-blue font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    تغيير كلمة المرور
                  </button>
                )}

                <button
                  onClick={() => setIsDeleteModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal change password */}
      {isModalOpen && !isGoogleUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
            <h2 className="text-center text-2xl font-bold mb-6">
              تغيير كلمة المرور
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label
                  htmlFor="oldPass"
                  className="block text-right text-sm font-medium text-gray-700 mb-1"
                >
                  كلمة المرور الحالية
                </label>
                <input
                  id="oldPass"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="newPass"
                  className="block text-right text-sm font-medium text-gray-700 mb-1"
                >
                  كلمة المرور الجديدة
                </label>
                <input
                  id="newPass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-blue font-medium py-2 rounded-lg transition"
                >
                  {loading ? "جاري التغيير..." : "تغيير"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal delete Account */}
      {isDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
            <h2 className="text-center text-2xl font-bold mb-6 text-red-600">
              تأكيد حذف الحساب
            </h2>

            <div className="bg-red-100 text-red-800 p-3 rounded-md text-right text-sm leading-relaxed">
              <span className="font-bold underline">تنبيه:</span> بحذف الحساب،
              ستفقد جميع بياناتك نهائيًا ولن تتمكن من استعادتها. هل أنت متأكد
              أنك تريد متابعة عملية الحذف؟
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-5">
              {!isGoogleUser && (
                <div className="mt-6">
                  <label
                    htmlFor="deletePass"
                    className="block text-right text-sm font-medium text-gray-700 mb-1"
                  >
                    أدخل كلمة المرور الحالية للتأكيد
                  </label>
                  <input
                    id="deletePass"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="كلمة المرور الحالية"
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                </div>
              )}
              <div className="flex justify-between gap-3 pt-3">
                <button
                  type="button"
                  className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
                  onClick={() => setIsDeleteModal(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
                >
                  {loading ? "جاري الحذف..." : "حذف"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
