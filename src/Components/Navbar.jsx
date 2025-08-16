import React, { useEffect, useState } from "react";
import { MdLogout, MdPerson } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";
import { LuHistory } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import LogoImg from "../assets/logo.png";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaUserAlt } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-0 transition-all shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <span className="h-10 border-none bg-white text-sm flex items-center">
            <img
              src={LogoImg}
              alt="logo image"
              className="w-32 h-auto object-contain"
            />
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="text-blue hover:border-b-2 hover:font-semibold hover:border-blue px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors mx-4"
            >
              <AiFillHome /> الرئيسية
            </Link>
            <Link
              to="/submitComplaint"
              className="text-blue hover:border-b-2 hover:font-semibold hover:border-blue px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors mx-4"
            >
              <TfiWrite /> الشكاوي
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/complaintHistory"
                  className="text-blue hover:border-b-2 hover:font-semibold hover:border-blue px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors mx-4"
                >
                  <LuHistory size={18} /> سجلات الشكاوي
                </Link>

                <Menu as="div" className="relative inline-block">
                  <MenuButton className="w-10 h-10 flex justify-center items-center rounded-md bg-white text-darkTeal shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-0">
                    <FaUserAlt size={18} color="#27548A" />
                  </MenuButton>

                  <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl border border-[#ccc] overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-700">
                        إعدادات الحساب
                      </h3>
                    </div>
                    <div className="py-2 flex flex-col space-y-1">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-darkTeal hover:bg-gray-100 transition-colors"
                        >
                          <MdPerson size={18} /> الملف الشخصي
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-right transition-colors"
                        >
                          <MdLogout size={18} /> تسجيل الخروج
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>

                {/* <div className="relative">
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className={`relative p-2 rounded-full hover:bg-gray-100 transition-all ${
                      unreadCount > 0 ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    <IoNotificationsOutline size={22} color="#27548A" />
                    {unreadCount > 0 && (
                      <span
                        className={`absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                          unreadCount > 0 ? "animate-pulse" : ""
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notifications-container absolute left-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">
                          الإشعارات
                        </h3>
                      </div>
                      <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                              onClick={() => {
                                markAsRead(notification.id);
                                navigate(
                                  `/complaintDetails/${notification.complaintId}`
                                );
                                setShowNotifications(false);
                              }}
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                {notification.message}
                                <span
                                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                    notification.status === "resolved"
                                      ? "bg-green-100 text-green-800"
                                      : notification.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {getStatusText(notification.status)}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp.toLocaleString("ar-EG")}
                              </p>
                            </li>
                          ))
                        ) : (
                          <li className="p-4 text-center text-sm text-gray-500">
                            لا توجد إشعارات جديدة
                          </li>
                        )}
                      </ul>
                      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => navigate("/complaintHistory")}
                        >
                          عرض جميع الإشعارات
                        </button>
                      </div>
                    </div>
                  )}
                </div> */}
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-blue text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-darkTeal transition-all shadow-md hover:shadow-lg"
              >
                <TiUserAdd size={18} /> سجل الآن
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              <AiFillHome className="text-blue" size={18} /> الرئيسية
            </Link>
            <Link
              to="/submitComplaint"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              <TfiWrite className="text-blue" size={18} /> الشكاوي
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <MdPerson className="text-blue" size={18} /> الملف الشخصي
                </Link>
                <Link
                  to="/complaintHistory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <LuHistory className="text-blue" size={18} /> سجلات الشكاوي
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-500 flex items-center gap-2 transition-colors"
                >
                  <MdLogout /> تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue text-white flex items-center gap-2 justify-center"
              >
                <TiUserAdd /> سجل الآن
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
