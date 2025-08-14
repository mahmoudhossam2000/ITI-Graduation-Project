// utils/charts.js
// يحوّل Firestore Timestamp لأي Date عادي
const toJsDate = (ts) => {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000);
  const d = new Date(ts);
  return isNaN(d) ? null : d;
};

// خطي شهري لآخر 6 شهور
export function buildMonthlyLineChart(complaints) {
  const now = new Date();
  const buckets = new Map(); // key: 'YYYY-MM' → count

  // جهّز آخر 6 شهور
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    buckets.set(key, 0);
  }

  complaints.forEach((c) => {
    const d = toJsDate(c.createdAt);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key) + 1);
    }
  });

  const categories = Array.from(buckets.keys()).map((ym) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("ar-EG", {
      month: "short",
    });
  });

  const data = Array.from(buckets.values());

  return {
    options: {
      chart: { type: "line", toolbar: { show: false } },
      xaxis: { categories },
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: "smooth" },
    },
    series: [{ name: "عدد الشكاوى", data }],
  };
}

// عمودي حسب الإدارة (المديريات)
export function buildDeptBarChart(complaints) {
  const counts = {};
  complaints.forEach((c) => {
    const dept = c.administration || "غير مُحدد";
    counts[dept] = (counts[dept] ?? 0) + 1;
  });

  const categories = Object.keys(counts);
  const data = categories.map((k) => counts[k]);

  return {
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
      },
      dataLabels: { enabled: false },
      xaxis: { categories },
    },
    series: [{ name: "عدد الشكاوى", data }],
  };
}
