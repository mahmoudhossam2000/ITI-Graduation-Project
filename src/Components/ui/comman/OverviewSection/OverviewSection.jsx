// components/dashboard/OverviewSection.jsx
import React from "react";
import { FaChartBar, FaCheck, FaEye, FaTimes } from "react-icons/fa";

export default function OverviewSection({
  total,
  inProgress,
  solved,
  rejected,
  running,
}) {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">📊 نظرة عامة</h2>

      <div className="grid justify-center grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaChartBar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي الشكاوى
              </p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaEye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">جارى المعالجة</p>
              <p className="text-2xl font-bold text-gray-900">{running}</p>
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
              <p className="text-2xl font-bold text-gray-900">{solved}</p>
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
              <p className="text-2xl font-bold text-gray-900">{rejected}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// const getStatistics = () => {
//   const total = complaints.length;
//   const pending = complaints.filter((c) => c.status === "قيد المعالجة").length;
//   const resolved = complaints.filter((c) => c.status === "تم الحل").length;
//   const rejected = complaints.filter((c) => c.status === "مرفوضة").length;
//   const runing = complaints.filter((c) => c.status === "جارى الحل").length;

//   return { total, pending, resolved, rejected, runing };
// };

// const stats = getStatistics();

// if (loading) {
//   return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );
// }

// const StatisticsCards = () => (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//     {/* Role Indicator Card */}

//     <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
//       <div className="flex items-center">
//         <div className="p-2 bg-blue-100 rounded-lg">
//           <FaChartBar className="h-6 w-6 text-blue-600" />
//         </div>
//         <div className="mr-4">
//           <p className="text-sm font-medium text-gray-600">إجمالي الشكاوى</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
//       <div className="flex items-center">
//         <div className="p-2 bg-yellow-100 rounded-lg">
//           <FaEye className="h-6 w-6 text-yellow-600" />
//         </div>
//         <div className="mr-4">
//           <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
//       <div className="flex items-center">
//         <div className="p-2 bg-blue-100 rounded-lg">
//           <FaExchangeAlt className="h-6 w-6 text-blue-600" />
//         </div>
//         <div className="mr-4">
//           <p className="text-sm font-medium text-gray-600">جاري الحل</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.runing}</p>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
//       <div className="flex items-center">
//         <div className="p-2 bg-green-100 rounded-lg">
//           <FaCheck className="h-6 w-6 text-green-600" />
//         </div>
//         <div className="mr-4">
//           <p className="text-sm font-medium text-gray-600">تمت المعالجة</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
//       <div className="flex items-center">
//         <div className="p-2 bg-red-100 rounded-lg">
//           <FaTimes className="h-6 w-6 text-red-600" />
//         </div>
//         <div className="mr-4">
//           <p className="text-sm font-medium text-gray-600">مرفوضة</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
//         </div>
//       </div>
//     </div>
//   </div>
// );
