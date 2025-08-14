import React from "react";

export default function DepartmentsComplaintsStats({ departments }) {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl shadow">
      <h3 className="mb-4 text-lg font-bold">🏢 الإدارات التابعة للوزارة</h3>

      {departments.length > 0 ? (
        <table className="table w-full text-center">
          <thead>
            <tr>
              <th>الإدارة</th>
              <th>عدد الشكاوى</th>
              <th>قيد الحل</th>
              <th>تم الحل</th>
              <th>مرفوضة</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => (
              <tr key={i}>
                <td>{dept.name}</td>
                <td>{dept.total}</td>
                <td>{dept.inProgress}</td>
                <td>{dept.solved}</td>
                <td>{dept.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <p>لا توجد إدارات لعرضها</p>
          </div>
        </div>
      )}
    </div>
  );
}
