import React from "react";

export default function FAQSection() {
  return (
    <div className="w-full max-w-4xl mx-auto my-14">
      <h2 className="text-3xl font-bold text-center mb-6 text-darkTeal">
        الأسئلة الشائعة
      </h2>

      <div className="space-y-4">
        {/* q&a 1 */}
        <div className="collapse collapse-arrow bg-white border border-gray-100 rounded-lg">
          <input type="radio" name="faq-accordion" defaultChecked />
          <div className="collapse-title font-semibold text-right text-lg text-gray-700">
            1. هل يمكنني تقديم شكوى دون تسجيل دخول؟
          </div>
          <div className="collapse-content text-right text-gray-600">
            <p className="mb-2">
              نعم! يمكنك تقديم شكوى <span className="font-medium">كضيف</span>{" "}
              دون تسجيل، وسيتم توليد{" "}
              <span className="font-medium">رقم متابعة فريد</span> للشكوى. احفظ
              هذا الرقم لمتابعة حالة شكواك لاحقًا عبر قسم "تتبع الشكوى".
            </p>
            <p className="text-blue-600 font-medium">
              ننصح بالتسجيل لحفظ جميع شكاويك في لوحة تحكم شخصية وتلقي إشعارات
              تلقائية بالتحديثات.
            </p>
          </div>
        </div>

        {/* q&a 2 */}
        <div className="collapse collapse-arrow bg-white border border-gray-100 rounded-lg">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold text-right text-lg text-gray-700">
            2. ما أنواع الملفات المسموح برفعها مع الشكوى؟
          </div>
          <div className="collapse-content text-right text-gray-600">
            <p className="mb-2">يمكنك إرفاق:</p>
            <ul className="list-disc pr-5 space-y-1">
              <li>
                الصور (<span className="font-mono">JPG, PNG</span>)
              </li>
              <li>
                مستندات (<span className="font-mono">PDF, Word</span>)
              </li>
              <li>
                ملفات صوتية (<span className="font-mono">MP3</span>)
              </li>
            </ul>
            <p className="mt-2">
              بحد أقصى <span className="font-medium">10MB</span> لكل ملف.
            </p>
          </div>
        </div>

        {/* q&a 3 */}
        <div className="collapse collapse-arrow bg-white border border-gray-100 rounded-lg">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold text-right text-lg text-gray-700">
            3. ماذا لو كانت الشكوى غير واضحة للجهة المختصة؟
          </div>
          <div className="collapse-content text-right text-gray-600">
            <p>ستصلك رسالة من الجهة تطلب توضيحًا إضافيًا عبر المنصة، ويمكنك:</p>
            <ul className="list-disc pr-5 mt-2 space-y-1">
              <li>تعديل الشكوى</li>
              <li>إضافة مستندات جديدة</li>
            </ul>
          </div>
        </div>

        {/* q&a 4 */}
        <div className="collapse collapse-arrow bg-white border border-gray-100 rounded-lg">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold text-right text-lg text-gray-700">
            4. هل يمكن للجهات رفض الشكوى؟
          </div>
          <div className="collapse-content text-right text-gray-600">
            <p className="font-medium mb-2">
              نعم، قد ترفض الجهة المختصة الشكوى في الحالات التالية:
            </p>
            <ul className="list-disc pr-5 space-y-1 mb-3">
              <li>ألفاظ غير لائقة أو مسيئة</li>
              <li>معلومات غير صحيحة أو مُضللة</li>
              <li>مشكلة خارج اختصاص الجهة</li>
            </ul>
            <p className="mb-2">
              سيتم إعلامك بالرفض مع ذكر السبب، ويمكنك في هذه الحالة:
            </p>
            <ul className="list-disc pr-5 space-y-1 mb-3">
              <li>
                تعديل الشكوى وإعادة إرسالها (إذا كانت المشكلة قابلة للتعديل)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
