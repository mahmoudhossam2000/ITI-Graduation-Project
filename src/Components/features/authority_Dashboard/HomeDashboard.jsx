import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  getComplaintsByDepartment,
  getComplaintsForMinistry,
} from "../../services/complaintsService";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardTabs from "../../ui/comman/DashboardTabs/DashboardTabs";

export default function HomeDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { userData } = useAuth();

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
      // Fallback for other users (regular users, admin, etc.)
      getComplaintsForMinistry(userData.ministry)
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
  const ministries = [...new Set(data.map((c) => c.administration))];

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
      {/* Header with Role Information */}
      <div className="bg-white dark:bg-black p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span className="font-medium">نوع المستخدم:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {userData?.role === "ministry" && "وزارة"}
            {userData?.role === "department" && "إدارة"}
            {userData?.role === "governorate" && "محافظة"}
            {userData?.role === "admin" && "مدير"}
            {userData?.role === "moderator" && "مشرف"}
            {!userData?.role && "مستخدم"}
          </span>
          {userData?.ministry && (
            <span className="text-gray-500">- {userData.ministry}</span>
          )}
          {userData?.department && (
            <span className="text-gray-500">- {userData.department}</span>
          )}
          {userData?.governorate && (
            <span className="text-gray-500">- {userData.governorate}</span>
          )}
        </div>
        <p className="text-gray-500 mt-2">
          {userData?.role === "ministry" && "عرض جميع الشكاوى في النظام"}
          {userData?.role === "department" && "عرض الشكاوى الخاصة بإدارتك"}
          {userData?.role === "governorate" && "عرض الشكاوى في محافظتك"}
          {userData?.role === "admin" && "إدارة النظام والشكاوى"}
          {userData?.role === "moderator" && "مراقبة وإدارة المستخدمين"}
        </p>
      </div>

      <DashboardTabs
        lineChart={lineChart}
        columnChart={columnChart}
        data={data}
        ministries={ministries}
      />

      {/* Line Chart */}
      {/* <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">عدد الشكاوى عبر الشهور</h3>
        {data.length > 0 ? (
          <ReactApexChart
            options={lineChart.options}
            series={lineChart.series}
            type="line"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>لا توجد بيانات متاحة لعرض الرسم البياني</p>
            </div>
          </div>
        )}
      </div> */}

      {/* Column Chart */}
      {/* <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">توزيع الشكاوى حسب الوزارة</h3>
        {data.length > 0 && ministries.length > 0 ? (
          <ReactApexChart
            options={columnChart.options}
            series={columnChart.series}
            type="bar"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>لا توجد بيانات متاحة لعرض الرسم البياني</p>
            </div>
          </div>
        )}
      </div> */}

      {/* آخر 5 شكاوى */}
    </div>
  );
}
