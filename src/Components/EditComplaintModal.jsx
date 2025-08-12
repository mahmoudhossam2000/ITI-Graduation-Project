import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  FaRegCheckCircle,
  FaMapMarkerAlt,
  FaUpload,
  FaTimes,
  FaUser,
  FaEnvelope,
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

function LocationPicker({ setFieldValue, governorateBounds, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || null);
  const map = useMap();

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.setView(initialPosition, 15);
    } else if (governorateBounds) {
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
  }, [governorateBounds, map, initialPosition]);

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

export default function EditComplaintModal({
  complaintData,
  onClose,
  onUpdate,
}) {
  const [showModal, setShowModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoUrl, setVideoUrl] = useState(complaintData?.videoUrl || "");
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
    if (complaintData) {
      if (complaintData.location) {
        const [lat, lng] = complaintData.location.split(",").map(Number);
        setPosition({ lat, lng });
      }
      fetchDepartmentsByGovernorate(complaintData.governorate);
    }
  }, [complaintData]);

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
      name: complaintData?.name || "",
      email: complaintData?.email || "",
      governorate: complaintData?.governorate || "",
      administration: complaintData?.administration || "",
      description: complaintData?.description || "",
      imagesBase64: complaintData?.imagesBase64 || [],
      location: complaintData?.location || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const isAbusive = await checkForAbuse(values.description);
      if (isAbusive) {
        toast.error(
          "عذرًا، تحتوي شكواك على لغة غير لائقة. يرجى مراجعة المحتوى."
        );
        setSubmitting(false);
        return;
      }

      // Upload video if exists
      let uploadedVideoUrl = videoUrl;
      if (videoFile) {
        uploadedVideoUrl = await uploadVideoToCloudinary(videoFile);
        if (!uploadedVideoUrl) {
          toast.error("فشل تحميل الفيديو");
          setSubmitting(false);
          return;
        }
      }

      try {
        const complaintRef = doc(db, "complaints", complaintData.id);
        await updateDoc(complaintRef, {
          governorate: values.governorate,
          administration: values.administration,
          description: values.description,
          imagesBase64:
            values.imagesBase64.length > 0 ? values.imagesBase64 : null,
          updatedAt: new Date(),
          location: values.location,
          videoUrl: uploadedVideoUrl || null,
        });

        setShowModal(true);
        toast.success("تم تحديث الشكوى بنجاح");
        onUpdate(); // Notify parent component about the update
      } catch (error) {
        console.error("خطأ أثناء تحديث الشكوى:", error);
        toast.error("حدث خطأ أثناء تحديث الشكوى.");
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

  const removeImage = (index) => {
    const updated = formik.values.imagesBase64.filter((_, i) => i !== index);
    formik.setFieldValue("imagesBase64", updated);
  };

  useEffect(() => {
    if (
      formik.values.governorate &&
      governorateBounds[formik.values.governorate]
    ) {
      formik.setFieldValue("location", ""); // مسح الموقع عند تغيير المحافظة
    }
  }, [formik.values.governorate]);

  if (!complaintData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-darkTeal">
              تعديل الشكوى
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200">
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* معلومات المستخدم (غير قابلة للتعديل) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                معلومات المستخدم
              </h3>
              
              {/* الاسم */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FaUser className="ml-2" /> الاسم
                </label>
                <div className="w-full bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                  {formik.values.name}
                </div>
              </div>
              
              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FaEnvelope className="ml-2" /> البريد الإلكتروني
                </label>
                <div className="w-full bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                  {formik.values.email}
                </div>
              </div>
            </div>

            {/* المحافظة */}
            <div>
              <label
                htmlFor="governorate"
                className="block text-sm font-medium text-gray-700 mb-1">
                المحافظة
              </label>
              <select
                id="governorate"
                name="governorate"
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchDepartmentsByGovernorate(e.target.value);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.governorate}
                className="w-full bg-background px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                <option value="">اختر المحافظة</option>
                {Object.keys(governorateBounds).map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              {formik.touched.governorate && formik.errors.governorate ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.governorate}
                </div>
              ) : null}
            </div>

            {/* الإدارة المختصة */}
            <div>
              <label
                htmlFor="administration"
                className="block text-sm font-medium text-gray-700 mb-1">
                الإدارة المختصة
              </label>
              <select
                id="administration"
                name="administration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.administration}
                className="w-full bg-background px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                disabled={loadingDepartments}>
                <option value="">اختر الإدارة المختصة</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formik.touched.administration && formik.errors.administration ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.administration}
                </div>
              ) : null}
            </div>

            {/* الوصف */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1">
                وصف الشكوى
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="w-full bg-background px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>

            {/* الصور */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الصور المرفقة
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {formik.values.imagesBase64.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`صورة الشكوى ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition duration-200">
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                <div className="flex flex-col items-center">
                  <FaUpload className="text-gray-400 mb-2 text-xl" />
                  <p className="text-sm text-gray-500">اضغط لرفع الصور</p>
                  <p className="text-xs text-gray-400 mt-1">
                    (JPEG, PNG بحد أقصى 2MB لكل صورة)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* الفيديو */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفيديو المرفق
                
              </label>
              {videoPreview || videoUrl ? (
                <div className="relative group">
                  <video
                    controls
                    src={videoPreview || videoUrl}
                    className="w-full h-48 object-cover rounded-lg bg-black"
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-200">
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                  <div className="flex flex-col items-center">
                    <FaUpload className="text-gray-400 mb-2 text-xl" />
                    <p className="text-sm text-gray-500">اضغط لرفع فيديو</p>
                    <p className="text-xs text-gray-400 mt-1">
                      (MP4, MOV بحد أقصى 20MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* الخريطة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تحديد الموقع على الخريطة
                <span className="text-xs text-gray-500 mr-2">
                  (اضغط على الخريطة لتحديد الموقع)
                </span>
              </label>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                <MapContainer
                  center={position || [30.0444, 31.2357]}
                  zoom={7}
                  style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationPicker
                    setFieldValue={formik.setFieldValue}
                    governorateBounds={
                      formik.values.governorate
                        ? governorateBounds[formik.values.governorate]
                        : null
                    }
                    initialPosition={position}
                  />
                </MapContainer>
              </div>
              {formik.touched.location && formik.errors.location ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.location}
                </div>
              ) : null}
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="pt-4 flex justify-end gap-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center">
                إلغاء
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || isUploadingVideo}
                className="bg-blue hover:bg-darkTeal text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70">
                {formik.isSubmitting || isUploadingVideo ? (
                  <>
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* رسالة النجاح */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all animate-fade-in">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <FaRegCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تم تحديث الشكوى بنجاح
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-4">
                  تم حفظ التغييرات على الشكوى بنجاح
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    onClose();
                  }}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                  موافق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}