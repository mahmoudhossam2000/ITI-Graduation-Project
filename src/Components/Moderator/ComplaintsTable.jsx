import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import {
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterDuplicates, setFilterDuplicates] = useState(false);
  const [filterAbusive, setFilterAbusive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const itemsPerPage = 4;

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const snap = await getDocs(collection(db, "complaints"));
      const complaintsData = [];

      for (const doc of snap.docs) {
        const complaint = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        };

        if (complaint.userId) {
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", complaint.email)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            complaint.abusiveComplaintsCount =
              userData.abusiveComplaintsCount || 0;
            complaint.lastAbusiveComplaint =
              userData.lastAbusiveComplaint?.toDate();
            complaint.isBanned = userData.banned || false;
          }
        }

        complaintsData.push(complaint);
      }

      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("حدث خطأ في جلب الشكاوى");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setShowDeleteModal(true);
  };

  const deleteComplaint = async () => {
    if (!complaintToDelete) return;

    try {
      await deleteDoc(doc(db, "complaints", complaintToDelete.id));
      setComplaints((prev) =>
        prev.filter((c) => c.id !== complaintToDelete.id)
      );
      toast.success("تم حذف الشكوى بنجاح");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("حدث خطأ أثناء حذف الشكوى");
    } finally {
      setShowDeleteModal(false);
      setComplaintToDelete(null);
    }
  };

  const markAsDuplicate = async (id) => {
    try {
      await updateDoc(doc(db, "complaints", id), {
        isDuplicate: true,
        reviewed: true,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isDuplicate: true, reviewed: true } : c
        )
      );

      toast.success("تم تحديد الشكوى كمكررة");
    } catch (error) {
      console.error("Error marking as duplicate:", error);
      toast.error("حدث خطأ أثناء تحديد الشكوى كمكررة");
    }
  };

  const unmarkAsDuplicate = async (id) => {
    try {
      await updateDoc(doc(db, "complaints", id), {
        isDuplicate: false,
        reviewed: false,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isDuplicate: false, reviewed: false } : c
        )
      );

      toast.success("تم إلغاء تحديد الشكوى كمكررة");
    } catch (error) {
      console.error("Error unmarking as duplicate:", error);
      toast.error("حدث خطأ أثناء إلغاء تحديد الشكوى كمكررة");
    }
  };

  const markAsAbusive = async (id) => {
    try {
      const complaint = complaints.find((c) => c.id === id);

      await updateDoc(doc(db, "complaints", id), {
        isAbusive: true,
        reviewed: true,
        status: "مرفوضة",
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isAbusive: true, reviewed: true, status: "مرفوضة" }
            : c
        )
      );

      if (complaint?.userId) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", complaint.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const currentCount = userDoc.data().abusiveComplaintsCount || 0;
          const newCount = currentCount + 1;

          await updateDoc(userDoc.ref, {
            abusiveComplaintsCount: newCount,
            lastAbusiveComplaint: new Date(),
          });

          if (newCount >= 3) {
            await banUserAfterAbuse(complaint.userId, complaint.email);
          }
        }
      }

      toast.success("تم تحديد الشكوى كمحتوى مسيء وتحديث سجل المستخدم");
      setShowModal(false);
    } catch (error) {
      console.error("Error marking as abusive:", error);
      toast.error("حدث خطأ أثناء تحديد الشكوى كمحتوى مسيء");
    }
  };

  const unmarkAsAbusive = async (id) => {
    try {
      const complaint = complaints.find((c) => c.id === id);

      await updateDoc(doc(db, "complaints", id), {
        isAbusive: false,
        reviewed: false,
        status: "معلقة",
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isAbusive: false, reviewed: false, status: "معلقة" }
            : c
        )
      );

      if (complaint?.userId) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", complaint.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const currentCount = userDoc.data().abusiveComplaintsCount || 0;
          const newCount = Math.max(0, currentCount - 1);

          await updateDoc(userDoc.ref, {
            abusiveComplaintsCount: newCount,
          });
        }
      }

      toast.success("تم إلغاء تحديد الشكوى كمحتوى مسيء وتحديث سجل المستخدم");
    } catch (error) {
      console.error("Error unmarking as abusive:", error);
      toast.error("حدث خطأ أثناء إلغاء تحديد الشكوى كمحتوى مسيء");
    }
  };

  const banUserAfterAbuse = async (userId, email) => {
    try {
      await addDoc(collection(db, "bannedUsers"), {
        userId,
        email,
        banDate: new Date(),
        reason: "3 شكاوى مسيئة أو أكثر",
        abusiveComplaintsCount: 3,
      });

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          banned: true,
          banReason: "3 شكاوى مسيئة أو أكثر",
          banDate: new Date(),
        });
      });

      toast.warning(`تم حظر المستخدم ${email} بسبب 3 شكاوى مسيئة أو أكثر`);
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("حدث خطأ أثناء حظر المستخدم");
    }
  };

  const filteredComplaints = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.ministry?.toLowerCase().includes(term) ||
        complaint.description?.toLowerCase().includes(term) ||
        complaint.email?.toLowerCase().includes(term) ||
        complaint.complaintId?.includes(term);

      if (filterDuplicates && filterAbusive) {
        return matchesSearch && complaint.isDuplicate && complaint.isAbusive;
      }
      if (filterDuplicates) {
        return matchesSearch && complaint.isDuplicate;
      }
      if (filterAbusive) {
        return matchesSearch && complaint.isAbusive;
      }
      return matchesSearch;
    });
  }, [complaints, searchTerm, filterDuplicates, filterAbusive]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const currentItems = useMemo(() => {
    return filteredComplaints.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredComplaints, currentPage, itemsPerPage]);

  const StatusBadge = ({ status }) => {
    const statusColors = {
      معلقة: "bg-gray-100 text-gray-800",
      "قيد المعالجة": "bg-yellow-100 text-yellow-800",
      "تم الحل": "bg-green-100 text-green-800",
      مرفوضة: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}>
        {status}
      </span>
    );
  };

  const FlagBadge = ({ isDuplicate, isAbusive }) => (
    <div className="flex gap-1">
      {isDuplicate && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-mustard">
          مكررة
        </span>
      )}
      {isAbusive && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          مسيء
        </span>
      )}
    </div>
  );

  const UserAbuseBadge = ({ count }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        count >= 3
          ? "bg-red-100 text-red-800"
          : count > 0
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800"
      }`}>
      {count || 0}
    </span>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkTeal"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-darkTeal">إدارة الشكاوى</h2>
          <p className="text-gray-500 mt-1">عرض وإدارة جميع شكاوى المواطنين</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilterDuplicates(!filterDuplicates);
                setFilterAbusive(false);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
                filterDuplicates
                  ? "bg-purple-50 border-purple-200 text-mustard"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}>
              <Copy className="w-4 h-4" />
              {filterDuplicates ? "عرض الكل" : "عرض المكررة"}
            </button>
            <button
              onClick={() => {
                setFilterAbusive(!filterAbusive);
                setFilterDuplicates(false);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
                filterAbusive
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}>
              <ShieldAlert className="w-4 h-4" />
              {filterAbusive ? "عرض الكل" : "عرض المسيئة"}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن شكوى..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-darkTeal focus:border-darkTeal outline-none bg-gray-50 hover:bg-gray-100 transition"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
        <table className="w-full text-right min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-center">
              <th className="p-4 font-medium text-sm">الجهة</th>
              <th className="p-4 font-medium text-sm">مقدم الشكوى</th>
              <th className="p-4 font-medium text-sm">الحالة</th>
              <th className="p-4 font-medium text-sm">المحتوى</th>
              <th className="p-4 font-medium text-sm">التاريخ</th>
              <th className="p-4 font-medium text-sm">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {currentItems.length > 0 ? (
              currentItems.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50 transition ${
                    c.isDuplicate
                      ? "bg-purple-50"
                      : c.isAbusive
                      ? "bg-red-50"
                      : ""
                  }`}>
                  <td className="p-4 font-medium text-gray-800">
                    {c.ministry}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>{c.email || "غير متوفر"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-2">
                      <StatusBadge status={c.status} />
                      <FlagBadge
                        isDuplicate={c.isDuplicate}
                        isAbusive={c.isAbusive}
                      />
                    </div>
                  </td>
                  <td className="p-4 max-w-xs text-base text-gray-600">
                    {c.description?.substring(0, 10)}
                    {c.description?.length > 10 && "..."}
                    {"  "}
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setShowModal(true);
                      }}
                      className="text-blue hover:text-darkTeal underline mt-1 text-xs gap-1 transition">
                      عرض التفاصيل
                    </button>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {c.createdAt?.toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          c.isDuplicate
                            ? unmarkAsDuplicate(c.id)
                            : markAsDuplicate(c.id)
                        }
                        className={`p-2 rounded-lg transition ${
                          c.isDuplicate
                            ? "bg-purple-100 text-mustard hover:bg-purple-200"
                            : "bg-purple-50 hover:bg-purple-100 text-mustard"
                        }`}
                        title={
                          c.isDuplicate ? "إلغاء تحديد كمكررة" : "تحديد كمكررة"
                        }>
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          c.isAbusive
                            ? unmarkAsAbusive(c.id)
                            : markAsAbusive(c.id)
                        }
                        className={`p-2 rounded-lg transition ${
                          c.isAbusive
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-red-50 hover:bg-red-100 text-red-600"
                        }`}
                        title={
                          c.isAbusive
                            ? "إلغاء تحديد كمحتوى مسيء"
                            : "تحديد كمحتوى مسيء"
                        }>
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(c)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="حذف الشكوى">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <p className="text-gray-400">
                      لا توجد شكاوى متطابقة مع بحثك
                    </p>
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
              {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition">
              <ChevronRight className="w-4 h-4" /> السابق
            </button>

            <div className="flex gap-1">
              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue text-white"
                disabled>
                {currentPage}
              </button>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition">
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  تفاصيل الشكوى
                </h3>
                <p className="text-gray-500 text-sm">
                  رقم الشكوى: {selectedComplaint.complaintId}
                </p>
              </div>
              <div className="flex gap-2 ml-12">
                <StatusBadge status={selectedComplaint.status} />
                <FlagBadge
                  isDuplicate={selectedComplaint.isDuplicate}
                  isAbusive={selectedComplaint.isAbusive}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  الجهة المقدمة لها
                </h4>
                <p className="text-gray-800">{selectedComplaint.ministry}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  تاريخ الإرسال
                </h4>
                <p className="text-gray-800">
                  {selectedComplaint.createdAt?.toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  مقدم الشكوى
                </h4>
                <p className="text-gray-800">
                  {selectedComplaint.email || "غير معروف"}
                </p>
                {selectedComplaint.phone && (
                  <p className="text-gray-800 mt-1">
                    {selectedComplaint.phone}
                  </p>
                )}
              </div>

              {selectedComplaint.isDuplicate &&
                selectedComplaint.originalComplaintId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      مرتبطة بالشكوى رقم
                    </h4>
                    <p className="text-mustard font-medium">
                      {selectedComplaint.originalComplaintId.slice(0, 8)}
                    </p>
                  </div>
                )}
            </div>

            {selectedComplaint.location && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  موقع الشكوى
                </h4>
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={selectedComplaint.location.split(",").map(Number)}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={selectedComplaint.location
                        .split(",")
                        .map(Number)}>
                      <Popup>موقع الشكوى</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                محتوى الشكوى
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {selectedComplaint.imagesBase64 &&
              selectedComplaint.imagesBase64.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    الصور المرفقة
                  </h4>
                  <div className="relative flex items-center justify-center">
                    {/* زر السابق */}
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0
                            ? selectedComplaint.imagesBase64.length - 1
                            : prev - 1
                        )
                      }
                      className="absolute left-0 bg-darkTeal px-3 py-2 rounded-full shadow hover:bg-blue text-white">
                      ◀
                    </button>

                    {/* عرض الصورة */}
                    <img
                      src={selectedComplaint.imagesBase64[currentImageIndex]}
                      alt={`صورة الشكوى ${currentImageIndex + 1}`}
                      className="max-h-[400px] object-contain border border-gray-200 rounded-lg"
                    />

                    {/* زر التالي */}
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === selectedComplaint.imagesBase64.length - 1
                            ? 0
                            : prev + 1
                        )
                      }
                      className="absolute right-0 bg-darkTeal px-3 py-2 rounded-full shadow hover:bg-blue text-white">
                      ▶
                    </button>
                  </div>

                  {/* عداد الصور */}
                  <p className="text-center text-gray-500 text-sm mt-2">
                    {currentImageIndex + 1} /{" "}
                    {selectedComplaint.imagesBase64.length}
                  </p>
                </div>
              )}

            {/* Video Attachment Section */}
            {selectedComplaint.videoUrl && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  الفيديو المرفق
                </h4>
                <div className="rounded-lg overflow-hidden">
                  <video controls className="w-full max-h-96">
                    <source src={selectedComplaint.videoUrl} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() =>
                  selectedComplaint.isAbusive
                    ? unmarkAsAbusive(selectedComplaint.id)
                    : markAsAbusive(selectedComplaint.id)
                }
                className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                  selectedComplaint.isAbusive
                    ? "bg-red-100 hover:bg-red-200 text-red-800"
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                }`}>
                <ShieldAlert className="w-4 h-4" />
                {selectedComplaint.isAbusive
                  ? "إلغاء تحديد مسيء"
                  : "تحديد كمحتوى مسيء"}
              </button>

              <button
                onClick={() =>
                  selectedComplaint.isDuplicate
                    ? unmarkAsDuplicate(selectedComplaint.id)
                    : markAsDuplicate(selectedComplaint.id)
                }
                className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                  selectedComplaint.isDuplicate
                    ? "bg-purple-100 hover:bg-purple-200 text-mustard"
                    : "bg-purple-50 hover:bg-purple-100 text-mustard"
                }`}>
                <Copy className="w-4 h-4" />
                {selectedComplaint.isDuplicate
                  ? "إلغاء تحديد مكررة"
                  : "تحديد كمكررة"}
              </button>

              <button
                onClick={() => handleDeleteClick(selectedComplaint)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> حذف الشكوى
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">تأكيد الحذف</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              هل أنت متأكد من رغبتك في حذف الشكوى؟ هذا الإجراء لا يمكن التراجع
              عنه.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition">
                إلغاء
              </button>
              <button
                onClick={deleteComplaint}
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> حذف الشكوى
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsTable;
