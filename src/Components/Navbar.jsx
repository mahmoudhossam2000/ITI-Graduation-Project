import React, { useEffect, useState } from "react";
import { MdLogin } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";
import LogoImg from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`navbar bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "py-2 px-[2.5%]" : "py-0 px-3"
        }`}>
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
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
              className=" menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow pb-3">
              <li>
                <Link
                  to="/"
                  className="text-base flex items-center gap-1 font-medium  text-darkTeal hover:font-semibold">
                  <AiFillHome size={18} className="text-blue" />
                  الرئيسية
                </Link>
              </li>

              <li>
                <Link
                  to="/submitComplaint"
                  className="text-base flex items-center gap-1 font-medium ps-4 text-darkTeal hover:font-semibold">
                  <TfiWrite size={18} className="text-blue" /> الشكاوي
                </Link>
              </li>

              <li>
                <a className="btn btn-sm text-sm flex items-center gap-1 btn-outline bg-transparent text-blue border-blue mb-1 hover:bg-blue hover:text-white">
                  <MdLogin size={18} />
                  تسجيل الدخول
                </a>
              </li>

              <li>
                <a className="btn btn-sm text-sm flex items-center gap-1 btn-outline bg-blue text-white border-blue hover:bg-transparent hover:text-blue">
                  <TiUserAdd size={18} />
                  سجل الآن
                </a>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <span className="h-10 border-none bg-white text-sm flex items-center">
            <img
              src={LogoImg}
              alt="logo image"
              className="w-32 h-auto object-contain"
            />
          </span>
        </div>

        {/* lg screen */}
        <div className="navbar-end space-x-2 hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-sm flex items-center">
            <li>
              <Link
                to="/"
                className="text-base flex items-center gap-1 font-medium  text-darkTeal hover:font-semibold">
                <AiFillHome size={18} className="text-blue" />
                الرئيسية
              </Link>
            </li>

            <li>
              <Link
                to="/submitComplaint"
                className="text-base flex items-center gap-1 font-medium ps-4 text-darkTeal hover:font-semibold">
                <TfiWrite size={18} className="text-blue" /> الشكاوي
              </Link>
            </li>

            {/* auth buttons */}
            <li>
              <a className="btn btn-sm btn-outline border-blue text-sm flex items-center gap-1 mx-2 hover:bg-blue">
                <MdLogin size={18} />
                تسجيل الدخول
              </a>
            </li>

            <li>
              <a className="btn btn-sm text-sm flex items-center gap-1 button  hover:bg-transparent hover:text-blue">
                <TiUserAdd size={18} />
                سجل الآن
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
