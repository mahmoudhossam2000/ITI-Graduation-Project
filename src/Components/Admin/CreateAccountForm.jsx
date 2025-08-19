import React, { useState } from "react";
import { FaPlus, FaBuilding, FaMapMarkerAlt, FaLandmark } from "react-icons/fa";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { departments, ministries, governorates } from "./constants";

const CreateAccountForm = ({
  onSubmit,
  isSubmitting = false,
  checkEmailExists,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("department");
  const [department, setDepartment] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [ministry, setMinistry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      accountType,
      department,
      governorate,
      ministry,
    };

    await onSubmit(formData);

    setEmail("");
    setPassword("");
    setDepartment("");
    setGovernorate("");
    setMinistry("");
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
    setDepartment("");
    setGovernorate("");
    setMinistry("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <FaPlus className="ml-2 text-blue-600" />
        إضافة حساب جديد
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل البريد الإلكتروني"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            يجب أن يكون البريد الإلكتروني فريداً وغير مستخدم في حسابات أخرى
          </p>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            placeholder="أدخل كلمة المرور"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع الحساب
          </label>
          <select
            value={accountType}
            onChange={handleAccountTypeChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="department">حساب إدارة</option>
            <option value="governorate">حساب محافظة</option>
            <option value="ministry">حساب وزارة</option>
          </select>
        </div>

        {accountType === "ministry" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaLandmark className="ml-1" />
              اسم الوزارة
            </label>
            <select
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">اختر الوزارة</option>
              {ministries.map((min) => (
                <option key={min} value={min}>
                  {min}
                </option>
              ))}
            </select>
          </div>
        ) : accountType === "department" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaBuilding className="ml-1" />
                اسم الإدارة
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">اختر الإدارة</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMapMarkerAlt className="ml-1" />
                  اسم المحافظة <span className="text-red-500">*</span>
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLandmark className="ml-1" />
                  الوزارة التابعة <span className="text-red-500">*</span>
                </label>
                <select
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر الوزارة</option>
                  {ministries.map((min) => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </select>
              </div>
              {department && governorate && ministry && (
                <div className="md:col-span-2">
                  <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <strong>تأكيد:</strong> سيتم إنشاء حساب {department} في{" "}
                    {governorate} التابعة لـ {ministry}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaMapMarkerAlt className="ml-1" />
              اسم المحافظة
            </label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue hover:bg-darkTeal text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              جاري الإنشاء...
            </>
          ) : (
            <>
              <FaPlus />
              <span>إنشاء حساب</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAccountForm;
