import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { updateComplaintStatus as updateComplaintStatusService } from "../services/complaintsService";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Topbar from "../Topbar";
import ComplaintAction from "../features/authority_Dashboard/ComplaintAction";
import {
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaExchangeAlt,
  FaChartBar,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaMapMarkedAlt,
  FaImage,
  FaVideo,
  FaTimesCircle,
  FaEdit,
  FaArrowRight,
  FaCog,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DepartmentDashboard = () => {
  const { userData } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("complaints");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Ref for ComplaintAction modal
  const complaintActionRef = useRef();

  // Static list of departments for filtering
  const departmentsList = [
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

  // Get unique departments from complaints for filtering
  const departments = [
    ...new Set(complaints.map((c) => c.administration).filter(Boolean)),
  ];

  // Get available departments for filtering (combine static list with actual data)
  const getAvailableDepartments = () => {
    const fromComplaints = [
      ...new Set(complaints.map((c) => c.administration).filter(Boolean)),
    ];
    const allDepartments = [
      ...new Set([...departmentsList, ...fromComplaints]),
    ];
    return allDepartments.sort();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const dateObj = dateValue?.toDate ? dateValue.toDate() : dateValue;
    try {
      return new Date(dateObj).toLocaleDateString("ar-EG");
    } catch (e) {
      return "-";
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    const dateObj = dateValue?.toDate ? dateValue.toDate() : dateValue;
    try {
      return new Date(dateObj).toLocaleString("ar-EG");
    } catch (e) {
      return "-";
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userData]);

  useEffect(() => {
    // Filter complaints based on selected department
    setFilterLoading(true);
    if (selectedDepartment) {
      const filtered = complaints.filter(
        (c) => c.administration === selectedDepartment
      );
      setFilteredComplaints(filtered);
    } else {
      setFilteredComplaints(complaints);
    }
    setFilterLoading(false);
  }, [selectedDepartment, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      if (!userData) {
        setComplaints([]);
        return;
      }

      let q;

      if (userData.role === "department") {
        // للإدارة: عرض الشكاوى حسب الإدارة والمحافظة معاً
        if (!userData.department || !userData.governorate) {
          console.error("Department user missing required fields:", userData);
          setComplaints([]);
          return;
        }
        q = query(
          collection(db, "complaints"),
          where("administration", "==", userData.department),
          where("governorate", "==", userData.governorate)
        );
      } else if (userData.role === "governorate") {
        // للمحافظة: عرض جميع الشكاوى في المحافظة
        if (!userData.governorate) {
          console.error(
            "Governorate user missing governorate field:",
            userData
          );
          setComplaints([]);
          return;
        }
        q = query(
          collection(db, "complaints"),
          where("governorate", "==", userData.governorate)
        );
      } else {
        console.error("Invalid user role for dashboard:", userData.role);
        setComplaints([]);
        return;
      }

      if (!q) {
        setComplaints([]);
        return;
      }

      const querySnapshot = await getDocs(q);
      const complaintsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure administration field exists, fallback to department if needed
          administration: data.administration || data.department || "غير محدد",
        };
      });

      // Sort by creation date (newest first) after fetching
      complaintsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setComplaints(complaintsList);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("حدث خطأ أثناء جلب الشكاوى");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      setUpdatingStatus(true);

      // Use the service that creates notifications
      const result = await updateComplaintStatusService(complaintId, status);

      if (!result.success) {
        throw new Error(result.error || "فشل تحديث حالة الشكوى");
      }

      // Update additional local information
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        updatedBy: userData.email,
        updatedAt: new Date(),
      });

      // Update the local state
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId ? { ...c, status, updatedAt: new Date() } : c
        )
      );

      setFilteredComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId ? { ...c, status, updatedAt: new Date() } : c
        )
      );

      // Update the selected complaint if it's open
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint((prev) => ({
          ...prev,
          status,
          updatedAt: new Date(),
        }));
      }

      toast.success(`تم تحديث حالة الشكوى إلى: ${status}`);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast.error(`خطأ في تحديث حالة الشكوى: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
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
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const openComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
  };

  const closeComplaintModal = () => {
    setShowComplaintModal(false);
    setSelectedComplaint(null);
  };

  // Open ComplaintAction modal for department users
  const openComplaintAction = (complaint) => {
    setSelectedComplaint(complaint);
    if (complaintActionRef.current) {
      complaintActionRef.current.showModal();
    }
  };

  // Handle status change from ComplaintAction component
  const handleComplaintActionStatusChange = (complaintId, newStatus) => {
    // Update the complaint in the local state
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );
    setFilteredComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );

    // Update the selected complaint if it's open
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
    }

    toast.success("تم تحديث حالة الشكوى بنجاح");
  };

  // Calculate statistics
  const getStatistics = () => {
    const total = complaints.length;
    const pending = complaints.filter(
      (c) => c.status === "قيد المعالجة"
    ).length;
    const resolved = complaints.filter((c) => c.status === "تم الحل").length;
    const rejected = complaints.filter((c) => c.status === "مرفوضة").length;
    const runing = complaints.filter((c) => c.status === "جارى الحل").length;

    return { total, pending, resolved, rejected, runing };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {/* Role Indicator Card */}

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaChartBar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي الشكاوى</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FaEye className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaExchangeAlt className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">جاري الحل</p>
            <p className="text-2xl font-bold text-gray-900">{stats.runing}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">تمت المعالجة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <FaTimes className="h-6 w-6 text-red-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">مرفوضة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const FiltersSection = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaFilter className="ml-2 text-blue-600" />
          فلاتر البحث
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBuilding className="inline ml-2" />
              الإدارة
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={filterLoading}
            >
              <option value="">جميع الإدارات</option>
              {getAvailableDepartments().map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDepartment("");
                setFilterLoading(true);
                setTimeout(() => setFilterLoading(false), 100);
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={filterLoading}
            >
              {filterLoading ? "جاري..." : "إعادة تعيين الفلاتر"}
            </button>
          </div>

          {filterLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ComplaintsTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              الشكاوى الواردة
              {selectedDepartment && (
                <span className="text-sm text-gray-500 mr-2">
                  - {selectedDepartment}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {userData?.role === "department"
                ? "يمكنك عرض الشكاوى واتخاذ الإجراءات عليها"
                : "يمكنك عرض الشكاوى ومتابعة الإجراءات المتخذة"}
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {filteredComplaints.length} شكوى
          </span>
        </div>
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
                مقدم الشكوى
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              {userData.role === "governorate" && (
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
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.complaintId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(complaint.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{complaint.name}</div>
                      <div className="text-gray-500 text-xs">
                        {complaint.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{complaint.description}</div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      {complaint.imageBase64 && (
                        <FaImage className="ml-1 text-blue-500" />
                      )}
                      {complaint.videoUrl && (
                        <FaVideo className="ml-1 text-red-500" />
                      )}
                      {complaint.location && (
                        <FaMapMarkedAlt className="ml-1 text-green-500" />
                      )}
                    </div>
                  </td>
                  {userData.role === "governorate" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.administration}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start">
                      {getStatusBadge(complaint.status || "قيد المعالجة")}
                      {complaint.updatedAt && (
                        <span className="text-xs text-gray-500 mt-1">
                          آخر تحديث: {formatDate(complaint.updatedAt)}
                        </span>
                      )}
                      {complaint.updatedBy && (
                        <span className="text-xs text-blue-600 mt-1">
                          بواسطة: {complaint.updatedBy}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => openComplaintDetails(complaint)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded text-xs flex items-center"
                      >
                        <FaEye className="ml-1" />
                        عرض
                      </button>

                      {userData.role === "department" && (
                        <>
                          <button
                            onClick={() => openComplaintAction(complaint)}
                            className="text-orange-600 hover:text-orange-900 bg-orange-100 px-3 py-1 rounded text-xs flex items-center"
                          >
                            <FaCog className="ml-1" />
                            إجراء
                          </button>
                          {/* <button
                            onClick={() =>
                              updateComplaintStatus(
                                complaint.id,
                                "تمت المعالجة"
                              )
                            }
                            disabled={updatingStatus}
                            className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded text-xs flex items-center disabled:opacity-50"
                          >
                            <FaCheck className="ml-1" />
                            تمت
                          </button>
                          <button
                            onClick={() =>
                              updateComplaintStatus(complaint.id, "مرفوضة")
                            }
                            disabled={updatingStatus}
                            className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded text-xs flex items-center disabled:opacity-50"
                          >
                            <FaTimes className="ml-1" />
                            رفض
                          </button> */}
                        </>
                      )}

                      {/* Governorate users can only view, no status change */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userData.role === "governorate" ? 7 : 6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {selectedDepartment
                    ? `لا توجد شكاوى متاحة للإدارة: ${selectedDepartment}`
                    : "لا توجد شكاوى متاحة"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ComplaintDetailsModal = () => {
    if (!selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaEye className="ml-2 text-blue-600" />
                تفاصيل الشكوى #{selectedComplaint.complaintId}
              </h2>
              <button
                onClick={closeComplaintModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="ml-2 text-blue-600" />
                    معلومات مقدم الشكوى
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        الاسم:
                      </span>
                      <span className="text-gray-900">
                        {selectedComplaint.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        البريد الإلكتروني:
                      </span>
                      <span className="text-gray-900">
                        {selectedComplaint.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaBuilding className="ml-2 text-green-600" />
                    معلومات الشكوى
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        المحافظة:
                      </span>
                      <span className="text-gray-900">
                        {selectedComplaint.governorate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        الإدارة:
                      </span>
                      <span className="text-gray-900">
                        {selectedComplaint.administration}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        الحالة:
                      </span>
                      <div className="mr-2">
                        {getStatusBadge(
                          selectedComplaint.status || "قيد المعالجة"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        تاريخ الإنشاء:
                      </span>
                      <span className="text-gray-900">
                        {formatDateTime(selectedComplaint.createdAt)}
                      </span>
                    </div>
                    {selectedComplaint.updatedAt && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 ml-2">
                          آخر تحديث:
                        </span>
                        <span className="text-gray-900">
                          {formatDateTime(selectedComplaint.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Section - Full Width */}
                <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaMapMarkerAlt className="ml-2 text-red-600" />
                    الموقع
                  </h3>
                  {selectedComplaint.location ? (
                    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                      {(() => {
                        const [lat, lng] = selectedComplaint.location
                          .split(",")
                          .map((coord) => parseFloat(coord.trim()));
                        if (!isNaN(lat) && !isNaN(lng)) {
                          return (
                            <MapContainer
                              center={[lat, lng]}
                              zoom={16}
                              style={{ height: "100%", width: "100%" }}
                              scrollWheelZoom={true}
                              zoomControl={true}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={[lat, lng]} />
                            </MapContainer>
                          );
                        } else {
                          return (
                            <div className="bg-gray-200 rounded-lg p-3 text-center h-full flex items-center justify-center">
                              <div>
                                <FaMapMarkerAlt className="text-2xl text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                  إحداثيات غير صالحة
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="bg-gray-200 rounded-lg p-3 text-center h-32 flex items-center justify-center">
                      <div>
                        <FaMapMarkerAlt className="text-2xl text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          لم يتم تحديد موقع
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Description and Media */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    وصف الشكوى
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Image */}
                {selectedComplaint.imageBase64 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaImage className="ml-2 text-blue-600" />
                      الصورة المرفقة
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={selectedComplaint.imageBase64}
                        alt="صورة الشكوى"
                        className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Video */}
                {selectedComplaint.videoUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaVideo className="ml-2 text-red-600" />
                      الفيديو المرفق
                    </h3>
                    <div className="flex justify-center">
                      <video
                        src={selectedComplaint.videoUrl}
                        controls
                        className="max-w-full h-auto rounded-lg shadow-md max-h-64"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaEdit className="ml-2 text-orange-600" />
                تحديث حالة الشكوى
              </h3>

              <div className="flex flex-wrap gap-3">
                {userData.role === "department" && (
                  <>
                    <button
                      onClick={() => openComplaintAction(selectedComplaint)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <FaCog className="ml-2" />
                      إجراء متقدم
                    </button>
                    <button
                      onClick={() =>
                        updateComplaintStatus(
                          selectedComplaint.id,
                          "تمت المعالجة"
                        )
                      }
                      disabled={updatingStatus}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      <FaCheck className="ml-2" />
                      تمت المعالجة
                    </button>
                    <button
                      onClick={() =>
                        updateComplaintStatus(selectedComplaint.id, "مرفوضة")
                      }
                      disabled={updatingStatus}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      <FaTimes className="ml-2" />
                      رفض الشكوى
                    </button>
                  </>
                )}

                {userData.role === "governorate" && (
                  <div className="text-gray-600 text-center w-full py-4">
                    <FaEye className="text-2xl mx-auto mb-2 text-blue-500" />
                    <p>يمكنك فقط عرض الشكاوى والإجراءات المتخذة عليها</p>
                    <p className="text-sm mt-1">لا يمكنك تغيير حالة الشكاوى</p>
                  </div>
                )}

                {updatingStatus && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 ml-2"></div>
                    جاري التحديث...
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeComplaintModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة تحكم {userData?.role === "department" ? "" : " محافظة  "}
            <span className="text-3xl font-bold text-gray-900 mb-2">
              {userData?.role === "department"
                ? `${userData.department} - ${userData.governorate}`
                : userData.governorate}
            </span>
          </h1>

          {/* Role Description */}
          <div className="mt-2">
            {userData?.role === "department" ? (
              <p className="text-gray-600 text-lg">
                يمكنك عرض الشكاوى وتحديث حالاتها واتخاذ الإجراءات اللازمة
              </p>
            ) : (
              <p className="text-gray-600 text-lg">
                يمكنك عرض الشكاوى ومتابعة الإجراءات المتخذة عليها (لا يمكنك
                تغيير الحالات)
              </p>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards />

        {/* Filters Section */}
        {userData.role === "governorate" && <FiltersSection />}

        {/* Complaints Table */}
        <ComplaintsTable />

        {/* Action History Summary for Governorate Users */}
        {userData?.role === "governorate" && complaints.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <FaChartBar className="ml-2 text-green-600" />
                ملخص الإجراءات المتخذة
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                آخر الإجراءات التي تم اتخاذها على الشكاوى
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        complaints.filter((c) => c.status === "تمت المعالجة")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">تمت معالجتها</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        complaints.filter((c) => c.status === "قيد المعالجة")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">قيد المعالجة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {complaints.filter((c) => c.status === "مرفوضة").length}
                    </div>
                    <div className="text-sm text-gray-600">مرفوضة</div>
                  </div>
                </div>

                {/* Recent Actions */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    آخر الإجراءات:
                  </h4>
                  <div className="space-y-2">
                    {complaints
                      .filter((c) => c.updatedAt && c.updatedBy)
                      .sort((a, b) => {
                        const dateA = a.updatedAt?.toDate
                          ? a.updatedAt.toDate()
                          : new Date(a.updatedAt || 0);
                        const dateB = b.updatedAt?.toDate
                          ? b.updatedAt.toDate()
                          : new Date(b.updatedAt || 0);
                        return dateB - dateA;
                      })
                      .slice(0, 5)
                      .map((complaint) => (
                        <div
                          key={complaint.id}
                          className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="text-gray-600">
                            شكوى #{complaint.complaintId} -{" "}
                            {complaint.administration}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                getStatusBadge(
                                  complaint.status || "قيد المعالجة"
                                ).props.className
                              }`}
                            >
                              {complaint.status}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(complaint.updatedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Details Modal */}
        {showComplaintModal && <ComplaintDetailsModal />}

        {/* ComplaintAction Modal for Department Users */}
        {userData?.role === "department" && selectedComplaint && (
          <ComplaintAction
            ref={complaintActionRef}
            complaint={selectedComplaint}
            onStatusChange={handleComplaintActionStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
