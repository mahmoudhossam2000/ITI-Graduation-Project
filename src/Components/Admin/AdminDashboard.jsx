import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import Topbar from "../Topbar";
import SidebarAdmin from "./SidebarAdmin";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import {
  FaTrash,
  FaBan,
  FaCheck,
  FaPlus,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("department");
  const [department, setDepartment] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, createDepartmentAccount } = useAuth();

  const departments = [
    "إدارة الكهرباء والطاقة",
    "إدارة الغاز الطبيعي",
    "إدارة الطرق والكباري",
    "إدارة المرور",
    "إدارة النقل والمواصلات العامة",
    "مديرية الصحة",
    "إدارة البيئة ومكافحة التلوث",
    "مديرية التربية والتعليم",
    "مديرية الإسكان والمرافق",
    "إدارة التخطيط العمراني",
    "إدارة الأراضي وأملاك الدولة",
    "مديرية الأمن",
    "إدارة الدفاع المدني والحريق",
    "إدارة التموين والتجارة الداخلية",
    "إدارة حماية المستهلك",
    "إدارة الزراعة",
    "إدارة الري والموارد المائية",
    "إدارة الشباب والرياضة",
    "إدارة الثقافة",
    "إدارة السياحة والآثار",
  ];

  const governorates = [
    "القاهرة",
    "الإسكندرية",
    "بورسعيد",
    "السويس",
    "دمياط",
    "الدقهلية",
    "الشرقية",
    "القليوبية",
    "كفر الشيخ",
    "الغربية",
    "المنوفية",
    "البحيرة",
    "الإسماعيلية",
    "الجيزة",
    "بني سويف",
    "الفيوم",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "أسوان",
    "الأقصر",
    "البحر الأحمر",
    "الوادي الجديد",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsFetching(true);
      const q = query(
        collection(db, "departmentAccounts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const accountsList = [];

      querySnapshot.forEach((doc) => {
        accountsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setAccounts(accountsList);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("حدث خطأ أثناء جلب الحسابات");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !email ||
      !password ||
      (accountType === "department" && !department) ||
      (accountType === "department" && !governorate)
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSubmitting(true);
      await createDepartmentAccount(
        email,
        password,
        accountType,
        department,
        governorate
      );
      toast.success("تم إنشاء الحساب بنجاح");
      setEmail("");
      setPassword("");
      setDepartment("");
      setGovernorate("");
      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (docId, uid) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذا الحساب؟ هذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      return;
    }

    try {
      setIsFetching(true);
      await deleteDoc(doc(db, "departmentAccounts", docId));
      const user = auth.currentUser;
      if (user && user.uid === currentUser.uid) {
        toast.warning("لا يمكن حذف الحساب المسجل به حالياً");
      } else {
        try {
          await deleteUser(await auth.getUser(uid));
        } catch (error) {
          console.error("Error deleting auth user:", error);
        }
      }

      toast.success("تم حذف الحساب بنجاح");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("حدث خطأ أثناء حذف الحساب");
    } finally {
      setIsFetching(false);
    }
  };

  const handleToggleBan = async (docId, uid, isBanned) => {
    try {
      setIsFetching(true);
      await updateDoc(doc(db, "departmentAccounts", docId), {
        banned: isBanned,
        updatedAt: serverTimestamp(),
      });

      toast.success(isBanned ? "تم حظر الحساب بنجاح" : "تم تفعيل الحساب بنجاح");
      fetchAccounts();
    } catch (error) {
      console.error("Error toggling ban status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الحساب");
    } finally {
      setIsFetching(false);
    }
  };

  const [activeTab, setActiveTab] = useState("create");

  const CreateAccountForm = (
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
            onChange={(e) => {
              setAccountType(e.target.value);
              setDepartment("");
              setGovernorate("");
            }}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="department">حساب إدارة</option>
            <option value="governorate">حساب محافظة</option>
          </select>
        </div>
        {accountType === "department" ? (
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
              {department && governorate && (
                <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                  <strong>تأكيد:</strong> سيتم إنشاء حساب {department} في{" "}
                  {governorate} فقط
                </p>
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

  const AccountsList = (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          حسابات الادارات والمحافظات المسجلة{" "}
        </h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات:{" "}
          <span className="font-medium">{accounts.length}</span>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-gray-500">لا توجد حسابات مسجلة بعد</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحساب
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  النوع
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الاسم
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المحافظة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  className={account.banned ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {account.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {account.createdAt?.toDate
                        ? new Date(
                            account.createdAt.toDate()
                          ).toLocaleDateString("ar-EG")
                        : "غير معروف"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {account.accountType === "department" ? (
                        <>
                          <FaBuilding className="ml-2 text-blue-500" />
                          <span>إدارة</span>
                        </>
                      ) : (
                        <>
                          <FaMapMarkerAlt className="ml-2 text-green-500" />
                          <span>محافظة</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.department || account.governorate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.governorate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {account.banned ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        محظور
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        نشط
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() =>
                          handleToggleBan(
                            account.id,
                            account.uid,
                            !account.banned
                          )
                        }
                        className={`p-2 rounded-md ${
                          account.banned
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        } transition-colors`}
                        title={account.banned ? "فك الحظر" : "حظر"}
                      >
                        {account.banned ? <FaCheck /> : <FaBan />}
                      </button>
                      <button
                        onClick={() => handleDelete(account.id, account.uid)}
                        className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w mx-auto p-4 min-h-screen">
        <div className="flex items-stretch">
          <SidebarAdmin
            activeTab={activeTab}
            onSelect={setActiveTab}
            email={currentUser?.email}
          />

          <main className="flex-1 lg:ml-6 mt-6 lg:mt-0">
            {activeTab === "create" ? CreateAccountForm : AccountsList}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
