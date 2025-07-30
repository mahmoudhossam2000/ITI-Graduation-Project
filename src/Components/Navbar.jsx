import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { MdLogout, MdPerson } from "react-icons/md";
=======
import { MdLogin, MdLogout, MdPerson } from "react-icons/md";
>>>>>>> f96f087e309cab92dc8a89830948e06dc32f5d6c
import { TiUserAdd } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";
import { LuHistory } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import LogoImg from "../assets/logo.png";
<<<<<<< HEAD

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
=======
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
>>>>>>> f96f087e309cab92dc8a89830948e06dc32f5d6c
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
    <>
      <div
<<<<<<< HEAD
        className={"fixed top-0 left-0 w-full z-50 p-0 transition-all shadow-md bg-white"}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
          <div className="flex items-center justify-between h-16">
=======
        className={`navbar bg-white shadow-sm fixed top-0 left-0 w-full z-50 ${
          scrolled ? "bg-white shadow" : "bg-white"
        }`}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className=" menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow pb-3"
            >
              <li>
                <Link
                  to="/"
                  className="text-base flex items-center gap-1 focus:outline-transparent focus:ring-0 active:ring-0 focus:bg-transparent active:bg-transparent font-medium"
                >
                  <AiFillHome size={18} className="text-blue" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/submitComplaint"
                  className="text-base flex items-start gap-1 focus:outline-transparent focus:ring-0 active:ring-0 focus:bg-transparent active:bg-transparent font-medium"
                >
                  <TfiWrite size={18} className="text-blue" /> الشكاوي
                </Link>
              </li>
              {currentUser ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="btn btn-sm btn-outline text-sm flex items-center gap-1 mb-2 hover:bg-blue hover:!text-white"
                    >
                      <MdPerson size={18} />
                      الملف الشخصي
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm text-sm flex items-center gap-1 btn-outline w-full hover:bg-red-500 hover:!text-white"
                    >
                      <MdLogout size={18} />
                      تسجيل الخروج
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signup"
                      className="btn btn-sm text-sm flex items-center gap-1 button"
                    >
                      <TiUserAdd size={18} />
                      سجل الآن
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
>>>>>>> f96f087e309cab92dc8a89830948e06dc32f5d6c

          {/* Logo */}
          <span className="h-10 border-none bg-white text-sm flex items-center">
            <img
              src={LogoImg}
              alt="logo image"
              className="w-32 h-auto object-contain"
            />
          </span>
        
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/"
                className="text-blue hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors"
              >
                <AiFillHome className="text-blue" /> الرئيسية
              </Link>
              <Link
                to="/submitComplaint"
                className="text-blue hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors"
              >
                <TfiWrite className="text-blue" /> الشكاوي
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 border border-blue-500 text-blue rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-500 hover:bg-blue hover:text-white transition-colors"
                  >
                    <MdPerson size={18}/> الملف الشخصي
                  </Link>
                  <Link
                    to="/complaintHistory"
                    className="px-4 py-2 border border-blue-500 text-blue rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-500 hover:bg-blue hover:text-white transition-colors"
                  >
                    <LuHistory size={18}/> سجلات الشكاوي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-red-500 bg-red-500 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-red-600 transition-colors"
                  >
                    <MdLogout size={18}/> تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-blue text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-darkTeal transition-all shadow-md hover:shadow-lg"
                >
                  <TiUserAdd size={18}/> سجل الآن
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

<<<<<<< HEAD
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <AiFillHome className="text-blue" size={18}/> الرئيسية
              </Link>
              <Link
                to="/submitComplaint"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <TfiWrite className="text-blue" size={18}/> الشكاوي
=======
        <div className="navbar-end space-x-2 hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-sm">
            <li>
              <Link
                to="/"
                className="text-base flex items-center gap-1 focus:outline-transparent focus:ring-0 active:ring-0 focus:bg-transparent active:bg-transparent font-medium"
              >
                <AiFillHome size={18} className="text-blue" />
                الرئيسية
>>>>>>> f96f087e309cab92dc8a89830948e06dc32f5d6c
              </Link>

<<<<<<< HEAD
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <MdPerson className="text-blue" size={18}/> الملف الشخصي
                  </Link>
                  <Link
                    to="/complaintHistory"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <LuHistory className="text-blue" size={18}/> سجلات الشكاوي
                  </Link>
                  <button
                    onClick={handleLogout}
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
=======
            <li>
              <Link
                to="/submitComplaint"
                className="text-base flex items-center gap-1 focus:outline-transparent focus:ring-0 active:ring-0 focus:bg-transparent active:bg-transparent font-medium ps-4"
              >
                <TfiWrite size={18} className="text-blue" /> الشكاوي
              </Link>
            </li>
          </ul>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="btn btn-sm btn-outline border-blue text-sm flex items-center gap-1 hover:bg-blue hover:!text-white"
              >
                <MdPerson size={18} />
                الملف الشخصي
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm text-sm flex items-center gap-1 btn-outline hover:!bg-red-600 hover:!text-white"
              >
                <MdLogout size={18} />
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="btn btn-sm text-sm flex items-center gap-1 button"
              >
                <TiUserAdd size={18} />
                سجل الآن
              </Link>
            </div>
          )}
        </div>
>>>>>>> f96f087e309cab92dc8a89830948e06dc32f5d6c
      </div>
    </>
  );
}
