// components/dashboard/LastComplaintsSection.jsx
import React from "react";

export default function LastComplaintsSection({ complaints }) {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">📋 آخر 5 شكاوى</h2>

      {complaints.length > 0 ? (
        <table className="table w-full text-center">
          <thead>
            <tr>
              <th>المواطن</th>
              <th>الإدارة</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.administration}</td>
                <td>
                  {c.createdAt?.toDate
                    ? c.createdAt.toDate().toLocaleDateString("ar-EG")
                    : ""}
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      c.status === "تم الحل"
                        ? "bg-green-100 text-green-800"
                        : c.status === "قيد المعالجة"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">📭</div>
            <p>لا توجد شكاوى متاحة لعرضها</p>
          </div>
        </div>
      )}
    </div>
  );
}
