import React from "react";
import { IoIosPhonePortrait } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaChartLine } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import TiltCard from "../TiltCard";

export default function PlateFormFeatures() {
  const features = [
    {
      icon: <IoIosPhonePortrait size={25} className="me-2 text-blue" />,
      title: "سهولة الاستخدام",
      subTitle: "واجهة بسيطة وسلسة لأي مستخدم",
    },
    {
      icon: <HiDocumentArrowUp size={25} className="me-2 text-blue"/>,
      title: "إرفق مستنداتك بسهولة",
      subTitle: "أضف صور أو ملفات داعمة مع الشكوى لتوضيح المشكلة بشكل أفضل.",
    },
    {
      icon: <IoIosNotifications size={25} className="me-2 text-blue" />,
      title: "متابعة الشكوى",
      subTitle: "تابع حالة الشكوى خطوة بخطوة حتى يتم حلها",
    },
    {
      icon: <FaChartLine size={25} className="me-2 text-blue" />,
      title: "تقارير واحصائيات",
      subTitle: "لوحات تحكم متكامله للجهات الحكوميه مع تحليلات ذكيه",
    },
    {
      icon: <FaUsers size={25} className="me-2 text-blue" />,
      title: "تعدد المستخدمين",
      subTitle: "نظام متكامل للمواطنين والجهات الحكوميه والمشرفين",
    },
    {
      icon: <FaShieldAlt size={25} className="me-2 text-blue" />,
      title: "امان وحمايه",
      subTitle: "بيانات محميه وفق اعلي معايير الامان والخصوصيه",
    },
  ];
  return (
    <>
      <section className="py-24 bg-lightGray" id="features">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-darkTeal mb-4">
            مميزات منصتنا
          </h2>
          <p className="text-darkTeal text-xl">
            كل ما تحتاجه لتقديم شكوى فعّالة وسريعة
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 lg:px-20">
          {features.map((feature) => (
            <TiltCard className="card bg-white shadow-md p-5 border-l-4 border-blue">
              <div className="flex items-center mb-2">
                {feature.icon}
                <h3 className="font-bold text-lg text-blue ml-2">
                  {feature.title}
                </h3>
              </div>
              <p className="text-darkTeal mt-2 text-lg">{feature.subTitle}</p>
            </TiltCard>
          ))}
        </div>
      </section>
    </>
  );
}
