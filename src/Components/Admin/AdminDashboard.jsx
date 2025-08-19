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
import CreateAccountForm from "./CreateAccountForm";
import AccountsTable from "./AccountsTable";
import EditAccountModal from "./EditAccountModal";
import DeletedAccountsList from "./DeletedAccountsList";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletedAccounts, setDeletedAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("create");

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
      const deptQuery = query(
        collection(db, "departmentAccounts"),
        where("email", "==", email)
      );
      const deptSnapshot = await getDocs(deptQuery);

      if (!deptSnapshot.empty) {
        return true;
      }

      const governorateQuery = query(
        collection(db, "governorateAccounts"),
        where("email", "==", email)
      );
      const governorateSnapshot = await getDocs(governorateQuery);

      if (!governorateSnapshot.empty) {
        return true;
      }

      const ministryQuery = query(
        collection(db, "ministryAccounts"),
        where("email", "==", email)
      );
      const ministrySnapshot = await getDocs(ministryQuery);

      if (!ministrySnapshot.empty) {
        return true;
      }

      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (!usersSnapshot.empty) {
        return true;
      }

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

  const handleCreateAccount = async (formData) => {
    const { email, password, accountType, department, governorate, ministry } =
      formData;

    if (!currentUser) {
      toast.error("يجب تسجيل الدخول كمدير أولاً");
      return;
    }

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
      } else if (accountType === "governorate") {
        await createGovernorateAccount(email, password, governorate);
        toast.success("تم إنشاء حساب المحافظة بنجاح!");
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

      const accountDoc = await getDoc(doc(db, collectionName, docId));
      const accountData = accountDoc.data();

      // Delete the Firestore document
      await deleteDoc(doc(db, collectionName, docId));

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
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  const handleUpdate = async (updateData) => {
    if (!editingAccount) return;

    const {
      email,
      department,
      governorate,
      ministry,
      password,
      confirmPassword,
    } = updateData;

    if (!currentUser) {
      toast.error("يجب تسجيل الدخول كمدير أولاً");
      return;
    }

    if (userData?.role !== "admin") {
      toast.error("يجب تسجيل الدخول كمدير للوصول لهذه الصفحة");
      return;
    }

    try {
      setIsUpdating(true);

      if (email !== editingAccount.email) {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          toast.error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
          return;
        }
      }

      if (password) {
        if (password.length < 6) {
          toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
          return;
        }
      }

      const updates = {
        email: email,
      };

      if (editingAccount.role === "department") {
        if (!department || !governorate) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.department = department;
        updates.governorate = governorate;
      } else if (editingAccount.role === "governorate") {
        if (!governorate) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.governorate = governorate;
      } else if (editingAccount.role === "ministry") {
        if (!ministry) {
          toast.error("الرجاء ملء جميع الحقول المطلوبة");
          return;
        }
        updates.ministry = ministry;
      }

      if (editingAccount.collection === "ministryAccounts") {
        await updateMinistryAccount(editingAccount.id, updates);
      } else if (editingAccount.collection === "governorateAccounts") {
        await updateGovernorateAccount(editingAccount.id, updates);
      } else {
        await updateDepartmentAccount(editingAccount.id, updates);
      }

      if (password) {
        if (editingAccount.collection === "ministryAccounts") {
          await updateMinistryAccountPassword(editingAccount.uid, password);
        } else if (editingAccount.collection === "governorateAccounts") {
          await updateGovernorateAccountPassword(editingAccount.uid, password);
        } else {
          await updateDepartmentAccountPassword(editingAccount.uid, password);
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

  const departmentAccounts = accounts.filter(
    (account) => account.collection === "departmentAccounts"
  );
  const governorateAccounts = accounts.filter(
    (account) => account.collection === "governorateAccounts"
  );
  const ministryAccounts = accounts.filter(
    (account) => account.collection === "ministryAccounts"
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
            {activeTab === "create" && (
              <CreateAccountForm
                onSubmit={handleCreateAccount}
                isSubmitting={isSubmitting}
                checkEmailExists={checkEmailExists}
              />
            )}
            {activeTab === "departmentAccounts" && (
              <AccountsTable
                accounts={departmentAccounts}
                accountType="department"
                isFetching={isFetching}
                onEdit={handleEdit}
                onToggleBan={handleToggleBan}
                onDelete={handleDelete}
              />
            )}
            {activeTab === "governorateAccounts" && (
              <AccountsTable
                accounts={governorateAccounts}
                accountType="governorate"
                isFetching={isFetching}
                onEdit={handleEdit}
                onToggleBan={handleToggleBan}
                onDelete={handleDelete}
              />
            )}
            {activeTab === "ministryAccounts" && (
              <AccountsTable
                accounts={ministryAccounts}
                accountType="ministry"
                isFetching={isFetching}
                onEdit={handleEdit}
                onToggleBan={handleToggleBan}
                onDelete={handleDelete}
              />
            )}
            {activeTab === "deletedAccounts" && (
              <DeletedAccountsList
                deletedAccounts={deletedAccounts}
                isFetching={isFetching}
                onRestoreAccount={handleRestoreAccount}
              />
            )}
          </main>
        </div>
      </div>

      <EditAccountModal
        editingAccount={editingAccount}
        onClose={handleCancelEdit}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AdminDashboard;
