import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero_img.gif";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

export default function HeroSection() {
  return (
    <div className="hero bg-white min-h-screen relative">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <figure>
          <img src={heroImg} alt="hero image" className="hidden lg:flex " />
        </figure>
        <div className="line pr-5">
          <h3 className="text-3xl font-bold mb-4"> مرحباً بك في</h3>
          <h1 className="text-5xl font-bold leading-tight">
            منصة <span className="text-blue">شكوتك</span> لتقديم الشكاوى
            والمقترحات
          </h1>
          <p className="py-6 text-lg">
            سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة
            بلحظة من أي مكان.
          </p>
          <Link
            to="/submitComplaint"
            className="btn button text-white px-6 text-lg hover:-translate-y-1 transition-all duration-300 hover:bg-darkTeal"
          >
            تقديم شكوى
          </Link>
        </div>
      </div>
      <a href="#features">
        <MdKeyboardDoubleArrowDown className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue animate-bounce text-4xl" />
      </a>
    </div>
  );
}
