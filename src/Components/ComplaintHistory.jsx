import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function ComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.email) return;

    const q = query(
      collection(db, "complaints"),
      where("email", "==", currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const openEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewDescription(complaint.description);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!newDescription.trim()) {
      toast.warning("الوصف لا يمكن أن يكون فارغًا");
      return;
    }
    try {
      await updateDoc(doc(db, "complaints", selectedComplaint.id), {
        description: newDescription,
      });
      toast.success("تم تعديل الشكوى بنجاح");
      setShowEditModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء تعديل الشكوى");
    }
  };

  const openDeleteModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "complaints", selectedComplaint.id));
      toast.success("تم حذف الشكوى بنجاح");
      setShowDeleteModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الشكوى");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "تم الحل":
        return "bg-green-100 text-green-800";
      case "قيد المعالجة":
        return "bg-yellow-100 text-yellow-800";
      case "مرفوض":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
              سجل الشكاوى الخاصة بك
            </h2>
            <p className="text-gray-600 text-center mb-6">
              هنا يمكنك عرض وتعديل ومتابعة جميع شكاويك السابقة
            </p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  لا توجد شكاوى مسجلة
                </h3>
                <p className="mt-1 text-gray-500">
                  لم تقم بتقديم أي شكاوى حتى الآن.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        الجهة
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((complaint, index) => (
                      <tr
                        key={complaint.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 text-center">
                          {complaint.ministry || "—"}
                        </td>
                        <td className="px-6 py-4 text-base text-gray-500 max-w-xs truncate">
                          {complaint.description || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {complaint.status || "غير محدد"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500 text-center">
                          {complaint?.createdAt?.seconds
                            ? new Date(
                                complaint.createdAt.seconds * 1000
                              ).toLocaleDateString("ar-EG")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-center">
                          <button
                            onClick={() => openEditModal(complaint)}
                            className="text-blue-600 hover:text-blue-900 mx-2"
                            title="تعديل"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(complaint)}
                            className="text-red-600 hover:text-red-900 mx-2"
                            title="حذف"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-darkTeal mx-auto">
                  تعديل الشكوى
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-red-700 hover:text-gray-700 bg-gray-300 rounded-3xl p-2"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background"
                rows="6"
                placeholder="أدخل وصف الشكوى..."
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-blue hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تأكيد الحذف
              </h3>
              <p className="text-gray-500 mb-6">
                هل أنت متأكد من رغبتك في حذف هذه الشكوى؟ لا يمكن التراجع عن هذا
                الإجراء.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-blue hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
