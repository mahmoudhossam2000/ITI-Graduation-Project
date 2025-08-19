import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  getComplaintsByDepartment,
  getComplaintsForMinistry,
} from "../../services/complaintsService";
import { useAuth } from "../../../contexts/AuthContext";
import { FaCheck, FaEye, FaSpinner, FaTimes } from "react-icons/fa";

export default function Reports() {
  const { userData } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    setLoading(true);

    // استخدام بيانات المستخدم لجلب الشكاوى المناسبة
    if (userData?.role === "department" && userData?.governorate) {
      getComplaintsByDepartment(userData.department, userData.governorate)
        .then((complaints) => {
          setData(complaints);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("فشل تحميل البيانات");
          setLoading(false);
        });
    } else if (userData?.role === "governorate") {
      getComplaintsByDepartment(null, userData?.governorate)
        .then((complaints) => {
          setData(complaints);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("فشل تحميل البيانات");
          setLoading(false);
        });
    } else {
      // Fallback للخدمة القديمة
      getComplaintsForMinistry(userData?.ministry)
        .then((complaints) => {
          setData(complaints);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("فشل تحميل البيانات");
          setLoading(false);
        });
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // فلترة حسب التاريخ
  const filteredData = data.filter((c) => {
    const createdAt = c.createdAt?.toDate ? c.createdAt.toDate() : null;
    if (!createdAt) return false;

    if (dateRange.start && createdAt < new Date(dateRange.start)) return false;
    if (dateRange.end && createdAt > new Date(dateRange.end)) return false;

    return true;
  });

  // إحصائيات
  const total = filteredData.length;
  const pending = filteredData.filter(
    (c) => c.status === "قيد المعالجة"
  ).length;
  const inProgress = filteredData.filter(
    (c) => c.status === "جارى الحل"
  ).length;
  const solved = filteredData.filter((c) => c.status === "تم الحل").length;
  const rejected = filteredData.filter((c) => c.status === "مرفوضة").length;

  // Pie Chart لحالات الشكاوى
  const pieChart = {
    series: [pending, inProgress, solved, rejected],
    options: {
      labels: ["قيد المعالجة", "جارى الحل", "تم الحل", "مرفوضة"],
      colors: ["#94a3b8", "#FACC15", "#22C55E", "#EF4444"],
      chart: { type: "pie" },
    },
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div>
          <label className="block">من تاريخ:</label>
          <input
            type="date"
            className="input input-bordered"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block">إلى تاريخ:</label>
          <input
            type="date"
            className="input input-bordered"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaEye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
              <p className="text-2xl font-bold text-gray-900">{pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 ">
          <div className="flex items-center">
            <div className="p-2 bg-blue rounded-lg">
              <FaSpinner className="h-6 w-6 text-white animate-spin" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">جارى المعالجة</p>
              <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
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

      {/* Pie Chart */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">نسبة حالات الشكاوى</h3>
        <ReactApexChart
          options={pieChart.options}
          series={pieChart.series}
          type="pie"
          height={300}
        />
      </div>

      {/* جدول الشكاوى */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">تفاصيل الشكاوى</h3>
        <table className="table w-full text-center">
          <thead>
            <tr>
              <th>رقم الشكوى</th>
              <th>المواطن</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((c, i) => (
              <tr key={i}>
                <td>{c.complaintId || "-"}</td>
                <td>{c.name}</td>
                <td>{c.status}</td>
                <td>
                  {c.createdAt?.toDate
                    ? c.createdAt.toDate().toLocaleDateString("ar-EG")
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
