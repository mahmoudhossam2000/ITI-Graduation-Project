import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { FaRegCheckCircle, FaMapMarkerAlt, FaUpload, FaTimes } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// map
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  location: Yup.string().required("الموقع مطلوب"),
});

async function checkForAbuse(text) {
  try {
    const response = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${
        import.meta.env.VITE_API_KEY
      }`,
      {
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
    const toxicityScore =
      data.attributeScores.TOXICITY?.summaryScore?.value || 0;
    const profanityScore =
      data.attributeScores.PROFANITY?.summaryScore?.value || 0;

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
    const response = await fetch("https://api.ipify.org?format=json");
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
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [user, setUser] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  function LocationPicker({ setFieldValue }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setFieldValue("location", `${e.latlng.lat},${e.latlng.lng}`);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  }

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

  const uploadVideoToCloudinary = async (file) => {
    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "complaintsVideo");
    formData.append("resource_type", "video");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dt9nt97m4/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("خطأ أثناء رفع الفيديو:", err);
      return null;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 20 * 1024 * 1024) {
      toast.error("حجم الفيديو يجب أن يكون أقل من 20MB");
      return;
    }

    setVideoFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    } else {
      setVideoPreview("");
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    setVideoUrl("");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      governorate: "",
      administration: "",
      description: "",
      imageBase64: "",
      location: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (user) {
        const isBanned = await checkForAbuseAndBan(
          user.uid,
          values.email,
          values.description
        );
        if (isBanned) {
          setSubmitting(false);
          setIsBanned(true);
          return;
        }
      } else {
        const isAbusive = await checkForAbuse(values.description);
        if (isAbusive) {
          toast.error(
            "عذرًا، تحتوي شكواك على لغة غير لائقة. يرجى مراجعة المحتوى."
          );
          setSubmitting(false);
          return;
        }
      }

      // Upload video if exists
      let uploadedVideoUrl = "";
      if (videoFile) {
        uploadedVideoUrl = await uploadVideoToCloudinary(videoFile);
        if (!uploadedVideoUrl) {
          toast.error("فشل تحميل الفيديو");
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
          location: values.location,
          videoUrl: uploadedVideoUrl || null,
        });

        setNewComplaintId(complaintId);
        setShowModal(true);
        toast.success("تم إرسال الشكوى بنجاح");
        resetForm();
        setVideoFile(null);
        setVideoPreview("");
        setVideoUrl("");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">حسابك محظور</h2>
          <p className="text-gray-700 mb-6">
            عذرًا، لا يمكنك تقديم شكاوى جديدة لأن حسابك محظور بسبب انتهاك شروط
            الاستخدام.
          </p>
          <Link
            to="/"
            className="text-blue hover:text-blue-800 font-medium transition duration-300 underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <Navbar />
      <ToastContainer rtl position="top-center" autoClose={5000} />

      <main className="container mx-auto px-4 py-10">
        
        {/* complaint content */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-darkTeal mb-2">
                تقديم شكوى جديدة
              </h1>
              <p className="text-gray-600">
                املأ النموذج أدناه لتقديم شكواك وسنقوم بمتابعتها
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* الصف الأول: الاسم والبريد الإلكتروني */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="أدخل اسمك بالكامل"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent bg-background`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`bg-background w-full px-4 py-3 rounded-lg border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* الصف الثاني: المحافظة والوزارة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="governorate"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    المحافظة <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="governorate"
                    name="governorate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.governorate}
                    className={`bg-background w-full px-4 py-3 rounded-lg border ${
                      formik.touched.governorate && formik.errors.governorate
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent`}>
                    <option value="">اختر المحافظة</option>
                    {[
                      "القاهرة",
                      "الجيزة",
                      "الإسكندرية",
                      "الدقهلية",
                      "الشرقية",
                      "القليوبية",
                      "الغربية",
                      "المنوفية",
                      "البحيرة",
                      "كفر الشيخ",
                      "دمياط",
                      "بورسعيد",
                      "الإسماعيلية",
                      "السويس",
                      "شمال سيناء",
                      "جنوب سيناء",
                      "بني سويف",
                      "الفيوم",
                      "المنيا",
                      "أسيوط",
                      "سوهاج",
                      "قنا",
                      "الأقصر",
                      "أسوان",
                      "الوادي الجديد",
                      "مطروح",
                      "البحر الأحمر",
                    ].map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  {formik.touched.governorate && formik.errors.governorate && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.governorate}
                    </p>
                  )}
                </div>
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
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  تفاصيل الشكوى <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  placeholder="صف شكواك بالتفصيل (20 حرف على الأقل)..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  className={`bg-background w-full px-4 py-3 rounded-lg border ${
                    formik.touched.description && formik.errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* الخريطة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موقع الشكوى <span className="text-red-500">*</span>
                </label>
                <div className="rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={[30.0444, 31.2357]}
                    zoom={10}
                    style={{ height: "300px", width: "100%" }}
                    className="z-0">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker setFieldValue={formik.setFieldValue} />
                  </MapContainer>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="ml-1" />
                  {formik.values.location ? (
                    <span>إحداثيات الموقع: {formik.values.location}</span>
                  ) : (
                    <span>اضغط على الخريطة لتحديد موقع الشكوى</span>
                  )}
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.location}
                  </p>
                )}
              </div>

              {/* رفع الصورة */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  إرفاق صورة (اختياري)
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-gray-400 text-2xl mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">اضغط لرفع ملف</span> أو
                        اسحبه هنا
                      </p>
                      <p className="text-xs text-gray-500">
                        الصور فقط (بحد أقصى 2MB)
                      </p>
                    </div>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formik.values.imageBase64 && (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <FaRegCheckCircle className="ml-1" />
                    <span>تم تحميل الصورة بنجاح</span>
                  </div>
                )}
              </div>

              {/* رفع الفيديو */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إرفاق فيديو (اختياري)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <span>اختر ملف فيديو</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                  {isUploadingVideo && (
                    <div className="text-blue-600">جاري رفع الفيديو...</div>
                  )}
                </div>
                {videoPreview && (
                  <div className="mt-2 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="max-h-40 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  الحد الأقصى لحجم الفيديو: 20MB
                </p>
              </div>

              {/* زر الإرسال */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || isUploadingVideo}
                  className="bg-blue w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                  {formik.isSubmitting || isUploadingVideo ? (
                    <>
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال الشكوى"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* trace complaint status*/}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            لديك شكوى مسبقاً؟{" "}
            <Link
              to="/traceComplaint"
              className="text-blue hover:text-blue-800 font-semibold transition duration-300 text-base">
              اضغط هنا لمتابعة الشكوى
            </Link>
          </p>
        </div>
      </main>

      {/* modal display complaintID */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
            <div className="p-4 text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <FaRegCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تم إرسال الشكوى بنجاح
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-4">
                  سنقوم بمراجعة شكواك والرد عليها في أقرب وقت ممكن
                </p>
                <p className="text-lg font-bold text-blue-600">
                  رقم الشكوى: {newComplaintId}
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300 bg-blue">
                  اغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintForm;