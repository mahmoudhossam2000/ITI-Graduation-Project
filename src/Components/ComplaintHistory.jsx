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
import "leaflet/dist/leaflet.css";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
import { RiGovernmentFill } from "react-icons/ri";
import { IoDocumentText, IoVideocam } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaImages } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import EditComplaintModal from "./EditComplaintModal";

export default function ComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editData, setEditData] = useState({
    status: "",
    administration: "",
    governorate: "",
    description: "",
    location: "",
    imagesBase64: [],
    videoUrl: "",
  });

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

  const openDetailsModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const openEditModal = (complaint) => {
    console.log("Opening edit modal for:", complaint);
    setSelectedComplaint(complaint);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (selectedComplaint) {
      setEditData({
        status: selectedComplaint.status || "",
        administration: selectedComplaint.administration || "",
        governorate: selectedComplaint.governorate || "",
        description: selectedComplaint.description || "",
        location: selectedComplaint.location || "",
        imagesBase64: selectedComplaint.imagesBase64 || [],
        videoUrl: selectedComplaint.videoUrl || "",
      });
    }
  }, [selectedComplaint]);

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "complaints", selectedComplaint.id), editData);
      toast.success("تم تحديث الشكوى بنجاح");
      setShowEditModal(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الشكوى");
    }
  };
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const newImages = [...editData.imagesBase64];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await convertToBase64(file);
      newImages.push(base64);
    }

    setEditData({ ...editData, imagesBase64: newImages });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
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
        return "bg-background text-darkTeal";
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
                  xmlns="http://www.w3.org/2000/svg">
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
                        رقم الشكوي
                      </th>
                      <th className="px-6 py-3 text-center text-base font-bold text-darkTeal uppercase tracking-wider">
                        الإدارة المختصة
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
                        className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center">
                          {complaint.complaintId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 text-center">
                          {complaint.administration || "—"}
                        </td>
                        <td className="px-6 py-4 text-base text-gray-500 max-w-xs truncate">
                          {complaint.description || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              complaint.status
                            )}`}>
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
                            onClick={() => openDetailsModal(complaint)}
                            className="text-green-600 hover:text-green-900 mx-2"
                            title="عرض التفاصيل">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(complaint)}
                            className="text-blue-600 hover:text-blue-900 mx-2"
                            title="تعديل">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
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
                            title="حذف">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
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


      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-darkTeal">
                    تفاصيل الشكوى
                  </h3>
                  <p className="text-base text-gray-600 font-medium mt-2">
                    رقم الشكوي : <span className="font-semibold text-blue">{selectedComplaint?.complaintId || "—"}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setCurrentImageIndex(0);
                  }}
                  className="rounded-full hover:bg-gray-200 transition-all duration-300 bg-gray-100 p-2 mb-8"
                >
                  <IoClose size={24}/>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center items-center">
                  <span className="text-gray-700 text-base font-medium">
                    حالة الشكوي :
                  </span>
                  <span
                    className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-full ms-2 ${getStatusColor(
                      selectedComplaint?.status
                    )}`}
                  >
                    {selectedComplaint?.status || "غير محدد"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "الاسم",
                      value: selectedComplaint?.name || "—",
                      icon: <FaUser />,
                    },
                    {
                      label: "البريد الإلكتروني",
                      value: selectedComplaint?.email || "—",
                      icon: <MdEmail />,
                    },
                    {
                      label: "الإدارة المختصة",
                      value: selectedComplaint?.administration || "—",
                      icon: <FcDepartment />,
                    },
                    {
                      label: "المحافظة",
                      value: selectedComplaint?.governorate || "—",
                      icon: <RiGovernmentFill />,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center">
                        <span className="text-lg">{item.icon}</span>
                        <h4 className="text-base font-medium text-gray-700 ms-3">
                          {item.label}
                        </h4>
                      </div>
                      <div>
                        <p className="text-base font-medium mt-2 text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <IoDocumentText className="me-3" />
                    تفاصيل الشكوى
                  </h4>
                  <div className="p-4 rounded-md">
                    <p className="text-darkTeal whitespace-pre-line leading-relaxed">
                      {selectedComplaint?.description || "—"}
                    </p>
                  </div>
                </div>

                {selectedComplaint?.location && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-darkTeal flex items-center">
                        <FaMapMarkerAlt />
                        <span className="ms-2">الموقع على الخريطة</span>
                      </h4>
                      <a
                        href={`https://www.google.com/maps?q=${selectedComplaint.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center text-blue hover:text-blue-800 transition-colors"
                      >
                        فتح في خرائط جوجل
                        <FaArrowUpRightFromSquare className="ms-1" />
                      </a>
                    </div>
                    <div className="h-64 rounded-md overflow-hidden border-2 border-gray-200">
                      <MapContainer
                        center={selectedComplaint.location
                          .split(",")
                          .map(Number)}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                          position={selectedComplaint.location
                            .split(",")
                            .map(Number)}
                        >
                          <Popup className="font-bold text-darkTeal">
                            📍 موقع الشكوى
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )}

                {selectedComplaint?.imagesBase64?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-darkTeal mb-4 flex items-center">
                      <FaImages className="me-2" />
                      الصور المرفقة ({currentImageIndex + 1}/
                      {selectedComplaint.imagesBase64.length})
                    </h4>
                    <div className="relative">
                      <div className="overflow-hidden rounded-md border-2 border-gray-200">
                        <img
                          src={
                            selectedComplaint.imagesBase64[currentImageIndex]
                          }
                          alt={`صورة الشكوى ${currentImageIndex + 1}`}
                          className="w-full h-72 object-cover"
                        />
                      </div>

                      {selectedComplaint.imagesBase64.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) =>
                                prev === 0
                                  ? selectedComplaint.imagesBase64.length - 1
                                  : prev - 1
                              );
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all duration-300"
                          >
                            <svg
                              className="h-5 w-5 text-darkTeal"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) =>
                                prev ===
                                selectedComplaint.imagesBase64.length - 1
                                  ? 0
                                  : prev + 1
                              );
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all duration-300"
                          >
                            <svg
                              className="h-5 w-5 text-darkTeal"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      <div className="flex justify-center mt-4 space-x-2">
                        {selectedComplaint.imagesBase64.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`rounded-full transition-all duration-300 ${
                              currentImageIndex === index
                                ? "bg-blue w-3 h-3 mx-1"
                                : "bg-darkTeal w-2 h-2 hover:bg-gray-400 mx-1"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint?.videoUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-darkTeal mb-4 flex items-center">
                      <IoVideocam className="me-2" size={20} />
                      الفيديو المرفق
                    </h4>
                    <div className="rounded-md overflow-hidden border-2 border-gray-200">
                      <video
                        controls
                        className="w-full h-64 bg-black"
                        src={selectedComplaint.videoUrl}
                        poster={selectedComplaint.imagesBase64?.[0]}
                      >
                        متصفحك لا يدعم تشغيل الفيديو.
                      </video>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setCurrentImageIndex(0);
                  }}
                  className="px-6 py-2 bg-blue text-white rounded-md hover:bg-darkTeal transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedComplaint && (
        <EditComplaintModal
          complaintData={selectedComplaint}
          onClose={() => {
            setShowEditModal(false);
            setSelectedComplaint(null);
          }}
          onUpdate={() => {
            setShowEditModal(false);
            setSelectedComplaint(null);
          }}
        />
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
                  xmlns="http://www.w3.org/2000/svg">
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-blue hover:bg-background">
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
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
