import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAuth } from "../../../../contexts/AuthContext";

export default function ChartsSection({ data }) {
  const hasData = data && data.length > 0;
  const { userData } = useAuth();

  const [isDark] = useState(false);
  const [isRtl] = useState(true);

  function buildChartsData(complaints) {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "ابريل",
      "مايو",
      "يونيو",
      "يوليو",
      "اغسطس",
      "سبتمبر",
      "اكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    // --- Line Chart: complaints by months ---
    const monthlyCounts = Array(12).fill(0);
    complaints.forEach((c) => {
      if (c.createdAt?.seconds) {
        const date = new Date(c.createdAt.seconds * 1000);
        monthlyCounts[date.getMonth()]++;
      }
    });

    const lineChart = {
      series: [{ name: "عدد الشكاوى", data: monthlyCounts }],
      options: {
        chart: { type: "line", toolbar: { show: false } },
        stroke: { curve: "smooth" },
        xaxis: { categories: months },
        yaxis: { opposite: isRtl },
        tooltip: { theme: isDark ? "dark" : "light" },
      },
    };

    // --- Column Chart: complaints by administration ---
    const adminMap = {};
    complaints.forEach((c) => {
      const admin = c.administration || "غير محدد";
      if (!adminMap[admin]) {
        adminMap[admin] = {
          pending: 0,
          inProgress: 0,
          completed: 0,
          rejected: 0,
        };
      }

      if (c.status === "قيد المعالجة") adminMap[admin].pending++;
      else if (c.status === "جارى الحل") adminMap[admin].inProgress++;
      else if (c.status === "تم الحل") adminMap[admin].completed++;
      else if (c.status === "مرفوضة") adminMap[admin].rejected++;
    });

    const ministries = Object.keys(adminMap);
    const stats = Object.values(adminMap);

    const columnChart = {
      series: [
        { name: "قيد المعالجة", data: stats.map((d) => d.pending) },
        { name: "جارى المعالجة", data: stats.map((d) => d.inProgress) },
        { name: "تم الحل", data: stats.map((d) => d.completed) },
        { name: "مرفوضة", data: stats.map((d) => d.rejected) },
      ],
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        colors: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "25%",
            endingShape: "rounded",
          },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        grid: { borderColor: isDark ? "#191e3a" : "#e0e6ed" },
        xaxis: {
          categories: ministries,
          axisBorder: { color: isDark ? "#191e3a" : "#e0e6ed" },
        },
        yaxis: { opposite: isRtl, labels: { offsetX: isRtl ? -10 : 0 } },
        tooltip: { theme: isDark ? "dark" : "light" },
      },
    };

    // --- Donut Chart: complaints by governorate ---
    const donutMap = {};
    if (userData?.role === "governorate") {
      // ✅ Governorate login: group by administration
      complaints.forEach((c) => {
        const admin = c.administration || "غير محدد";
        donutMap[admin] = (donutMap[admin] || 0) + 1;
      });
    } else {
      // ✅ Other roles: group by governorate
      complaints.forEach((c) => {
        const gov = c.governorate || "غير محدد";
        donutMap[gov] = (donutMap[gov] || 0) + 1;
      });
    }

    const donutChart = {
      series: Object.values(donutMap),
      options: {
        chart: { type: "donut" },
        labels: Object.keys(donutMap),
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        legend: { position: "bottom" },
        tooltip: { theme: isDark ? "dark" : "light" },
      },
    };

    // --- Stacked Column Chart: complaints by governorate + status ---
    const governorateStatusMap = {};
    complaints.forEach((c) => {
      const gov = c.governorate || "غير محدد";
      if (!governorateStatusMap[gov]) {
        governorateStatusMap[gov] = {
          pending: 0,
          inProgress: 0,
          completed: 0,
          rejected: 0,
        };
      }

      if (c.status === "قيد المعالجة") governorateStatusMap[gov].pending++;
      else if (c.status === "جارى الحل") governorateStatusMap[gov].inProgress++;
      else if (c.status === "تم الحل") governorateStatusMap[gov].completed++;
      else if (c.status === "مرفوضة") governorateStatusMap[gov].rejected++;
    });

    const governorates = Object.keys(governorateStatusMap);
    const govStats = Object.values(governorateStatusMap);

    const stackedColumnChart = {
      series: [
        { name: "قيد المعالجة", data: govStats.map((d) => d.pending) },
        { name: "جارى المعالجة", data: govStats.map((d) => d.inProgress) },
        { name: "تم الحل", data: govStats.map((d) => d.completed) },
        { name: "مرفوضة", data: govStats.map((d) => d.rejected) },
      ],
      options: {
        chart: { type: "bar", stacked: true, toolbar: { show: false } },
        colors: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"], // ✅ Same colors for consistency
        plotOptions: { bar: { horizontal: false, borderRadius: 6 } },
        dataLabels: { enabled: false },
        xaxis: { categories: governorates },
        yaxis: { opposite: isRtl },
        legend: { position: "bottom" },
        tooltip: { theme: isDark ? "dark" : "light" },
      },
    };

    return { lineChart, columnChart, donutChart, stackedColumnChart };
  }

  const { lineChart, columnChart, donutChart, stackedColumnChart } =
    buildChartsData(data);

  console.log(userData.role);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Line Chart */}
      <ChartCard
        title="📊 عدد الشكاوى عبر الشهور"
        chart={lineChart}
        type="line"
        hasData={hasData}
      />

      {/* Column Chart */}
      {(userData.role === "governorate" || userData.role === "department") && (
        <ChartCard
          title={
            userData?.role === "governorate"
              ? "📈  حالات الشكاوى حسب الإدارة "
              : "📈   توزيع حالات الشكاوى"
          }
          chart={columnChart}
          type="bar"
          hasData={hasData}
        />
      )}
      {/* Donut Chart */}
      {(userData.role === "ministry" || userData.role === "governorate") && (
        <ChartCard
          title={
            userData?.role === "governorate"
              ? "📊 توزيع الشكاوى حسب الإدارات"
              : "📊 توزيع الشكاوى حسب المحافظات"
          }
          chart={donutChart}
          type="donut"
          hasData={hasData}
        />
      )}

      {/* ✅ New Stacked Column Chart */}
      {userData.role === "ministry" && (
        <ChartCard
          title="🏙️ توزيع الحالات داخل كل محافظة"
          chart={stackedColumnChart}
          type="bar"
          hasData={hasData}
        />
      )}
    </div>
  );
}

// ✅ Reusable component for each chart
function ChartCard({ title, chart, type, hasData }) {
  return (
    <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      {hasData ? (
        <ReactApexChart
          options={chart.options}
          series={chart.series}
          type={type}
          height={300}
        />
      ) : (
        <NoData message="لا توجد بيانات متاحة لعرض الرسم البياني" />
      )}
    </div>
  );
}

function NoData({ message }) {
  return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-2">📉</div>
        <p>{message}</p>
      </div>
    </div>
  );
}
