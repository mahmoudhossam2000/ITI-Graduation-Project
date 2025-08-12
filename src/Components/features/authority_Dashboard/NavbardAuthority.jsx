import React from "react";
import Sidebar from "./Sidebar";
import IconNotification from "../../ui/icons/icon-notification";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

function NavbardAuthority() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className="navbar bg-base-100 shadow-sm items-start border-b sticky">
      <div className="flex-1">
        <div className="flex ">
          <div>
            <a className="btn btn-ghost text-xl">شكوتك</a>
          </div>
          {/* <Sidebar /> */}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="بـــحـــث..."
          className="input outline-0 w-24 md:w-auto rounded-full"
        />
        <IconNotification />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavbardAuthority;
