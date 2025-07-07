import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import heroImg from "../assets/hero_img.gif";
import department1 from "../assets/images/education.jpeg";
import department2 from "../assets/images/electricity.jpeg";
import department3 from "../assets/images/health.jpeg";
import department4 from "../assets/images/higher_education.jpeg";
import department5 from "../assets/images/housing.jpeg";
import department6 from "../assets/images/Interior.jpeg";
import department7 from "../assets/images/justice.jpeg";
import department8 from "../assets/images/supply.jpeg";
import department9 from "../assets/images/transport.jpeg";
import department10 from "../assets/images/water.png";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      {/* navbar */}
      <Navbar />

      {/* hero section */}
      <div className="card hero-content h-screen lg:h-auto lg:flex-row-reverse pt-40 m-auto">
        <figure>
          <img src={heroImg} alt="hero image" className="hidden lg:flex " />
        </figure>
        <div className="line">
          <h3 className="text-3xl font-bold mb-4"> مرحباً بك في</h3>
          <h1 className="text-5xl font-bold leading-tight">
            منصة <span className="text-blue">شكوتك</span> لتقديم الشكاوى
            والمقترحات
          </h1>
          <p className="py-6">
            سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة
            بلحظة من أي مكان.
          </p>
          <button className="btn button text-white px-6 py-5 text-base">
            <Link to="/submitComplaint">تقديم شكوي</Link>
          </button>
        </div>
      </div>

      {/* section two */}
      <section className="py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-darkTeal mb-4">
            مميزات منصتنا
          </h2>
          <p className="text-darkTeal text-lg">
            كل ما تحتاجه لتقديم شكوى فعّالة وسريعة
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 lg:px-20">
          <div className="card bg-background shadow-md p-5">
            <h3 className="font-bold text-lg text-blue mb-2">
              سهولة الاستخدام
            </h3>
            <p className="text-darkTeal">واجهة بسيطة وسلسة لأي مستخدم</p>
          </div>
          <div className="card bg-background shadow-md p-5">
            <h3 className="font-bold text-lg text-blue mb-2">
              إرفق مستنداتك بسهولة
            </h3>
            <p className="text-darkTeal">
              أضف صور أو ملفات داعمة مع الشكوى لتوضيح المشكلة بشكل أفضل.
            </p>
          </div>
          <div className="card bg-background shadow-md p-5">
            <h3 className="font-bold text-lg text-blue mb-2">متابعة الشكوى</h3>
            <p className="text-darkTeal">
              تابع حالة الشكوى خطوة بخطوة حتى يتم حلها
            </p>
          </div>
        </div>
      </section>

      {/*section three */}
      <section className="bg-body py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-darkTeal mb-4">
            نحافظ على خصوصيتك
          </h2>
          <p className="text-darkTeal mb-6 text-lg">
            بياناتك مشفرة ومحفوظة بأعلى معايير الأمان – لا تتم مشاركة معلوماتك
            مع أي جهة غير مصرح لها.
          </p>
          <div className="flex justify-center gap-4">
            <div className="badge badge-primary p-4 button">تشفير البيانات</div>
            <div className="badge badge-primary p-4 button">اتصال آمن</div>
            <div className="badge badge-primary p-4 button">خصوصية تامة</div>
          </div>
        </div>
      </section>

      {/*section four */}
      <section
        className="py-16 bg-blue-50 text-gray-800 px-6 md:px-20 bg-customBg"
        id="idea"
      >
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
            عن منصة شكوتك
          </h2>

          {/* problem & solve */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                المشكلة الأساسية
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                <li>
                  معاناة المواطنين من مشاكل مستمرة في الخدمات اليومية (مياه–
                  كهرباء– مستشفيات– مدارس– طرق...)
                </li>
                <li>عدم وجود نظام موحد لتقديم الشكاوى أو الاقتراحات</li>
                <li>عدم وجود وسيلة واضحة للمتابعة بعد تقديم الشكوى</li>
                <li>
                  الجهات الحكومية لا تمتلك أدوات لتحليل البيانات وتحسين الخدمات
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-green-600 mb-4">
                الحل المقترح
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                <li>
                  منصة رقمية تمكِّن المواطن من تقديم الشكاوى والاقتراحات بسهولة
                </li>
                <li>ربط تلقائي بين الشكوى والجهة المختصة حسب نوعها وموقعها</li>
                <li>إتاحة الردود من الجهات مع إشعارات ومتابعة الحالة</li>
                <li>
                  توفير لوحة تحكم (Dashboard) لكل من المستخدم، والجهة، والمشرف
                  العام
                </li>
              </ul>
            </div>
          </div>

          {/* Dashboard department */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
              مميزات لوحة التحكم الخاصة بالجهة
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-base leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>عرض شامل لكل الشكاوى الخاصة بالجهة</li>
                <li>إمكانية الرد المباشر على الشكاوى</li>
                <li>تحديث حالة الشكوى (جاري الحل– تم الحل– مغلقة)</li>
              </ul>
              <ul className="list-disc list-inside space-y-2">
                <li>فلاتر وتصنيفات حسب الفئة، الوقت، أو الحالة</li>
                <li>بحث سريع وسهل داخل الـ DataTable</li>
                <li>تقارير وتحليلات تساعد في تحسين الأداء العام</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/*bottom five*/}
      <section className="bottom-bar-wrapper position-relative py-10">
        <h2 className="text-4xl font-bold text-center pb-5  italic">
          الجهات المشاركة في المنصة
        </h2>
        <div className="bottom-bar d-flex mt-5">
          <img src={department1} alt="img" />
          <img src={department2} alt="img" />
          <img src={department3} alt="img" />
          <img src={department4} alt="img" />
          <img src={department5} alt="img" />
          <img src={department6} alt="img" />
          <img src={department7} alt="img" />
          <img src={department8} alt="img" />
          <img src={department9} alt="img" />
          <img src={department10} alt="img" />
          <img src={department1} alt="img" />
          <img src={department2} alt="img" />
          <img src={department3} alt="img" />
          <img src={department7} alt="img" />
          <img src={department8} alt="img" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
