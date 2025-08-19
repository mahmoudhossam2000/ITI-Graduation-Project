import React, { useState, useEffect } from "react";
import { getComplaintsForMinistry } from "../../../services/complaintsService";
import OverviewSection from "../OverviewSection/OverviewSection";
import LastComplaintsSection from "../LastComplaintsSection/LastComplaintsSection";
import { useAuth } from "../../../../contexts/AuthContext";
import ChartsSection from "../ChartsSection/ChartsSection";

export default function DashboardTabs({
  lineChart,
  columnChart,
  ministries,
  data,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const [overviewData, setOverviewData] = useState(null);
  const [latestComplaints, setLatestComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const tabs = [
    { id: "overview", label: "📊 نظرة عامة" },
    { id: "last", label: "📋 آخر الشكاوى" },
    { id: "charts", label: "📈 الرسوم البيانية" },
  ];

  // تحميل البيانات حسب التبويب
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (activeTab === "overview") {
        const total = data.length;
        const inProgress = data.filter(
          (c) => c.status === "قيد المعالجة"
        ).length;
        const running = data.filter((c) => c.status === "جارى الحل").length;
        const solved = data.filter((c) => c.status === "تم الحل").length;
        const rejected = data.filter((c) => c.status === "مرفوضة").length;
        setOverviewData({ total, inProgress, solved, rejected, running });
      }

      if (activeTab === "last") {
        const complaints = await getComplaintsForMinistry(userData.ministry);
        const sorted = complaints
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
          .slice(0, 5);
        setLatestComplaints(sorted);
      }

      // الرسوم البيانية ممكن نضيف لها تحميل مخصص بعدين

      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

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

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-3 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center min-h-40">
            <span className="loading loading-spinner loading-lg text-blue"></span>
          </div>
        ) : (
          <>
            {activeTab === "overview" && overviewData && (
              <OverviewSection {...overviewData} />
            )}

            {activeTab === "last" && (
              <LastComplaintsSection complaints={latestComplaints} />
            )}

            {activeTab === "charts" && (
              <ChartsSection
                lineChart={lineChart}
                columnChart={columnChart}
                data={data}
                ministries={ministries}
              />
            )}
          </>
        )}
      </div>
      {/* <GovernoratesMap userData={userData} /> */}
      {/* <UrgentAlertsSection /> */}
    </div>
  );
}
