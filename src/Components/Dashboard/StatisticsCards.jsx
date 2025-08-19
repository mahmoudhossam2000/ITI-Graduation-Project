import React from "react";
import {
  FaChartBar,
  FaEye,
  FaCheck,
  FaTimes,
  FaExchangeAlt,
} from "react-icons/fa";

const StatisticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
};

export default StatisticsCards;
