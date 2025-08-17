import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function ChartsSection({ data }) {
  const hasData = data && data.length > 0;

  console.log(data.imagesBase64);

  // Mock isDark and isRtl (تقدر بعدين تجيبهم من Context)
  const [isDark] = useState(false);
  const [isRtl] = useState(true);

  // ✅ تحويل الداتا من الـ API للي محتاجه الـ charts
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

    // --- Line Chart: عدد الشكاوى بالشهور ---
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

    // --- Column Chart: توزيع الشكاوى حسب الإدارة ---
    const adminMap = {};
    complaints.forEach((c) => {
      const admin = c.administration || "غير محدد";
      if (!adminMap[admin]) {
        adminMap[admin] = { pending: 0, completed: 0, rejected: 0 };
      }

      if (c.status === "قيد المعالجة") adminMap[admin].pending++;
      else if (c.status === "تم الحل" || c.status === "تمت المعالجة")
        adminMap[admin].completed++;
      else if (c.status === "مرفوضة") adminMap[admin].rejected++;
    });

    const ministries = Object.keys(adminMap);
    const stats = Object.values(adminMap);

    const columnChart = {
      series: [
        { name: "قيد المعالجة", data: stats.map((d) => d.pending) },
        { name: "تمت المعالجة", data: stats.map((d) => d.completed) },
        { name: "مرفوضة", data: stats.map((d) => d.rejected) },
      ],
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        colors: ["#eab308", "#22c55e", "#ef4444"],
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
        yaxis: {
          opposite: isRtl,
          labels: { offsetX: isRtl ? -10 : 0 },
        },
        tooltip: {
          theme: isDark ? "dark" : "light",
          y: { formatter: (val) => val },
        },
      },
    };

    return { lineChart, columnChart };
  }

  const { lineChart, columnChart } = buildChartsData(data);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Line Chart */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">📊 عدد الشكاوى عبر الشهور</h3>
        {hasData ? (
          <ReactApexChart
            options={lineChart.options}
            series={lineChart.series}
            type="line"
            height={300}
          />
        ) : (
          <NoData message="لا توجد بيانات متاحة لعرض الرسم البياني" />
        )}
      </div>

      {/* Column Chart */}
      <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
        <h3 className="mb-3 text-lg font-bold">📈 توزيع الشكاوى حسب الإدارة</h3>
        {hasData ? (
          <ReactApexChart
            options={columnChart.options}
            series={columnChart.series}
            type="bar"
            height={300}
            width={"100%"}
            className="rounded-lg"
          />
        ) : (
          <NoData message="لا توجد بيانات متاحة لعرض الرسم البياني" />
        )}
      </div>
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
