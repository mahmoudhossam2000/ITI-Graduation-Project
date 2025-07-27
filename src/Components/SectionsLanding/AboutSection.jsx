import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { PiLightbulbFilament } from "react-icons/pi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { motion } from "framer-motion";

export default function AboutSection() {
  // animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="py-16 bg-blue-50 text-gray-800 px-6 md:px-20 bg-cream"
      id="idea"
    >
      <motion.div
        className="max-w-6xl mx-auto space-y-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* عنوان القسم */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-blue-900 text-center"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          عن منصة شكوتك
        </motion.h2>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <motion.div
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 will-change-transform"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
              <span className="bg-red-200 rounded-full p-2 me-3">
                <FaTriangleExclamation size={20} />
              </span>
              المشكلة الأساسية
            </h3>
            <ul className="space-y-4 text-gray-700 text-base leading-relaxed">
              {[
                "معاناة المواطنين من مشاكل مستمرة في الخدمات اليومية (مياه– كهرباء– طرق...)",
                "عدم وجود نظام موحد لتقديم الشكاوى أو الاقتراحات",
                "عدم وجود وسيلة واضحة للمتابعة بعد تقديم الشكوى",
                "الجهات الحكومية لا تمتلك أدوات لتحليل البيانات وتحسين الخدمات",
              ].map((problem, index) => (
                <li className="flex items-start" key={index}>
                  <BsExclamationCircle
                    size={20}
                    className="mt-1 text-red-800 me-3"
                  />
                  {problem}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 will-change-transform"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
              <span className="bg-green-200 rounded-full p-2 me-3">
                <PiLightbulbFilament size={22} />
              </span>
              الحل المقترح
            </h3>
            <ul className="space-y-4 text-gray-700 text-base leading-relaxed">
              {[
                "منصة رقمية تمكِّن المواطن من تقديم الشكاوى والاقتراحات بسهولة",
                "ربط تلقائي بين الشكوى والجهة المختصة حسب نوعها وموقعها",
                "إتاحة الردود من الجهات مع إشعارات ومتابعة الحالة",
                "توفير لوحة تحكم لكل من المستخدم، والجهة، والمشرف العام",
              ].map((solution, index) => (
                <li className="flex items-start" key={index}>
                  <IoMdCheckmarkCircleOutline
                    size={20}
                    className="text-green-600 me-3"
                  />
                  {solution}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Dashboard */}
        <motion.div
          className="dashboardDep bg-white p-6 md:p-8 lg:p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 will-change-transform"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-2xl font-bold text-blue-700 mb-6 text-center">
            مميزات لوحة التحكم الخاصة بالجهة
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 leading-relaxed list-disc list-inside">
            <li>عرض شامل لكل الشكاوى الخاصة بالجهة</li>
            <li>إمكانية الرد المباشر على الشكاوى</li>
            <li>تحديث حالة الشكوى (جاري الحل – تم الحل – مغلقة)</li>
            <li>فلاتر وتصنيفات حسب الفئة، الوقت، أو الحالة</li>
            <li>بحث سريع وسهل داخل الـ DataTable</li>
            <li>تقارير وتحليلات تساعد في تحسين الأداء العام</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
