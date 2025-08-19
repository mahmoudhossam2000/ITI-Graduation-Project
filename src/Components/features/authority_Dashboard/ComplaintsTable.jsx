import { useState } from "react";
import IconArrow from "../../ui/icons/icon-arrow";
import { useAuth } from "../../../contexts/AuthContext";
import { FaCog, FaEye } from "react-icons/fa";
import { PAGE_SIZE, statusColors } from "../../constant/Constant";

export default function ComplaintsTable({ complaints, onDetails, onAction }) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { userData } = useAuth();

  //  Added: extract unique administrations from complaints
  const uniqueDepartment = [
    ...new Set(complaints.map((c) => c.administration)),
  ];

  // add dropdown based on status
  const uniqueStatus = [...new Set(complaints.map((c) => c.status))];

  // count pages in pagination

  //  Modified: filtering logic now checks both search term and selected admin

  const filteredData = complaints.filter((c) => {
    const matchesSearch = c.complaintId?.toString().includes(searchTerm.trim());
    const matchesDepartment = selectedDepartment
      ? c.administration === selectedDepartment
      : true;
    const matchesStatus = selectedStatus ? c.status === selectedStatus : true;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  // console.log(filteredData.length, "filtered complaints length");

  // const filteredData = complaints.filter((c) =>
  //   c.complaintId?.toString().includes(searchTerm.trim())
  // );

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
      <div className="flex justify-between items-center mb-4">
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
        <select
          value={selectedStatus}
          onChange={(e) => {
            setPage(1);
            setSelectedStatus(e.target.value);
          }}
          className="select select-bordered select-sm"
        >
          <option value="">كل الحالات</option>
          {uniqueStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {userData.role === "governorate" && (
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setPage(1);
              setSelectedDepartment(e.target.value);
            }}
            className="select select-bordered select-sm"
          >
            <option value="">كل الإدارات</option>
            {uniqueDepartment.map((admin) => (
              <option key={admin} value={admin}>
                {admin}
              </option>
            ))}
          </select>
        )}
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
              {/* <button
                className="flex gap-1 items-center"
                onClick={() => handleSort("status")}
              >
              </button> */}
              الحالة
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
                  className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded text-xs flex items-center"
                >
                  <FaEye className="ml-1" />
                  عرض
                </button>

                {userData.role === "department" && (
                  <button
                    onClick={() => onAction(complaint)}
                    className="text-orange-600 hover:text-orange-900 bg-orange-100 px-3 py-1 rounded text-xs flex items-center"
                  >
                    <FaCog className="ml-1" />
                    إجراء
                  </button>
                )}
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
