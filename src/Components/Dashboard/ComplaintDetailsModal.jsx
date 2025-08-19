import React from "react";
import {
  FaEye,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaImage,
  FaVideo,
  FaTimesCircle,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCog,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ComplaintDetailsModal = ({
  selectedComplaint,
  closeComplaintModal,
  formatDateTime,
  formatDate,
  getStatusBadge,
  userData,
  openComplaintAction,
  updateComplaintStatus,
  updatingStatus,
}) => {
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

              {/* Images */}
              {(selectedComplaint.imageBase64 || (selectedComplaint.imagesBase64 && selectedComplaint.imagesBase64.length > 0)) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaImage className="ml-2 text-blue-600" />
                    {selectedComplaint.imagesBase64 && selectedComplaint.imagesBase64.length > 1 ? 'الصور المرفقة' : 'الصورة المرفقة'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Handle single image (legacy) */}
                    {selectedComplaint.imageBase64 && (
                      <div className="flex justify-center">
                        <img
                          src={selectedComplaint.imageBase64}
                          alt="صورة الشكوى"
                          className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                        />
                      </div>
                    )}
                    {/* Handle multiple images (new format) */}
                    {selectedComplaint.imagesBase64 && selectedComplaint.imagesBase64.map((image, index) => (
                      <div key={index} className="flex justify-center">
                        <img
                          src={image}
                          alt={`صورة الشكوى ${index + 1}`}
                          className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                        />
                      </div>
                    ))}
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

export default ComplaintDetailsModal;
