import { Outlet } from "react-router-dom";
import NavbardAuthority from "./NavbardAuthority";
import Sidebar from "./Sidebar";
import Topbar from "../../Topbar";

export default function Layout() {
  return (
    <div className="flex">
      <div className="w-3/12 border-e h-screen fixed right-0 top-0">
        <Sidebar />
      </div>

      <div className="w-9/12 mr-[25%]">
        {/* <NavbardAuthority /> */}
        <Topbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
