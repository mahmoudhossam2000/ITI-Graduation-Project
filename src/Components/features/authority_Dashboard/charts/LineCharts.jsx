import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function LineChart({ isDark = false }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const dir = document.documentElement.getAttribute("dir");
    setIsRtl(dir === "rtl");
  }, []);

  const lineChart = {
    series: [
      {
        name: "Sales",
        data: [45, 55, 75, 25, 45, 110],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      colors: ["#4361EE"],
      tooltip: {
        marker: {
          show: false,
        },
        y: {
          formatter(number) {
            return "$" + number;
          },
        },
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
        axisBorder: {
          color: isDark ? "#191e3a" : "#e0e6ed",
        },
      },
      yaxis: {
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -20 : 0,
        },
      },
      grid: {
        borderColor: isDark ? "#191e3a" : "#e0e6ed",
      },
    },
  };

  return (
    <div className="rounded-lg bg-white dark:bg-black p-4">
      {isMounted && (
        <ReactApexChart
          series={lineChart.series}
          options={lineChart.options}
          type="line"
          height={300}
          width="100%"
        />
      )}
    </div>
  );
}

export default LineChart;
