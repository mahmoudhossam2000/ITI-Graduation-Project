import React from "react";

export default function HowWork() {
  const steps = [
    { number: "1", title: "تقديم الشكوى", desc: "قم بتسجيل الدخول وملء نموذج الشكوى مع إرفاق أي مستندات" },
    { number: "2", title: "توجيه الشكوى", desc: "يتم توجيه الشكوى تلقائياً للجهة المختصة حسب نوعها وموقعها" },
    { number: "3", title: "متابعة الحالة", desc: "تستلم الجهة الشكوى وتبدأ في معالجتها وتحديث حالتها" },
    { number: "4", title: "إشعار الحل", desc: "تصلك إشعارات بكل تحديث حتى يتم حل الشكوى وإغلاقها" },
  ];

  return (
    <section className="bg-white text-cream py-16 px-6 lg:px-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 text-darkTeal">كيف تعمل المنصة؟</h2>
        <p className="text-lg text-darkTeal">خطوات بسيطة لتوصيل صوتك بفعالية</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-cream text-darkTeal rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mustard text-white text-2xl font-bold flex items-center justify-center">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
