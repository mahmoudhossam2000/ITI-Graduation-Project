import { useState } from "react";
import IconArrow from "../../ui/icons/icon-arrow";

// createdAt
// July 5, 2025 at 6:10:18 PM UTC+3
// description
// "مكتبه مصر العامه بيقفلوا بدرى جدا"

// governorate
// "القاهرة"
// image
// null
// ministry
// "وزارة الثقافة"
// name
// "محمود"
// nationalId
// 29802091300042

const initialData = [
  {
    id: 1,
    citizen: "أحمد محمد",
    title: "مستشفى الأحرار التعليمي",
    describtion: "مشكلة في المستشفى",
    status: "قيد المراجعة",
    priority: "عادية",
    date: "2025-06-29 12:34",
  },
  {
    id: 2,
    citizen: "محمد علي",
    title: "جامعة الزقازيق",
    describtion: "انقطاع الكهرباء",
    status: "تم الحل",
    priority: "عالية",
    date: "2025-06-28 09:12",
  },
  {
    id: 3,
    citizen: "سارة حسن",
    title: "معاشات الزقازيق ",
    describtion: "تأخير صرف المعاش",
    status: "مرفوضة",
    priority: "عادية",
    date: "2025-06-27 11:45",
  },
];

// const statusColors = {
//   "قيد المراجعة": "text-blue-600 bg-blue-100 px-2 py-1 rounded",
//   "جارى الحل": "text-yellow-600 bg-yellow-100 px-2 py-1 rounded",
//   "تم الحل": "text-green-600 bg-green-100 px-2 py-1 rounded",
//   مرفوضة: "text-red-600 bg-red-100 px-2 py-1 rounded",
// };

const statusColors = {
  "قيد المراجعة":
    "badge bg-gradient-to-r from-slate-300 to-slate-400 text-white px-5 py-1 rounded shadow",
  "جارى الحل":
    "badge bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded shadow",
  "تم الحل":
    "badge bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded shadow",
  مرفوضة:
    "badge bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded shadow",
};

const PAGE_SIZE = 5;

export default function ComplaintsTable({ complaints, onDetails, onAction }) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // count pages in pagination
  const totalPages = Math.ceil(complaints.length / PAGE_SIZE);

  // filter will coming soon
  const filteredData = complaints.filter((c) =>
    c.complaintId?.toString().includes(searchTerm.trim())
  );

  // sorting table
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // pagination
  const currentPageData = sortedData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // handlers for sorting data
  const handleSort = (key) => {
    setPage(1);
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "asc",
        };
      }
    });
  };

  return (
    <div className="overflow-x-auto m-5 p-4 shadow-md space-y-4">
      <div className="flex justify-end items-center mb-4">
        <input
          type="text"
          placeholder=" ابحث برقم الشكوى"
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="input input-bordered input-sm w-64"
        />
      </div>
      <table className="table table-pin-rows table-pin-cols min-w-full text-base text-center">
        <thead>
          <tr className="bg-primary text-blue">
            <th>#</th>
            <th>
              <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("name")}
              >
                المواطن <IconArrow sortConfig={sortConfig} columnKey="name" />
              </button>
            </th>
            <th>
              <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("governorate")}
              >
                العنوان{" "}
                <IconArrow sortConfig={sortConfig} columnKey="governorate" />
              </button>
            </th>
            <th>
              <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("status")}
              >
                الحالة <IconArrow sortConfig={sortConfig} columnKey="status" />
              </button>
            </th>
            <th>
              <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("priority")}
              >
                رقم الشكوى
                <IconArrow sortConfig={sortConfig} columnKey="priority" />
              </button>
            </th>
            <th>
              <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("createdAt")}
              >
                التاريخ{" "}
                <IconArrow sortConfig={sortConfig} columnKey="createdAt" />
              </button>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((complaint, i) => (
            <tr key={complaint.id} className="hover">
              <th className="py-3 px-2">{(page - 1) * PAGE_SIZE + (i + 1)}</th>
              <td className="py-3 px-2">{complaint.name}</td>
              <td className="py-3 px-2">{complaint.governorate}</td>
              <td className="py-3 px-2">
                <span
                  className={
                    statusColors[complaint.status?.trim()] ||
                    "badge bg-gray-300 text-gray-700 px-3 py-1 rounded"
                  }
                >
                  {complaint.status}
                </span>
              </td>
              <td className="py-3 px-2">{complaint.complaintId}</td>
              <td className="py-3 px-2">
                {" "}
                {complaint.createdAt?.toDate
                  ? complaint.createdAt.toDate().toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}{" "}
              </td>
              <td className="flex gap-2 justify-center">
                <button
                  onClick={() => onDetails(complaint)}
                  className="btn px-2 py-1 text-xs rounded bg-blue text-white hover:bg-blue-700"
                >
                  التفاصيل
                </button>

                {/* <button
                  onClick={() => onAction(complaint)}
                  className="btn px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                >
                  إجراء
                </button> */}
              </td>
              <td className="py-3 px-2"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-5">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          السابق
        </button>
        <span className="text-sm">
          الصفحة {page} من {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          التالي
        </button>
      </div>
    </div>
  );
}
