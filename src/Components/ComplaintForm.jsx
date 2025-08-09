import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, db } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";


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
  administration: Yup.string().required("الإدارة المختصة مطلوبة"),
  description: Yup.string()
    .required("ادخال الوصف مطلوب")
    .min(20, "الوصف يجب أن يكون على الأقل 20 حرفًا"),
});

async function checkForAbuse(text) {
  try {
    const response = await fetch(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${import.meta.env.VITE_API_KEY}`,      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: { text },
          requestedAttributes: {
            TOXICITY: {},
            PROFANITY: {},
            THREAT: {},
            INSULT: {},
          },
          languages: ["ar"],
        }),
      }
    );
    
    const data = await response.json();
    const toxicityScore = data.attributeScores.TOXICITY?.summaryScore?.value || 0;
    const profanityScore = data.attributeScores.PROFANITY?.summaryScore?.value || 0;
    
    return toxicityScore > 0.7 || profanityScore > 0.7;
  } catch (error) {
    console.error("Error checking for abuse:", error);
    return false;
  }
}

async function banUserAfterAbuse(userId, email) {
  try {
    await addDoc(collection(db, "bannedUsers"), {
      userId,
      email,
      banDate: new Date(),
      reason: "إساءة متكررة في الشكاوى",
    });

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { banned: true });
    });

    toast.warning("تم حظر حسابك بسبب انتهاك شروط الاستخدام");
  } catch (error) {
    console.error("Error banning user:", error);
  }
}

async function checkForAbuseAndBan(userId, email, text) {
  const isAbusive = await checkForAbuse(text);
  
  if (isAbusive) {
    await addDoc(collection(db, "abuseAttempts"), {
      userId,
      email,
      content: text,
      timestamp: new Date(),
    });

    const attemptsRef = collection(db, "abuseAttempts");
    const q = query(attemptsRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    if (snapshot.size >= 3) {
      await banUserAfterAbuse(userId, email);
      return true;
    }
    
    return false;
  }
  
  return false;
}

async function logUserIp(userId) {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    await addDoc(collection(db, "userIps"), {
      userId,
      ip: data.ip,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error logging IP:", error);
  }
}

function ComplaintForm() {
  const [newComplaintId, setNewComplaintId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        logUserIp(currentUser.uid);
        
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          if (doc.data().banned) {
            setIsBanned(true);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      governorate: "",
      administration: "",
      description: "",
      imageBase64: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {

      if (user) {
        const isBanned = await checkForAbuseAndBan(user.uid, values.email, values.description);
        if (isBanned) {
          setSubmitting(false);
          setIsBanned(true);
          return;
        }
      } else {
        const isAbusive = await checkForAbuse(values.description);
        if (isAbusive) {
          toast.error("عذرًا، تحتوي شكواك على لغة غير لائقة. يرجى مراجعة المحتوى.");
          setSubmitting(false);
          return;
        }
      }

      const complaintId = Math.floor(Math.random() * 1000000).toString();

      try {
        await addDoc(collection(db, "complaints"), {
          name: values.name,
          email: values.email,
          governorate: values.governorate,
          administration: values.administration,
          description: values.description,
          imageBase64: values.imageBase64 || null,
          createdAt: new Date(),
          status: "قيد المعالجة",
          complaintId: complaintId,
          userId: user?.uid || null,
          isDuplicate: false,
          reviewed: false,
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
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }
    
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        formik.setFieldValue("imageBase64", base64String);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        toast.error("حدث خطأ أثناء تحميل الصورة");
      }
    }
  };

  if (isBanned) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">حسابك محظور</h2>
          <p className="text-gray-700 mb-6">
            عذرًا، لا يمكنك تقديم شكاوى جديدة لأن حسابك محظور بسبب انتهاك شروط الاستخدام.
          </p>
          <Link 
            to="/" 
            className="text-blue underline hover:text-darkTeal hover:font-medium"
          >
            العودة الي الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer rtl position="top-right" />

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

            {/* الإدارة المختصة */}
            <div>
              <label className="block font-medium text-blue mb-1">
                اختر الإدارة المختصة
              </label>
              <select
                id="administration"
                name="administration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.administration}
                className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option disabled value="">
                  اختر الإدارة المختصة
                </option>
                {[
                  "إدارة الكهرباء والطاقة",
                  "إدارة الغاز الطبيعي",
                  "إدارة الطرق والكباري",
                  "إدارة المرور",
                  "إدارة النقل والمواصلات العامة",
                  "مديرية الصحة",
                  "إدارة البيئة ومكافحة التلوث",
                  "مديرية التربية والتعليم",
                  "مديرية الإسكان والمرافق",
                  "إدارة التخطيط العمراني",
                  "إدارة الأراضي وأملاك الدولة",
                  "مديرية الأمن",
                  "إدارة الدفاع المدني والحريق",
                  "إدارة التموين والتجارة الداخلية",
                  "إدارة حماية المستهلك",
                  "إدارة الزراعة",
                  "إدارة الري والموارد المائية",
                  "إدارة الشباب والرياضة",
                  "إدارة الثقافة",
                  "إدارة السياحة والآثار"
                ].map((admin) => (
                  <option key={admin}>{admin}</option>
                ))}
              </select>
              {formik.touched.administration && formik.errors.administration && (
                <div className="text-red-500 text-sm">{formik.errors.administration}</div>
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
                (اختياري) ارفق صورة الشكوى (بحد أقصى 2MB)
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
            <h2 className="text-4xl font-semibold text-green-700 mb-4 flex justify-center"><FaRegCheckCircle /></h2>
            <p className="text-gray-800 mb-2">تم إرسال الشكوى بنجاح.</p>
            <p className="text-blue-600 font-bold mb-4">
              رقم الشكوى الخاص بك: <span className="text-xl">{newComplaintId}</span>
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-5 py-1 bg-blue text-white rounded-md hover:bg-blue/90"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ComplaintForm;