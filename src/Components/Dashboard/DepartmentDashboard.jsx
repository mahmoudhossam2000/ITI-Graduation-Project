import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Topbar from "../Topbar";

const DepartmentDashboard = () => {
  const { userData } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const dateObj = dateValue?.toDate ? dateValue.toDate() : dateValue;
    try {
      return new Date(dateObj).toLocaleDateString("ar-EG");
    } catch (e) {
      return "-";
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userData]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      if (!userData) {
        setComplaints([]);
        return;
      }
      let q;

      if (userData.accountType === "department") {
        const base = [where("administration", "==", userData.department)];
        if (userData.governorate) {
          base.push(where("governorate", "==", userData.governorate));
        }
        q = query(collection(db, "complaints"), ...base);
      } else if (userData.accountType === "governorate") {
        q = query(
          collection(db, "complaints"),
          where("governorate", "==", userData.governorate)
        );
      }

      const querySnapshot = await getDocs(q);
      const complaintsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComplaints(complaintsList);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("حدث خطأ أثناء جلب الشكاوى");
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        status,
        updatedAt: new Date(),
        updatedBy: userData.email,
      });

      toast.success("تم تحديث حالة الشكوى بنجاح");
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الشكوى");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "قيد المعالجة": "bg-yellow-100 text-yellow-800",
      "تمت المعالجة": "bg-green-100 text-green-800",
      مرفوضة: "bg-red-100 text-red-800",
      محولة: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"
          }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          لوحة التحكم -{" "}
          {userData.accountType === "department"
            ? userData.department
            : `محافظة ${userData.governorate}`}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              الشكاوى الواردة
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الشكوى
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوصف
                  </th>
                  {userData.accountType === "governorate" && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإدارة المختصة
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.complaintId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {complaint.description}
                      </td>
                      {userData.accountType === "governorate" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {complaint.department}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(complaint.status || "قيد المعالجة")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          {userData.accountType === "department" && (
                            <>
                              <button
                                onClick={() =>
                                  updateComplaintStatus(
                                    complaint.id,
                                    "تمت المعالجة"
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                تمت
                              </button>
                              <button
                                onClick={() =>
                                  updateComplaintStatus(complaint.id, "مرفوضة")
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                رفض
                              </button>
                            </>
                          )}
                          {userData.accountType === "governorate" && (
                            <select
                              onChange={(e) =>
                                updateComplaintStatus(
                                  complaint.id,
                                  e.target.value
                                )
                              }
                              className="border rounded p-1 text-sm"
                              value={complaint.status || "قيد المعالجة"}
                            >
                              <option value="قيد المعالجة">قيد المعالجة</option>
                              <option value="تمت المعالجة">تمت المعالجة</option>
                              <option value="مرفوضة">مرفوضة</option>
                              <option value="محولة">محولة</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={userData.accountType === "governorate" ? 6 : 5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      لا توجد شكاوى متاحة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
