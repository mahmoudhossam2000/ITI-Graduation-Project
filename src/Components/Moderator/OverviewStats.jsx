import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Shield,
  User,
  UserCheck,
  UserX,
  Copy,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OverviewStats = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
    duplicateComplaints: 0,
    abusiveComplaints: 0,
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    complaintsByMinistry: [],
    newToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch complaints data
        const complaintsSnapshot = await getDocs(collection(db, "complaints"));
        const complaintsData = complaintsSnapshot.docs.map((doc) => doc.data());

        // Calculate today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate complaints stats
        const totalComplaints = complaintsData.length;
        const resolvedComplaints = complaintsData.filter(
          (c) => c.status === "تم الحل"
        ).length;
        const rejectedComplaints = complaintsData.filter(
          (c) => c.status === "مرفوضة"
        ).length;
        const duplicateComplaints = complaintsData.filter(
          (c) => c.isDuplicate
        ).length;
        const abusiveComplaints = complaintsData.filter(
          (c) => c.isAbusive
        ).length;
        const pendingComplaints = complaintsData.filter(
          (c) => c.status === "قيد الانتظار"
        ).length;
        const newToday = complaintsData.filter((c) => {
          const complaintDate = c.createdAt?.toDate();
          return complaintDate >= today;
        }).length;

        // Fetch users data
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => doc.data());

        // Calculate users stats
        const totalUsers = usersData.length;
        const bannedUsers = usersData.filter((u) => u.banned).length;
        const activeUsers = totalUsers - bannedUsers;

        // Calculate complaints by ministry
        const ministryCounts = complaintsData.reduce((acc, complaint) => {
          const ministry = complaint.ministry || "غير محدد";
          acc[ministry] = (acc[ministry] || 0) + 1;
          return acc;
        }, {});

        const complaintsByMinistry = Object.entries(ministryCounts)
          .map(([ministry, count]) => ({ ministry, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Set stats
        setStats({
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
          rejectedComplaints,
          duplicateComplaints,
          abusiveComplaints,
          totalUsers,
          activeUsers,
          bannedUsers,
          complaintsByMinistry,
          newToday,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkTeal"></div>
      </div>
    );
  }

  const StatCard = ({ icon, title, value, color, type }) => {
    const IconComponent = icon;
    const colorMap = {
      textMustard: "#27548A",
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-sm transition-all duration-300 w-full group">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 text-base font-medium mb-2">{title}</h3>
          <div
            className={`p-3 rounded-xl ${color?.bg || "bg-gray-50"} ${
              color?.text || "text-gray-500"
            } shadow-xs`}>
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        <p className="text-3xl font-bold text-darkTeal drop-shadow-sm mb-2">{value}</p>

        {type === "newToday" && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>نسبة من الإجمالي</span>
              <span>
                {stats.totalComplaints > 0
                  ? Math.round((value / stats.totalComplaints) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${
                    stats.totalComplaints > 0
                      ? Math.round((value / stats.totalComplaints) * 100)
                      : 0
                  }%`,
                  backgroundColor: colorMap[color] || "#183B4E",
                }}></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          icon={FileText}
          title="إجمالي الشكاوى"
          value={stats.totalComplaints}
          color="textBlue"
        />
        <StatCard
          title="شكاوى اليوم"
          value={stats.newToday}
          icon={TrendingUp}
          color="textMustard"
          type="newToday"
        />
        <StatCard
          icon={CheckCircle}
          title="شكاوى تم حلها"
          value={stats.resolvedComplaints}
          color={{ bg: "bg-green-50", text: "text-green-500" }}
        />
        <StatCard
          icon={AlertCircle}
          title="شكاوى مرفوضة"
          value={stats.rejectedComplaints}
          color={{ bg: "bg-red-50", text: "text-red-500" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-darkTeal mb-5">
            توزيع الشكاوى حسب النوع
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { type: "مكررة", count: stats.duplicateComplaints },
                  { type: "مسيئة", count: stats.abusiveComplaints },
                  { type: "مرفوضة", count: stats.rejectedComplaints },
                  { type: "تم حلها", count: stats.resolvedComplaints },
                ]}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20}}>
                <XAxis type="number" />
                <YAxis
                  dataKey="type"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#27548A"
                  radius={[0, 4, 4,0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <StatCard
            icon={User}
            title="إجمالي المستخدمين"
            value={stats.totalUsers}
            color={{ bg: "bg-indigo-50", text: "text-darkTeal" }}
          />
          <StatCard
            icon={UserCheck}
            title="مستخدمين نشطين"
            value={stats.activeUsers}
            color={{ bg: "bg-teal-50", text: "text-teal-500" }}
            trend={{
              value: `${Math.round(
                (stats.activeUsers / stats.totalUsers) * 100
              )}%`,
              color: "bg-teal-100 text-teal-800",
            }}
          />
          <StatCard
            icon={UserX}
            title="مستخدمين محظورين"
            value={stats.bannedUsers}
            color={{ bg: "bg-rose-50", text: "text-rose-500" }}
            trend={{
              value: `${Math.round(
                (stats.bannedUsers / stats.totalUsers) * 100
              )}%`,
              color: "bg-rose-100 text-rose-800",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          icon={Copy}
          title="شكاوى مكررة"
          value={stats.duplicateComplaints}
          color={{ bg: "bg-purple-50", text: "text-mustard" }}
          trend={{
            value: `${Math.round(
              (stats.duplicateComplaints / stats.totalComplaints) * 100
            )}%`,
            color: "bg-purple-100 text-mustard",
          }}
        />
        <StatCard
          icon={Shield}
          title="شكاوى مسيئة"
          value={stats.abusiveComplaints}
          color={{ bg: "bg-red-50", text: "text-red-500" }}
          trend={{
            value: `${Math.round(
              (stats.abusiveComplaints / stats.totalComplaints) * 100
            )}%`,
            color: "bg-red-100 text-red-800",
          }}
        />
      </div>
    </div>
  );
};

export default OverviewStats;
