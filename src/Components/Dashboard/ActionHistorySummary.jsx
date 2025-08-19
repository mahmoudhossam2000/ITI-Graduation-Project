import React from "react";
import { FaChartBar } from "react-icons/fa";

const ActionHistorySummary = ({ complaints, formatDate, getStatusBadge }) => {
  return (
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
  );
};

export default ActionHistorySummary;
