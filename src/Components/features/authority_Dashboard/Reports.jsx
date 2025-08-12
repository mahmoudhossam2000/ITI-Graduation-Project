import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getComplaintsByDepartment } from "../../services/complaintsService";
import { useAuth } from "../../../contexts/AuthContext";

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
      getComplaintsByDepartment(null, userData.governorate)
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
      getComplaintsByDepartment(ministry)
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
  }, [ministry, userData]);

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
  const inProgress = filteredData.filter(
    (c) => c.status === "جارى الحل"
  ).length;
  const solved = filteredData.filter((c) => c.status === "تم الحل").length;
  const rejected = filteredData.filter((c) => c.status === "مرفوضة").length;

  // Pie Chart لحالات الشكاوى
  const pieChart = {
    series: [inProgress, solved, rejected],
    options: {
      labels: ["جارى الحل", "تم الحل", "مرفوضة"],
      colors: ["#FACC15", "#22C55E", "#EF4444"],
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
        <div className="card bg-primary text-white p-4 rounded-xl shadow">
          <p className="text-lg">إجمالي الشكاوى</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>
        <div className="card bg-yellow-500 text-white p-4 rounded-xl shadow">
          <p className="text-lg">قيد الحل</p>
          <h2 className="text-3xl font-bold">{inProgress}</h2>
        </div>
        <div className="card bg-green-500 text-white p-4 rounded-xl shadow">
          <p className="text-lg">تم الحل</p>
          <h2 className="text-3xl font-bold">{solved}</h2>
        </div>
        <div className="card bg-red-500 text-white p-4 rounded-xl shadow">
          <p className="text-lg">مرفوضة</p>
          <h2 className="text-3xl font-bold">{rejected}</h2>
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
