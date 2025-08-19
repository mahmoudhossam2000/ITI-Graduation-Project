import React from "react";
import {
  FaEye,
  FaCog,
  FaImage,
  FaVideo,
  FaMapMarkedAlt,
} from "react-icons/fa";

const ComplaintsTable = ({
  filteredComplaints,
  selectedDepartment,
  userData,
  formatDate,
  getStatusBadge,
  openComplaintDetails,
  openComplaintAction,
}) => {
  return (
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
                      {(complaint.imageBase64 || (complaint.imagesBase64 && complaint.imagesBase64.length > 0)) && (
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
                        <button
                          onClick={() => openComplaintAction(complaint)}
                          className="text-orange-600 hover:text-orange-900 bg-orange-100 px-3 py-1 rounded text-xs flex items-center"
                        >
                          <FaCog className="ml-1" />
                          إجراء
                        </button>
                      )}
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
};

export default ComplaintsTable;
