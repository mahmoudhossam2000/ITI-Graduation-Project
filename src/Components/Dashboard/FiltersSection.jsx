import React from "react";
import { FaFilter, FaBuilding } from "react-icons/fa";

const FiltersSection = ({
  showFilters,
  setShowFilters,
  selectedDepartment,
  setSelectedDepartment,
  filterLoading,
  setFilterLoading,
  getAvailableDepartments,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaFilter className="ml-2 text-blue-600" />
          فلاتر البحث
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBuilding className="inline ml-2" />
              الإدارة
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={filterLoading}
            >
              <option value="">جميع الإدارات</option>
              {getAvailableDepartments().map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDepartment("");
                setFilterLoading(true);
                setTimeout(() => setFilterLoading(false), 100);
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={filterLoading}
            >
              {filterLoading ? "جاري..." : "إعادة تعيين الفلاتر"}
            </button>
          </div>

          {filterLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
