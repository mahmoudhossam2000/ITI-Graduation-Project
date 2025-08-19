import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { departments, ministries, governorates } from "./constants";

const EditAccountModal = ({ 
  editingAccount, 
  onClose, 
  onUpdate, 
  isUpdating = false 
}) => {
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateDepartment, setUpdateDepartment] = useState("");
  const [updateGovernorate, setUpdateGovernorate] = useState("");
  const [updateMinistry, setUpdateMinistry] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateConfirmPassword, setUpdateConfirmPassword] = useState("");
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showUpdateConfirmPassword, setShowUpdateConfirmPassword] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      setUpdateEmail(editingAccount.email);
      setUpdateDepartment(editingAccount.department || "");
      setUpdateGovernorate(editingAccount.governorate || "");
      setUpdateMinistry(editingAccount.ministry || "");
      setUpdatePassword("");
      setUpdateConfirmPassword("");
      setShowUpdatePassword(false);
      setShowUpdateConfirmPassword(false);
    }
  }, [editingAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = {
      email: updateEmail,
      department: updateDepartment,
      governorate: updateGovernorate,
      ministry: updateMinistry,
      password: updatePassword,
      confirmPassword: updateConfirmPassword
    };

    await onUpdate(updateData);
  };

  const handleClose = () => {
    setUpdateEmail("");
    setUpdateDepartment("");
    setUpdateGovernorate("");
    setUpdateMinistry("");
    setUpdatePassword("");
    setUpdateConfirmPassword("");
    setShowUpdatePassword(false);
    setShowUpdateConfirmPassword(false);
    onClose();
  };

  if (!editingAccount) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            تعديل الحساب
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور الجديدة (اختياري)
            </label>
            <input
              type={showUpdatePassword ? "text" : "password"}
              value={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="اتركها فارغة إذا لم ترد تغيير كلمة المرور"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowUpdatePassword(!showUpdatePassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
            >
              {showUpdatePassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {updatePassword && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type={showUpdateConfirmPassword ? "text" : "password"}
                value={updateConfirmPassword}
                onChange={(e) => setUpdateConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required={!!updatePassword}
                minLength={6}
              />
              <button
                type="button"
                onClick={() =>
                  setShowUpdateConfirmPassword(!showUpdateConfirmPassword)
                }
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
              >
                {showUpdateConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          )}

          {editingAccount.role === "ministry" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الوزارة
              </label>
              <select
                value={updateMinistry}
                onChange={(e) => setUpdateMinistry(e.target.value)}
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
          ) : editingAccount.role === "department" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الإدارة
                </label>
                <select
                  value={updateDepartment}
                  onChange={(e) => setUpdateDepartment(e.target.value)}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المحافظة
                </label>
                <select
                  value={updateGovernorate}
                  onChange={(e) => setUpdateGovernorate(e.target.value)}
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
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المحافظة
              </label>
              <select
                value={updateGovernorate}
                onChange={(e) => setUpdateGovernorate(e.target.value)}
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

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdating ? "جاري التحديث..." : "تحديث"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;
