import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUser,
  FaIdCard,
  FaBuilding,
  FaFileAlt,
  FaInfoCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImages,
  FaIdBadge,
  FaVideo,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaGreaterThan } from "react-icons/fa6";
import { FaLessThan } from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ComplaintSearch() {
  const [searchComplaint, setSearchComplaint] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]);
  const [showDetails, setShowDetails] = useState(false); // الحالة الجديدة

  const handleSearch = async () => {
    if (!searchComplaint.trim()) {
      toast.warning("من فضلك ادخل رقم الشكوي", { closeButton: false });
      return;
    }
    setLoading(true);
    setResults([]);
    setNotFound(false);
    setShowDetails(false);

    try {
      const complaintsRef = collection(db, "complaints");
      const q = query(
        complaintsRef,
        where("complaintId", "==", searchComplaint.toString())
      );
      const querySnapshot = await getDocs(q);

      const complaintsData = [];
      querySnapshot.forEach((doc) => {
        complaintsData.push({ id: doc.id, ...doc.data() });
      });

      if (complaintsData.length === 0) {
        setNotFound(true);
      } else {
        setResults(complaintsData);
        setShowDetails(true); // عرض التفاصيل عند العثور على شكوى
        if (complaintsData[0]?.location) {
          const [lat, lng] = complaintsData[0].location.split(",").map(Number);
          setMapCenter([lat, lng]);
        }
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى");
      console.error("Error searching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "قيد المعالجة":
        return "bg-yellow-100 text-yellow-800";
      case "تم القبول":
        return "bg-green-100 text-green-800";
      case "مرفوض":
        return "bg-red-100 text-red-800";
      case "تم الحل":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const navigateImage = (direction) => {
    if (results[0]?.imagesBase64) {
      const totalImages = results[0].imagesBase64.length;
      setCurrentImageIndex((prev) => {
        if (direction === "prev") {
          return prev === 0 ? totalImages - 1 : prev - 1;
        } else {
          return prev === totalImages - 1 ? 0 : prev + 1;
        }
      });
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Navbar />

      <section className="flex items-center justify-center px-4 py-12 min-h-screen pt-20">
        <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Search Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-darkTeal mb-2">
              متابعة حالة الشكوى
            </h2>
            <p className="text-gray-600 text-lg">
              أدخل رقم الشكوى الخاص بك لمعرفة حالتها الحالية
            </p>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="ادخل رقم الشكوي..."
              className="w-full py-3 px-5 pr-5 bg-gray-50 text-lg rounded-lg border-2 border-gray-200 focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all"
              value={searchComplaint}
              onChange={(e) => {
                setSearchComplaint(e.target.value);
                setResults([]);
                setNotFound(false);
                setShowDetails(false);
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all shadow-sm">
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSearch className="h-5 w-5" />
              )}
            </button>
          </div>

          {notFound && (
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 text-red-600 mb-6">
              <FaInfoCircle className="inline-block ml-2" />
              لم يتم العثور على أي شكوى بهذا الرقم. يرجى التأكد من الرقم
              والمحاولة مرة أخرى.
            </div>
          )}

          {/* Complaint Details */}
          {showDetails &&
            results.map((complaint) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 mt-6 shadow-lg border border-gray-100 space-y-6">

                <div className="clear-both"></div>

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    تفاصيل الشكوى رقم:{" "}
                    <span className="text-blue">{complaint.complaintId}</span>
                  </h3>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      complaint.status
                    )}`}>
                    {complaint.status}
                  </span>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem icon={<FaUser size={20} />} label="الاسم الكامل" value={complaint.name} />
                  <InfoItem icon={<FaIdCard />} label="البريد الإلكتروني" value={complaint.email} />
                  {complaint.phone && (
                    <InfoItem icon={<FaPhone size={20} />} label="رقم الهاتف" value={complaint.phone} />
                  )}
                  {complaint.nationalId && (
                    <InfoItem icon={<FaIdBadge size={20} />} label="رقم الهوية" value={complaint.nationalId} />
                  )}
                  <InfoItem icon={<FaBuilding size={20} />} label="الإدارة" value={complaint.administration} />
                  {complaint.department && (
                    <InfoItem icon={<FaBuilding size={20} />} label="القسم" value={complaint.department} />
                  )}
                  {complaint.createdAt?.seconds && (
                    <InfoItem
                      icon={<FaCalendarAlt />}
                      label="تاريخ تقديم الشكوى"
                      value={new Date(
                        complaint.createdAt.seconds * 1000
                      ).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
                    <FaFileAlt className="mr-2 " /> <span className="ms-2">وصف الشكوى</span>
                  </h4>
                  <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-line">
                    {complaint.description}
                  </p>
                </div>

                {/* Map */}
                {complaint.location && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
                      <FaMapMarkerAlt className="mr-2" /> <span className="ms-2">موقع الشكوى</span>
                    </h4>
                    <div className="h-64 rounded-lg overflow-hidden border border-blue-200">
                      <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={mapCenter}>
                          <Popup>موقع الشكوى</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )}

                {/* Images */}
                {complaint.imagesBase64?.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
                      <FaImages className="mr-2" />{" "}
                      <span className="ms-2"> الصور المرفقة </span>(
                      {currentImageIndex + 1}/{complaint.imagesBase64.length})
                    </h4>
                    <div className="relative bg-white rounded-lg p-4 flex justify-center items-center">
                      <button
                        onClick={() => navigateImage("prev")}
                        className="p-2 rounded-full bg-white shadow hover:bg-gray-200 mr-2">
                        <FaGreaterThan />
                      </button>
                      <img
                        src={complaint.imagesBase64[currentImageIndex]}
                        alt="شكوى"
                        className="max-full object-contain rounded"
                      />
                      <button
                        onClick={() => navigateImage("next")}
                        className="p-2 rounded-full bg-white shadow hover:bg-gray-200 ml-2">
                        <FaLessThan />
                      </button>
                    </div>
                    <div className="flex justify-center mt-4">
                      {complaint.imagesBase64.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full mx-1 ${currentImageIndex === index ? "bg-blue" : "bg-darkTeal"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Video */}
                {complaint.videoUrl && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
                      <FaVideo className="mr-2" /> <span className="ms-2">الفيديو المرفق</span>
                    </h4>
                    <video
                      controls
                      className="w-full h-80 rounded-lg border border-gray-200"
                      poster={complaint.imagesBase64?.[0]}>
                      <source src={complaint.videoUrl} type="video/mp4" />
                      متصفحك لا يدعم تشغيل الفيديو
                    </video>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </section>
    </main>
  );
}

// Helper component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="mt-1 mr-3 text-blue-600 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-gray-800 text-base ms-2 font-normal">{label}</p>
      <p className="font-medium text-gray-800 mt-2">{value || "—"}</p>
    </div>
  </div>
);

export default ComplaintSearch;
