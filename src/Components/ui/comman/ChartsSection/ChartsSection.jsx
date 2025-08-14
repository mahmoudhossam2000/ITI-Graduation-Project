import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  buildDeptBarChart,
  buildMonthlyLineChart,
} from "../../../../utils/charts";

export default function ChartsSection({
  lineChart,
  columnChart,
  data,
  ministries,
}) {
  const hasData = data.length > 0;

  //   const lineChart = hasData ? buildMonthlyLineChart(complaints) : null;
  //   const deptBarChart = hasData ? buildDeptBarChart(complaints) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
