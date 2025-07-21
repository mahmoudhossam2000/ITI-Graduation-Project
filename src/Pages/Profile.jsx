import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-right">
            الملف الشخصي
          </h1>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4 text-right">
                معلومات الحساب
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                  <div className="text-right w-full sm:w-1/3">
                    <p className="text-sm font-medium text-gray-500">
                      البريد الإلكتروني
                    </p>
                  </div>
                  <div className="mt-1 sm:mt-0 w-full sm:w-2/3">
                    <p className="text-sm text-gray-900 text-right">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-right w-full sm:w-1/3">
                    <p className="text-sm font-medium text-gray-500">
                      حالة الحساب
                    </p>
                  </div>
                  <div className="mt-1 sm:mt-0 w-full sm:w-2/3">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      مفعل
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4 text-right">
                الإعدادات
              </h2>

              <div className="space-y-4">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-blue font-medium py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 m-5">
                  تغيير كلمة المرور
                </button>

                <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
