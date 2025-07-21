import React from "react";

export default function PrivacySection() {
  return (
    <section className="bg-body py-14 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-darkTeal mb-4">
          نحافظ على خصوصيتك
        </h2>
        <p className="text-darkTeal mb-6 text-xl">
          بياناتك مشفرة ومحفوظة بأعلى معايير الأمان – لا تتم مشاركة معلوماتك مع أي جهة غير مصرح لها.
        </p>
        <div className="flex justify-center gap-4">
          <div className="badge badge-primary p-4 button">تشفير البيانات</div>
          <div className="badge badge-primary p-4 button">اتصال آمن</div>
          <div className="badge badge-primary p-4 button">خصوصية تامة</div>
        </div>
      </div>
    </section>
  );
}
