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
  where,
  getDoc,
  addDoc,
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
  FaLandmark,
  FaEdit,
  FaTimes,
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
  const [ministry, setMinistry] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update account state
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateDepartment, setUpdateDepartment] = useState("");
  const [updateGovernorate, setUpdateGovernorate] = useState("");
  const [updateMinistry, setUpdateMinistry] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateConfirmPassword, setUpdateConfirmPassword] = useState("");
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showUpdateConfirmPassword, setShowUpdateConfirmPassword] =
    useState(false);
  const [deletedAccounts, setDeletedAccounts] = useState([]);

  const {
    currentUser,
    userData,
    createDepartmentAccount,
    createMinistryAccount,
    createGovernorateAccount,
    updateDepartmentAccount,
    updateMinistryAccount,
    updateGovernorateAccount,
    updateDepartmentAccountPassword,
    updateMinistryAccountPassword,
    updateGovernorateAccountPassword,
  } = useAuth();

  const departments = [
    "إدارة الكهرباء والطاقة",
    "إدارة الغاز الطبيعي",
    "إدارة الطرق والكباري",
    "إدارة المرور",
    "إدارة النقل والمواصلات العامة",
    "مديرية الصحة",
    "إدارة البيئة ومكافحة التلوث",
    "مديرية التربية والتعليم",
    "إدارة الإسكان والمرافق",
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

  const ministries = [
    "وزارة الداخلية",
    "وزارة الدفاع",
    "وزارة الخارجية",
    "وزارة العدل",
    "وزارة المالية",
    "وزارة التخطيط والتنمية الاقتصادية",
    "وزارة التجارة والصناعة",
    "وزارة الاستثمار",
    "وزارة التعليم العالي والبحث العلمي",
    "وزارة التربية والتعليم",
    "وزارة الصحة والسكان",
    "وزارة الإسكان والمرافق والمجتمعات العمرانية",
    "وزارة النقل",
    "وزارة الطيران المدني",
    "وزارة الاتصالات وتكنولوجيا المعلومات",
    "وزارة الكهرباء والطاقة المتجددة",
    "وزارة البترول والثروة المعدنية",
    "وزارة الزراعة واستصلاح الأراضي",
    "وزارة الموارد المائية والري",
    "وزارة البيئة",
    "وزارة السياحة والآثار",
    "وزارة الثقافة",
    "وزارة الشباب والرياضة",
    "وزارة التضامن الاجتماعي",
    "وزارة القوى العاملة",
    "وزارة التموين والتجارة الداخلية",
    "وزارة التنمية المحلية",
    "وزارة الأوقاف",
    "وزارة الهجرة وشؤون المصريين بالخارج",
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
    fetchDeletedAccounts();
  }, []);

  const fetchDeletedAccounts = async () => {
    try {
      const deletedQuery = query(
        collection(db, "deletedAccounts"),
        orderBy("deletedAt", "desc")
      );
      const deletedSnapshot = await getDocs(deletedQuery);
      const deletedAccountsData = deletedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeletedAccounts(deletedAccountsData);
    } catch (error) {
      console.error("Error fetching deleted accounts:", error);
    }
  };

  const handleRestoreAccount = async (deletedAccount) => {
    if (!window.confirm("هل أنت متأكد من استعادة هذا الحساب؟")) {
      return;
    }

    try {
      setIsFetching(true);

      // Remove from deleted accounts collection
      await deleteDoc(doc(db, "deletedAccounts", deletedAccount.id));

      toast.success("تم استعادة الحساب بنجاح");
      toast.info("يمكن الآن إعادة إنشاء حساب بنفس البريد الإلكتروني");

      fetchDeletedAccounts();
    } catch (error) {
      console.error("Error restoring account:", error);
      toast.error("حدث خطأ أثناء استعادة الحساب");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setIsFetching(true);

      // Fetch department accounts
      const deptQuery = query(
        collection(db, "departmentAccounts"),
        orderBy("createdAt", "desc")
      );
      const deptSnapshot = await getDocs(deptQuery);
      const deptAccounts = deptSnapshot.docs.map((doc) => ({
        id: doc.id,
        collection: "departmentAccounts",
        ...doc.data(),
      }));

      // Fetch governorate accounts
      const governorateQuery = query(
        collection(db, "governorateAccounts"),
        orderBy("createdAt", "desc")
      );
      const governorateSnapshot = await getDocs(governorateQuery);
      const governorateAccounts = governorateSnapshot.docs.map((doc) => ({
        id: doc.id,
        collection: "governorateAccounts",
        ...doc.data(),
      }));

      // Fetch ministry accounts
      const ministryQuery = query(
        collection(db, "ministryAccounts"),
        orderBy("createdAt", "desc")
      );
      const ministrySnapshot = await getDocs(ministryQuery);
      const ministryAccounts = ministrySnapshot.docs.map((doc) => ({
        id: doc.id,
        collection: "ministryAccounts",
        ...doc.data(),
      }));

      // Combine and sort all accounts
      const allAccounts = [
        ...deptAccounts,
        ...governorateAccounts,
        ...ministryAccounts,
      ].sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return dateB - dateA;
      });

      setAccounts(allAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("حدث خطأ أثناء جلب الحسابات");
    } finally {
      setIsFetching(false);
    }
  };

  const checkEmailExists = async (email) => {
    try {
      // Check in department accounts
      const deptQuery = query(
        collection(db, "departmentAccounts"),
        where("email", "==", email)
      );
      const deptSnapshot = await getDocs(deptQuery);

      if (!deptSnapshot.empty) {
        return true;
      }

      // Check in governorate accounts
      const governorateQuery = query(
        collection(db, "governorateAccounts"),
        where("email", "==", email)
      );
      const governorateSnapshot = await getDocs(governorateQuery);

      if (!governorateSnapshot.empty) {
        return true;
      }

      // Check in ministry accounts
      const ministryQuery = query(
        collection(db, "ministryAccounts"),
        where("email", "==", email)
      );
      const ministrySnapshot = await getDocs(ministryQuery);

      if (!ministrySnapshot.empty) {
        return true;
      }

      // Check in regular users collection
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (!usersSnapshot.empty) {
        return true;
      }

      // Check in deleted accounts collection
      const deletedQuery = query(
        collection(db, "deletedAccounts"),
        where("email", "==", email)
      );
      const deletedSnapshot = await getDocs(deletedQuery);

      if (!deletedSnapshot.empty) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking email existence:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if admin is authenticated
    if (!currentUser) {
      toast.error("يجب تسجيل الدخول كمدير أولاً");
      return;
    }

    // Check if user is actually an admin
    if (userData?.role !== "admin") {
      toast.error("يجب تسجيل الدخول كمدير للوصول لهذه الصفحة");
      return;
    }

    if (accountType === "ministry") {
      if (!email || !password || !ministry) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }
    } else if (accountType === "department") {
      if (!email || !password || !department || !governorate || !ministry) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }
    } else if (accountType === "governorate") {
      if (!email || !password || !governorate) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }
    }

    // Check if email already exists in any collection
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
        return;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("حدث خطأ أثناء التحقق من البريد الإلكتروني");
      return;
    }

    try {
      setIsSubmitting(true);

      if (accountType === "ministry") {
        await createMinistryAccount(email, password, ministry);
        toast.success("تم إنشاء حساب الوزارة بنجاح!");
        setEmail("");
        setPassword("");
        setMinistry("");
      } else if (accountType === "governorate") {
        await createGovernorateAccount(email, password, governorate);
        toast.success("تم إنشاء حساب المحافظة بنجاح!");
        setEmail("");
        setPassword("");
        setGovernorate("");
      } else {
        await createDepartmentAccount(
          email,
          password,
          accountType,
          department,
          governorate,
          ministry
        );
        toast.success("تم إنشاء الحساب بنجاح!");
        setEmail("");
        setPassword("");
        setDepartment("");
        setGovernorate("");
        setMinistry("");
      }

      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
      } else {
        toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (docId, uid, collectionName) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذا الحساب؟ هذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      return;
    }

    try {
      setIsFetching(true);

      // Get the account data before deleting
      const accountDoc = await getDoc(doc(db, collectionName, docId));
      const accountData = accountDoc.data();

      // Delete the Firestore document
      await deleteDoc(doc(db, collectionName, docId));

      // Add to deleted accounts collection to prevent recreation with same email
      await addDoc(collection(db, "deletedAccounts"), {
        email: accountData.email,
        uid: accountData.uid,
        originalCollection: collectionName,
        deletedAt: serverTimestamp(),
        deletedBy: currentUser.uid,
        accountType: accountData.role || accountData.accountType,
      });

      toast.success("تم حذف الحساب بنجاح");
      toast.info("ملاحظة: لن يمكن إعادة إنشاء حساب بنفس البريد الإلكتروني");

      fetchAccounts();
      fetchDeletedAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("حدث خطأ أثناء حذف الحساب");
    } finally {
      setIsFetching(false);
    }
  };

  const handleToggleBan = async (docId, uid, isBanned, collectionName) => {
    try {
      setIsFetching(true);
      await updateDoc(doc(db, collectionName, docId), {
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

  const handleEdit = (account) => {
    setEditingAccount(account);
    setUpdateEmail(account.email);
    setUpdateDepartment(account.department || "");
    setUpdateGovernorate(account.governorate || "");
    setUpdateMinistry(account.ministry || "");
    setUpdatePassword("");
    setUpdateConfirmPassword("");
    setShowUpdatePassword(false);
    setShowUpdateConfirmPassword(false);
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setUpdateEmail("");
    setUpdateDepartment("");
    setUpdateGovernorate("");
    setUpdateMinistry("");
    setUpdatePassword("");
    setUpdateConfirmPassword("");
    setShowUpdatePassword(false);
    setShowUpdateConfirmPassword(false);
  };

  const handleUpdate = async () => {
    if (!editingAccount) return;

    // Check if admin is authenticated
    if (!currentUser) {
      toast.error("يجب تسجيل الدخول كمدير أولاً");
      return;
    }

    // Check if user is actually an admin
    if (userData?.role !== "admin") {
      toast.error("يجب تسجيل الدخول كمدير للوصول لهذه الصفحة");
      return;
    }

    try {
      setIsUpdating(true);

      // Check if the new email already exists in other accounts (excluding current account)
      if (updateEmail !== editingAccount.email) {
        const emailExists = await checkEmailExists(updateEmail);
        if (emailExists) {
          toast.error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
          return;
        }
      }

      // Validate password if provided
      if (updatePassword) {
        if (updatePassword.length < 6) {
          toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return;
        }
        if (updatePassword !== updateConfirmPassword) {
          toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
          return;
        }
      }

      const updates = {
        email: updateEmail,
      };

      if (editingAccount.role === "department") {
        if (!updateDepartment || !updateGovernorate) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.department = updateDepartment;
        updates.governorate = updateGovernorate;
      } else if (editingAccount.role === "governorate") {
        if (!updateGovernorate) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.governorate = updateGovernorate;
      } else if (editingAccount.role === "ministry") {
        if (!updateMinistry) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.ministry = updateMinistry;
      }

      // Update account details
      if (editingAccount.collection === "ministryAccounts") {
        await updateMinistryAccount(editingAccount.id, updates);
      } else if (editingAccount.collection === "governorateAccounts") {
        await updateGovernorateAccount(editingAccount.id, updates);
      } else {
        await updateDepartmentAccount(editingAccount.id, updates);
      }

      // Update password if provided
      if (updatePassword) {
        if (editingAccount.collection === "ministryAccounts") {
          await updateMinistryAccountPassword(
            editingAccount.uid,
            updatePassword
          );
        } else if (editingAccount.collection === "governorateAccounts") {
          await updateGovernorateAccountPassword(
            editingAccount.uid,
            updatePassword
          );
        } else {
          await updateDepartmentAccountPassword(
            editingAccount.uid,
            updatePassword
          );
        }
        toast.success("تم تحديث الحساب وكلمة المرور بنجاح");
      } else {
        toast.success("تم تحديث الحساب بنجاح");
      }

      handleCancelEdit();
      fetchAccounts();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("حدث خطأ أثناء تحديث الحساب");
    } finally {
      setIsUpdating(false);
    }
  };

  const [activeTab, setActiveTab] = useState("create");

  // Separate accounts by type
  const departmentAccounts = accounts.filter(
    (account) => account.collection === "departmentAccounts"
  );
  const governorateAccounts = accounts.filter(
    (account) => account.collection === "governorateAccounts"
  );
  const ministryAccounts = accounts.filter(
    (account) => account.collection === "ministryAccounts"
  );

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
            onChange={(e) => {
              setAccountType(e.target.value);
              setDepartment("");
              setGovernorate("");
              setMinistry("");
            }}
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

  const DepartmentAccountsList = (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaBuilding className="ml-2 text-blue-600" />
          حسابات الإدارات
        </h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات:{" "}
          <span className="font-medium">{departmentAccounts.length}</span>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : departmentAccounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">
            <FaBuilding className="mx-auto h-12 w-12" />
          </div>
          <p className="text-gray-500">لا توجد حسابات إدارات مسجلة</p>
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
                  اسم الإدارة
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
              {departmentAccounts.map((account) => (
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
                      <FaBuilding className="ml-2 text-blue-500" />
                      <span>إدارة</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.department}
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
                        onClick={() => handleEdit(account)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleBan(
                            account.id,
                            account.uid,
                            !account.banned,
                            account.collection
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
                        onClick={() =>
                          handleDelete(
                            account.id,
                            account.uid,
                            account.collection
                          )
                        }
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

      {/* Update Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                تعديل الحساب
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
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
                  onClick={handleCancelEdit}
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
      )}

      {/* Update Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                تعديل الحساب
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
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
                  onClick={handleCancelEdit}
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
      )}
    </div>
  );

  const GovernorateAccountsList = (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaMapMarkerAlt className="ml-2 text-green-600" />
          حسابات المحافظات
        </h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات:{" "}
          <span className="font-medium">{governorateAccounts.length}</span>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : governorateAccounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">
            <FaMapMarkerAlt className="mx-auto h-12 w-12" />
          </div>
          <p className="text-gray-500">لا توجد حسابات محافظات مسجلة</p>
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
                  اسم المحافظة
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
              {governorateAccounts.map((account) => (
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
                      <FaMapMarkerAlt className="ml-2 text-green-500" />
                      <span>محافظة</span>
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
                        onClick={() => handleEdit(account)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleBan(
                            account.id,
                            account.uid,
                            !account.banned,
                            account.collection
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
                        onClick={() =>
                          handleDelete(
                            account.id,
                            account.uid,
                            account.collection
                          )
                        }
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

      {/* Update Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                تعديل الحساب
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
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
                  onClick={handleCancelEdit}
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
      )}
    </div>
  );

  const MinistryAccountsList = (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaLandmark className="ml-2 text-purple-600" />
          حسابات الوزارات
        </h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات:{" "}
          <span className="font-medium">{ministryAccounts.length}</span>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : ministryAccounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">
            <FaLandmark className="mx-auto h-12 w-12" />
          </div>
          <p className="text-gray-500">لا توجد حسابات وزارات مسجلة</p>
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
                  اسم الوزارة
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
              {ministryAccounts.map((account) => (
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
                      <FaLandmark className="ml-2 text-purple-500" />
                      <span>وزارة</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.ministry}
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
                        onClick={() => handleEdit(account)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleBan(
                            account.id,
                            account.uid,
                            !account.banned,
                            account.collection
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
                        onClick={() =>
                          handleDelete(
                            account.id,
                            account.uid,
                            account.collection
                          )
                        }
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

      {/* Update Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                تعديل الحساب
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
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
                  onClick={handleCancelEdit}
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
      )}
    </div>
  );

  // Deleted Accounts List Component
  const DeletedAccountsList = (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الحسابات المحذوفة</h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات المحذوفة: {deletedAccounts.length}
        </div>
      </div>

      {isFetching ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      ) : deletedAccounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد حسابات محذوفة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  البريد الإلكتروني
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  نوع الحساب
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  تاريخ الحذف
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deletedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {account.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {account.accountType === "department" && "إدارة"}
                      {account.accountType === "governorate" && "محافظة"}
                      {account.accountType === "ministry" && "وزارة"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {account.deletedAt?.toDate
                      ? account.deletedAt.toDate().toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    <button
                      onClick={() => handleRestoreAccount(account)}
                      className="text-green-600 hover:text-green-900 font-medium"
                      title="استعادة الحساب"
                    >
                      استعادة
                    </button>
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
            {activeTab === "create" && CreateAccountForm}
            {activeTab === "departmentAccounts" && DepartmentAccountsList}
            {activeTab === "governorateAccounts" && GovernorateAccountsList}
            {activeTab === "ministryAccounts" && MinistryAccountsList}
            {activeTab === "deletedAccounts" && DeletedAccountsList}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
