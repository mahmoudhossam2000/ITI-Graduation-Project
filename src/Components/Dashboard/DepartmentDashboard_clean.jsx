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
import StatisticsCards from "./StatisticsCards";
import FiltersSection from "./FiltersSection";
import ComplaintsTable from "./ComplaintsTable";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import ActionHistorySummary from "./ActionHistorySummary";
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
          administration: data.administration || data.department || "غير محدد",
        };
      });

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

      const result = await updateComplaintStatusService(complaintId, status);

      if (!result.success) {
        throw new Error(result.error || "فشل تحديث حالة الشكوى");
      }

      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        updatedBy: userData.email,
        updatedAt: new Date(),
      });

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

  const openComplaintAction = (complaint) => {
    setSelectedComplaint(complaint);
    if (complaintActionRef.current) {
      complaintActionRef.current.showModal();
    }
  };

  const handleComplaintActionStatusChange = (complaintId, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );
    setFilteredComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );

    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
    }

    toast.success("تم تحديث حالة الشكوى بنجاح");
  };

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
        <StatisticsCards stats={stats} />

        {/* Filters Section */}
        {userData.role === "governorate" && (
          <FiltersSection
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            filterLoading={filterLoading}
            setFilterLoading={setFilterLoading}
            getAvailableDepartments={getAvailableDepartments}
          />
        )}

        {/* Complaints Table */}
        <ComplaintsTable
          filteredComplaints={filteredComplaints}
          selectedDepartment={selectedDepartment}
          userData={userData}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
          openComplaintDetails={openComplaintDetails}
          openComplaintAction={openComplaintAction}
        />

        {/* Action History Summary for Governorate Users */}
        {userData?.role === "governorate" && complaints.length > 0 && (
          <ActionHistorySummary
            complaints={complaints}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
          />
        )}

        {/* Complaint Details Modal */}
        {showComplaintModal && (
          <ComplaintDetailsModal
            selectedComplaint={selectedComplaint}
            closeComplaintModal={closeComplaintModal}
            formatDateTime={formatDateTime}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            userData={userData}
            openComplaintAction={openComplaintAction}
            updateComplaintStatus={updateComplaintStatus}
            updatingStatus={updatingStatus}
          />
        )}

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
