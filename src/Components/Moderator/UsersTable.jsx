import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ShieldAlert,
  UserX,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchUsersAndComplaints = async () => {
      try {
        setIsLoading(true);

        // جلب جميع المستخدمين
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        
        for (const userDoc of usersSnapshot.docs) {
          const user = { id: userDoc.id, ...userDoc.data() };

          // استثناء المستخدمين اللي رولهم department
          if (user.role === "department") continue;

          // جلب جميع شكاوى المستخدم
          const complaintsQuery = query(
            collection(db, "complaints"),
            where("email", "==", user.email)
          );
          const complaintsSnapshot = await getDocs(complaintsQuery);

          // جلب الشكاوى المسيئة فقط
          const abusiveComplaintsQuery = query(
            collection(db, "complaints"),
            where("email", "==", user.email),
            where("isAbusive", "==", true)
          );
          const abusiveComplaintsSnapshot = await getDocs(abusiveComplaintsQuery);

          user.complaintCount = complaintsSnapshot.size;
          user.abusiveComplaintsCount = abusiveComplaintsSnapshot.size;
          user.lastActive = userDoc.data().lastLogin?.toDate();
          usersData.push(user);
        }

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndComplaints();
  }, []);

  const openBanModal = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const closeBanModal = () => {
    setShowBanModal(false);
    setSelectedUser(null);
  };

  const banUser = async () => {
    try {
      await updateDoc(doc(db, "users", selectedUser.id), { banned: true });
      await addDoc(collection(db, "bannedUsers"), {
        userId: selectedUser.id,
        email: selectedUser.email,
        banDate: new Date(),
        reason: "حظر يدوي من المشرف",
        abusiveComplaintsCount: selectedUser.abusiveComplaintsCount
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, banned: true } : u
        )
      );
      closeBanModal();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const unbanUser = async (id, email) => {
    try {
      await updateDoc(doc(db, "users", id), { banned: false });

      const bannedQuery = query(
        collection(db, "bannedUsers"),
        where("email", "==", email)
      );
      const snapshot = await getDocs(bannedQuery);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, banned: false } : u))
      );
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActivityLevel = (count) => {
    if (count === 0) return "text-gray-400";
    if (count <= 3) return "text-green-500";
    if (count <= 10) return "text-yellow-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkTeal"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-800">
                  تأكيد حظر المستخدم
                </h3>
              </div>
              <button
                onClick={closeBanModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">هل أنت متأكد من الحظر؟</p>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-blue-500">
                  الشكاوى: {selectedUser.complaintCount}
                </span>
                <span className="text-red-500">
                  شكاوى مسيئة: {selectedUser.abusiveComplaintsCount || 0}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeBanModal}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={banUser}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                تأكيد الحظر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-darkTeal">إدارة المستخدمين</h2>
          <p className="text-gray-500 text-sm mt-1">
            إجمالي المستخدمين: {users.length} | المحظورون:{" "}
            {users.filter((u) => u.banned).length}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-darkTeal bg-gray-50 hover:bg-gray-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 text-center">
              <th className="p-4 text-sm">المستخدم</th>
              <th className="p-4 text-sm">البريد الإلكتروني</th>
              <th className="p-4 text-sm">عدد الشكاوى</th>
              <th className="p-4 text-sm">شكاوى مسيئة</th>
              <th className="p-4 text-sm">الحالة</th>
              <th className="p-4 text-sm">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {currentItems.length > 0 ? (
              currentItems.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-sm">{u.email}</td>
                  <td className={`p-4 font-bold ${getActivityLevel(u.complaintCount)}`}>
                    {u.complaintCount}
                  </td>
                  <td
                    className={`p-4 font-bold ${
                      u.abusiveComplaintsCount > 0 ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {u.abusiveComplaintsCount || 0}
                  </td>
                  <td className="p-4">
                    {u.banned ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                        محظور
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        نشط
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {u.banned ? (
                        <button
                          onClick={() => unbanUser(u.id, u.email)}
                          className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"
                          title="إلغاء الحظر"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openBanModal(u)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="حظر المستخدم"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      {u.abusiveComplaintsCount > 0 && (
                        <div
                          className="p-2 text-yellow-500"
                          title={`لدى المستخدم ${u.abusiveComplaintsCount} شكوى مسيئة`}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <p>لا توجد نتائج مطابقة للبحث</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-500">
            عرض من{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            إلى{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" /> السابق
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue text-white">
              {currentPage}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50"
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;