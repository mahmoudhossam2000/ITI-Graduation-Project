import React, { forwardRef } from "react";
import {
  FaBuilding,
  FaEye,
  FaImage,
  FaMapMarkerAlt,
  FaUser,
  FaVideo,
} from "react-icons/fa";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const ComplaintDetails = forwardRef(({ complaint }, ref) => {
  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    const dateObj = dateValue?.toDate ? dateValue.toDate() : dateValue;
    try {
      return new Date(dateObj).toLocaleString("ar-EG");
    } catch (e) {
      return "-";
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

  return (
    <dialog ref={ref} className="modal md:modal-middle w-6xl ">
      <div className="modal-box">
        {complaint ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaEye className="ml-2 text-blue-600" />
                تفاصيل الشكوى #{complaint.complaintId}
              </h2>
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
                      <span className="text-gray-900">{complaint.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        البريد الإلكتروني:
                      </span>
                      <span className="text-gray-900">{complaint.email}</span>
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
                        {complaint.governorate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        الإدارة:
                      </span>
                      <span className="text-gray-900">
                        {complaint.administration}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        الحالة:
                      </span>
                      <div className="mr-2">
                        {getStatusBadge(complaint.status || "قيد المعالجة")}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 ml-2">
                        تاريخ الإنشاء:
                      </span>
                      <span className="text-gray-900">
                        {formatDateTime(complaint.createdAt)}
                      </span>
                    </div>
                    {complaint.updatedAt && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 ml-2">
                          آخر تحديث:
                        </span>
                        <span className="text-gray-900">
                          {formatDateTime(complaint.updatedAt)}
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
                  {complaint.location ? (
                    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                      {(() => {
                        const [lat, lng] = complaint.location
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
                    {complaint.description}
                  </p>
                </div>

                {/* Image */}
                {complaint.imageBase64 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaImage className="ml-2 text-blue-600" />
                      الصورة المرفقة
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={complaint.imageBase64}
                        alt="صورة الشكوى"
                        className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Video */}
                {complaint.videoUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaVideo className="ml-2 text-red-600" />
                      الفيديو المرفق
                    </h3>
                    <div className="flex justify-center">
                      <video
                        src={complaint.videoUrl}
                        controls
                        className="max-w-full h-auto rounded-lg shadow-md max-h-64"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>جاري تحميل البيانات...</p>
        )}
        <form method="dialog" className="modal-action">
          <button className="btn">إغلاق</button>
        </form>
      </div>
    </dialog>
  );
});

export default ComplaintDetails;
