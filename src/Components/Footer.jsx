import React from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export default function Footer() {
  return (
    <>
      <footer className="bg-darkTeal text-white py-10">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 animate-fade-in">
          {/* about us*/}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-mustard">من نحن</h3>
            <p className="text-base leading-loose text-gray-200">
              منصة شكوى تسهّل على المواطنين تقديم الشكاوى ومتابعتها بطريقة ذكية،
              وتوصيلها للجهات المختصة.
            </p>
          </div>

          {/* links*/}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-mustard">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <a className="hover:underline" href="#">
                  <MdKeyboardDoubleArrowLeft className="arrow-icon" />
                  <span>الرئيسية</span>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  <MdKeyboardDoubleArrowLeft className="arrow-icon" />{" "}
                  <span>تقديم شكوى</span>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  <MdKeyboardDoubleArrowLeft className="arrow-icon" />{" "}
                  <span>الأسئلة الشائعة</span>
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  <MdKeyboardDoubleArrowLeft className="arrow-icon" />{" "}
                  <span>سياسة الخصوصية</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-mustard">تواصل معنا</h3>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="الاسم الكامل"
                className="input input-bordered w-full text-stone-950 text-base bg-background"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="input input-bordered w-full text-stone-950 text-base bg-background"
              />
              <textarea
                className="textarea textarea-bordered w-full text-stone-950 text-base bg-background"
                placeholder="اكتب رسالتك"
                rows="3"
              ></textarea>
              <button className="btn border-blue w-full bg-blue">إرسال</button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center border-t border-gray-600 pt-4 text-sm text-gray-400">
          جميع الحقوق محفوظة © 2025 - شكوتك
        </div>
      </footer>
    </>
  );
}
