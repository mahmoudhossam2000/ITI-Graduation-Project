import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function ColumnChart({ isDark = false }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // detect dir
    const dir = document.documentElement.getAttribute("dir");
    setIsRtl(dir === "rtl");
  }, []);

  const columnChart = {
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "bar",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#805dca", "#e7515a"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      grid: {
        borderColor: isDark ? "#191e3a" : "#e0e6ed",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
        axisBorder: {
          color: isDark ? "#191e3a" : "#e0e6ed",
        },
      },
      yaxis: {
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -10 : 0,
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-lg bg-white dark:bg-black p-4">
      {isMounted && (
        <ReactApexChart
          series={columnChart.series}
          options={columnChart.options}
          type="bar"
          height={300}
          width="100%"
        />
      )}
    </div>
  );
}

export default ColumnChart;
