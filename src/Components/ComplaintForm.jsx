import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("الاسم مطلوب"),
  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("من فضلك أدخل بريدًا إلكترونيًا صحيحًا"),
  governorate: Yup.string().required("المحافظة مطلوبة"),
  ministry: Yup.string().required("الوزارة مطلوبة"),
  description: Yup.string().required("ادخال الوصف مطلوب"),
});

function ComplaintForm() {
  const [newComplaintId, setNewComplaintId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      governorate: "",
      ministry: "",
      description: "",
      imageBase64: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const complaintId = Math.floor(Math.random() * 1000000).toString();

      try {
        await addDoc(collection(db, "complaints"), {
          name: values.name,
          email: values.email,
          governorate: values.governorate,
          ministry: values.ministry,
          description: values.description,
          imageBase64: values.imageBase64 || null,
          createdAt: new Date(),
          status: "قيد المعالجة",
          complaintId: complaintId,
        });

        setNewComplaintId(complaintId);
        setShowModal(true);
        toast.success("تم إرسال الشكوى بنجاح");
        resetForm();
      } catch (error) {
        console.error("خطأ أثناء إرسال الشكوى:", error);
        toast.error("حدث خطأ أثناء إرسال الشكوى.");
      }

      setSubmitting(false);
    },
  });

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        formik.setFieldValue("imageBase64", base64String);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  return (
    <>
      <Navbar />

      <section className="flex items-center justify-center flex-col min-h-screen px-4 py-20 bg-background">
        <div className="w-full max-w-2xl p-8 rounded-2xl shadow-lg bg-white mt-8">
          <h1 className="text-3xl font-bold mb-6 text-darkTeal text-center">
            قدم شكوتك
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* الاسم */}
            <div>
              <label htmlFor="name" className="block text-blue font-medium mb-1">
                الاسم
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="من فضلك ادخل الاسم"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-blue font-medium mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="من فضلك ادخل بريدك الالكتروني"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>

            {/* المحافظة */}
            <div>
              <label className="block font-medium text-blue mb-1">
                اختر المحافظة
              </label>
              <select
                id="governorate"
                name="governorate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.governorate}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option disabled value="">
                  اختر المحافظة
                </option>
                {[
                  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية",
                  "القليوبية", "الغربية", "المنوفية", "البحيرة", "كفر الشيخ",
                  "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "شمال سيناء",
                  "جنوب سيناء", "بني سويف", "الفيوم", "المنيا", "أسيوط",
                  "سوهاج", "قنا", "الأقصر", "أسوان", "الوادي الجديد",
                  "مطروح", "البحر الأحمر"
                ].map((gov) => (
                  <option key={gov}>{gov}</option>
                ))}
              </select>
              {formik.touched.governorate && formik.errors.governorate && (
                <div className="text-red-500 text-sm">{formik.errors.governorate}</div>
              )}
            </div>

            {/* الوزارة */}
            <div>
              <label className="block font-medium text-blue mb-1">
                اختر الوزارة المختصة
              </label>
              <select
                id="ministry"
                name="ministry"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ministry}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option disabled value="">
                  اختر الوزارة
                </option>
                {[
                  "وزارة الصحة", "وزارة التعليم", "وزارة الداخلية", "وزارة التموين",
                  "وزارة الكهرباء والطاقة", "وزارة النقل", "وزارة البيئة",
                  "وزارة التضامن الاجتماعي", "وزارة الاتصالات وتكنولوجيا المعلومات",
                  "وزارة الإسكان والمرافق", "وزارة القوى العاملة", "وزارة الثقافة",
                  "وزارة التنمية المحلية", "وزارة العدل", "وزارة المالية"
                ].map((ministry) => (
                  <option key={ministry}>{ministry}</option>
                ))}
              </select>
              {formik.touched.ministry && formik.errors.ministry && (
                <div className="text-red-500 text-sm">{formik.errors.ministry}</div>
              )}
            </div>

            {/* وصف الشكوى */}
            <div>
              <label htmlFor="description" className="block text-blue font-medium mb-1">
                وصف الشكوى
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="من فضلك ادخل تفاصيل الشكوى هنا..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
            </div>

            {/* الصورة */}
            <div>
              <label htmlFor="image" className="block text-blue font-medium mb-2">
                (اختياري) ارفق صورة الشكوى
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full bg-background border border-gray-300"
              />
              {formik.values.imageBase64 && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">
                    الصورة المرفقة جاهزة للإرسال
                  </p>
                </div>
              )}
            </div>

            {/* button send complaint */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue text-white font-semibold rounded-lg hover:bg-blue/90 transition duration-300"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "جارٍ الإرسال..." : "إرسال الشكوى"}
            </button>
          </form>
        </div>

        {/* متابعة شكوى */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 text-md">
            هل قدمت شكوى بالفعل؟
            <Link
              to="/traceComplaint"
              className="inline-block ml-2 text-blue font-semibold hover:underline"
            >
              اضغط هنا لمتابعة الشكوى
            </Link>
          </p>
        </div>
      </section>

      {/* Modal display ComplaintId*/}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-green-700 mb-4">شكراً لك!</h2>
            <p className="text-gray-800 mb-2">تم إرسال الشكوى بنجاح.</p>
            <p className="text-blue-600 font-bold mb-4">
              رقم الشكوى الخاص بك: <span className="text-xl">{newComplaintId}</span>
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-5 py-1 bg-blue text-white rounded-md hover:bg-blue/90"
            >
              تم
            </button>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </>
  );
}

export default ComplaintForm;
