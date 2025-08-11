import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getComplaintsByDepartment } from "../../services/complaintsService";
import { useAuth } from "../../../contexts/AuthContext";

export default function Home({ ministry }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { userData } = useAuth();

  useEffect(() => {
    setLoading(true);

    // استخدام بيانات المستخدم لجلب الشكاوى المناسبة
    if (userData?.accountType === "department" && userData?.governorate) {
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
    } else if (userData?.accountType === "governorate") {
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

  // 📌 الإحصائيات
  const total = data.length;
  const inProgress = data.filter((c) => c.status === "جارى الحل").length;
  const solved = data.filter((c) => c.status === "تم الحل").length;
  const rejected = data.filter((c) => c.status === "مرفوضة").length;

  // 📌 تحضير بيانات Line Chart حسب الشهر
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const monthlyCounts = Array(12).fill(0);
  data.forEach((c) => {
    if (c.createdAt?.toDate) {
      const month = c.createdAt.toDate().getMonth();
      monthlyCounts[month]++;
    }
  });

  const lineChart = {
    series: [{ name: "عدد الشكاوى", data: monthlyCounts }],
    options: {
      chart: { type: "line", height: 300, toolbar: { show: false } },
      xaxis: { categories: months },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#4361EE"],
    },
  };

  // 📌 Column Chart حسب الوزارة
  const ministries = [...new Set(data.map((c) => c.ministry))];
  const ministryCounts = ministries.map(
    (m) => data.filter((c) => c.ministry === m).length
  );

  const columnChart = {
    series: [{ name: "عدد الشكاوى", data: ministryCounts }],
    options: {
      chart: { type: "bar", height: 300, toolbar: { show: false } },
      xaxis: { categories: ministries },
      colors: ["#00BFA6"],
    },
  };

  // 📌 آخر 5 شكاوى
  const latestComplaints = [...data]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);

  return (
    <div className="p-5 space-y-6">
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

      {/* Line Chart */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">عدد الشكاوى عبر الشهور</h3>
        <ReactApexChart
          options={lineChart.options}
          series={lineChart.series}
          type="line"
          height={300}
        />
      </div>

      {/* Column Chart */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">توزيع الشكاوى حسب الوزارة</h3>
        <ReactApexChart
          options={columnChart.options}
          series={columnChart.series}
          type="bar"
          height={300}
        />
      </div>

      {/* آخر 5 شكاوى */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">آخر 5 شكاوى</h3>
        <table className="table w-full text-center">
          <thead>
            <tr>
              <th>المواطن</th>
              <th>الوزارة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {latestComplaints.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.ministry}</td>
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
