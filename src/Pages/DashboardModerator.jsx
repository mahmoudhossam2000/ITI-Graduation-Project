import React from "react";
import OverviewStats from "../Components/Moderator/OverviewStats";
import Topbar from "../Components/Topbar";

const DashboardModerator = () => {
  return (
    <>
      <Topbar />
      <main className=" p-6 bg-gray-100">
        <h1 className="text-4xl font-bold mb-12 text-center">
          لوحة تحكم المشرف
        </h1>
        <OverviewStats />
      </main>
    </>
  );
};

export default DashboardModerator;
