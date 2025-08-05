import React from "react";
import SidebarModerator from "./SidebarModerator";
import { Outlet } from "react-router-dom";

const ModeratorLayout = () => {
  return (
    <div>
      <SidebarModerator />
      
      {/* Main content */}
      <main className="mr-64 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ModeratorLayout;
