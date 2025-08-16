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
import {
  FaRegCheckCircle,
  FaMapMarkerAlt,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
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

// حدود المحافظات المصرية (إحداثيات تقريبية)
const governorateBounds = {
  القاهرة: {
    minLat: 29.8,
    maxLat: 30.2,
    minLng: 31.0,
    maxLng: 31.5,
  },
  الجيزة: {
    minLat: 29.5,
    maxLat: 30.2,
    minLng: 30.8,
    maxLng: 31.5,
  },
  الإسكندرية: {
    minLat: 31.0,
    maxLat: 31.4,
    minLng: 29.8,
    maxLng: 30.2,
  },
  الدقهلية: {
    minLat: 30.9,
    maxLat: 31.5,
    minLng: 31.2,
    maxLng: 31.8,
  },
  البحيرة: {
    minLat: 30.5,
    maxLat: 31.2,
    minLng: 29.9,
    maxLng: 30.7,
  },
  الفيوم: {
    minLat: 29.0,
    maxLat: 29.6,
    minLng: 30.3,
    maxLng: 31.0,
  },
  الغربية: {
    minLat: 30.7,
    maxLat: 31.2,
    minLng: 30.9,
    maxLng: 31.4,
  },
  الإسماعيلية: {
    minLat: 30.5,
    maxLat: 30.8,
    minLng: 32.0,
    maxLng: 32.5,
  },
  المنوفية: {
    minLat: 30.3,
    maxLat: 30.7,
    minLng: 30.7,
    maxLng: 31.2,
  },
  المنيا: {
    minLat: 27.8,
    maxLat: 28.6,
    minLng: 30.4,
    maxLng: 31.0,
  },
  القليوبية: {
    minLat: 30.1,
    maxLat: 30.5,
    minLng: 31.0,
    maxLng: 31.5,
  },
  "الوادي الجديد": {
    minLat: 22.0,
    maxLat: 26.0,
    minLng: 27.0,
    maxLng: 30.5,
  },
  السويس: {
    minLat: 29.9,
    maxLat: 30.1,
    minLng: 32.4,
    maxLng: 32.6,
  },
  أسوان: {
    minLat: 23.5,
    maxLat: 24.5,
    minLng: 32.5,
    maxLng: 33.0,
  },
  أسيوط: {
    minLat: 26.8,
    maxLat: 27.6,
    minLng: 30.6,
    maxLng: 31.4,
  },
  "بني سويف": {
    minLat: 28.8,
    maxLat: 29.4,
    minLng: 30.6,
    maxLng: 31.3,
  },
  بورسعيد: {
    minLat: 31.2,
    maxLat: 31.3,
    minLng: 32.2,
    maxLng: 32.4,
  },
  دمياط: {
    minLat: 31.3,
    maxLat: 31.6,
    minLng: 31.6,
    maxLng: 32.0,
  },
  "جنوب سيناء": {
    minLat: 27.5,
    maxLat: 29.5,
    minLng: 33.0,
    maxLng: 34.5,
  },
  "كفر الشيخ": {
    minLat: 31.0,
    maxLat: 31.5,
    minLng: 30.5,
    maxLng: 31.2,
  },
  مطروح: {
    minLat: 29.0,
    maxLat: 32.0,
    minLng: 25.0,
    maxLng: 29.5,
  },
  الأقصر: {
    minLat: 25.5,
    maxLat: 26.0,
    minLng: 32.5,
    maxLng: 33.0,
  },
  قنا: {
    minLat: 25.7,
    maxLat: 26.5,
    minLng: 32.5,
    maxLng: 33.0,
  },
  "شمال سيناء": {
    minLat: 30.0,
    maxLat: 31.5,
    minLng: 32.5,
    maxLng: 34.5,
  },
  سوهاج: {
    minLat: 26.2,
    maxLat: 27.0,
    minLng: 31.5,
    maxLng: 32.0,
  },
  "البحر الأحمر": {
    minLat: 23.0,
    maxLat: 27.5,
    minLng: 33.0,
    maxLng: 36.0,
  },
  الشرقية: {
    minLat: 30.5,
    maxLat: 31.0,
    minLng: 31.3,
    maxLng: 32.0,
  },
};

function LocationPicker({ setFieldValue, governorateBounds }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (governorateBounds) {
      map.fitBounds(
        [
          [governorateBounds.minLat, governorateBounds.minLng],
          [governorateBounds.maxLat, governorateBounds.maxLng],
        ],
        { padding: [50, 50] }
      );
    } else {
      map.setView([30.0444, 31.2357], 7); // عرض مصر بالكامل إذا لم يتم تحديد محافظة
    }
  }, [governorateBounds, map]);

  useMapEvents({
    click(e) {
      if (governorateBounds) {
        const { lat, lng } = e.latlng;
        // التحقق مما إذا كان النقاط داخل حدود المحافظة
        if (
          lat >= governorateBounds.minLat &&
          lat <= governorateBounds.maxLat &&
          lng >= governorateBounds.minLng &&
          lng <= governorateBounds.maxLng
        ) {
          setPosition(e.latlng);
          setFieldValue("location", `${lat},${lng}`);
        } else {
          toast.error("الموقع خارج حدود المحافظة المحددة");
        }
      } else {
        setPosition(e.latlng);
        setFieldValue("location", `${e.latlng.lat},${e.latlng.lng}`);
      }
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

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
  const [position, setPosition] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // قائمة الإدارات الثابتة كخيار احتياطي
  const staticDepartments = [
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
    "إدارة السياحة والآثار",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        logUserIp(currentUser.uid);

        formik.setFieldValue("name", currentUser.displayName || "");
        formik.setFieldValue("email", currentUser.email || "");

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

    // تهيئة الإدارات بالقائمة الثابتة عند تحميل المكون
    setDepartments(staticDepartments);

    return () => unsubscribe();
  }, []);

  // دالة لجلب الإدارات حسب المحافظة
  const fetchDepartmentsByGovernorate = async (governorate) => {
    if (!governorate) {
      setDepartments([]);
      return;
    }

    try {
      setLoadingDepartments(true);
      const deptQuery = query(
        collection(db, "departmentAccounts"),
        where("accountType", "==", "department"),
        where("governorate", "==", governorate)
      );
      const querySnapshot = await getDocs(deptQuery);

      const deptList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.department) {
          deptList.push(data.department);
        }
      });

      // إذا لم يتم العثور على إدارات في Firestore، استخدم القائمة الثابتة
      if (deptList.length === 0) {
        setDepartments(staticDepartments);
      } else {
        setDepartments(deptList);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      // في حالة الخطأ، استخدم القائمة الثابتة
      setDepartments(staticDepartments);
      toast.error("حدث خطأ أثناء جلب الإدارات، سيتم عرض القائمة الافتراضية");
    } finally {
      setLoadingDepartments(false);
    }
  };

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
      imagesBase64: [],
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
          imagesBase64:
            values.imagesBase64.length > 0 ? values.imagesBase64 : null,
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
    const files = Array.from(event.currentTarget.files);
    const validFiles = [];

    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`الصورة ${file.name} أكبر من 2MB`);
        continue;
      }
      try {
        const base64String = await fileToBase64(file);
        validFiles.push(base64String);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        toast.error(`حدث خطأ أثناء تحميل ${file.name}`);
      }
    }

    formik.setFieldValue("imagesBase64", [
      ...formik.values.imagesBase64,
      ...validFiles,
    ]);
  };

  useEffect(() => {
    if (
      formik.values.governorate &&
      governorateBounds[formik.values.governorate]
    ) {
      formik.setFieldValue("location", ""); // مسح الموقع عند تغيير المحافظة
    }
  }, [formik.values.governorate]);

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
                    readOnly={!!user}
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
                    readOnly={!!user}
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

              {/* الصف الثاني: المحافظة والاداره */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* المحافظة*/}
                <div>
                  <label
                    htmlFor="governorate"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    المحافظة <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="governorate"
                    name="governorate"
                    onChange={(e) => {
                      formik.handleChange(e);
                      fetchDepartmentsByGovernorate(e.target.value);
                      formik.setFieldValue("administration", ""); // إعادة تعيين الإدارة
                    }}
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

                {/* الإدارة المختصة */}
                <div>
                  <label className="block font-medium text-blue mb-1">
                    اختر الإدارة المختصة <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="administration"
                    name="administration"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.administration}
                    disabled={loadingDepartments}
                    className="w-full p-3 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="">
                      {loadingDepartments
                        ? "جاري تحميل الإدارات..."
                        : "اختر الإدارة المختصة"}
                    </option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {!formik.values.governorate && (
                    <p className="mt-1 text-sm text-orange-600">
                      ملاحظة: يرجى اختيار المحافظة أولاً لضمان عرض الإدارات
                      المناسبة
                    </p>
                  )}
                  {formik.touched.administration &&
                    formik.errors.administration && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.administration}
                      </div>
                    )}
                </div>
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
                    zoom={7}
                    style={{ height: "300px", width: "100%" }}
                    className="z-0"
                    maxBounds={
                      formik.values.governorate &&
                      governorateBounds[formik.values.governorate]
                        ? [
                            [
                              governorateBounds[formik.values.governorate]
                                .minLat,
                              governorateBounds[formik.values.governorate]
                                .minLng,
                            ],
                            [
                              governorateBounds[formik.values.governorate]
                                .maxLat,
                              governorateBounds[formik.values.governorate]
                                .maxLng,
                            ],
                          ]
                        : undefined
                    }
                    maxBoundsViscosity={1.0} // تمنع الخروج من الحدود
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      setFieldValue={formik.setFieldValue}
                      governorateBounds={
                        governorateBounds[formik.values.governorate]
                      }
                    />
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

              {/* رفع الصور والفيديو */}
              <div>
                <label
                  htmlFor="media"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  إرفاق صورة أو فيديو (اختياري)
                </label>

                {/* زر رفع صورة */}
                <div className="mt-1 flex flex-col md:flex-row gap-4">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                    <FaUpload className="text-gray-400 text-2xl mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لرفع صورة</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      الصور فقط (بحد أقصى 2MB)
                    </p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* زر رفع فيديو */}
                  <label
                    htmlFor="video"
                    className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                    <FaUpload className="text-gray-400 text-2xl mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لرفع فيديو</span>
                    </p>
                    <p className="text-xs text-gray-500">بحد أقصى 20MB</p>
                    <input
                      id="video"
                      name="video"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* عرض الصور والفيديو بنفس التصميم */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* الصور */}
                  {formik.values.imagesBase64.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`uploaded-${index}`}
                        className="rounded-lg border w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formik.values.imagesBase64.filter(
                            (_, i) => i !== index
                          );
                          formik.setFieldValue("imagesBase64", updated);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                        <FaTimes />
                      </button>
                    </div>
                  ))}

                  {/* الفيديو */}
                  {videoPreview && (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="rounded-lg border w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* زر الإرسال */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || isUploadingVideo}
                  className="bg-blue w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                  {formik.isSubmitting || isUploadingVideo ? (
                    <>جاري الإرسال...</>
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