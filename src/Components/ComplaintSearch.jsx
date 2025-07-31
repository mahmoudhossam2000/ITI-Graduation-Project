import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUser,
  FaIdCard,
  FaBuilding,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";

function ComplaintSearch() {
  const [searchComplaint, setSearchComplaint] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchComplaint.trim()) {
      toast.warning("من فضلك ادخل رقم الشكوي", { closeButton: false });
      return;
    }
    setLoading(true);
    setResults([]);
    setNotFound(false);

    try {
      const Complaints = collection(db, "complaints");
      const queryByID = query(
        Complaints,
        where("complaintId", "==", searchComplaint.toString())
      );
      const resultID = await getDocs(queryByID);

      const resultsArr = [];
      resultID.forEach((doc) => {
        resultsArr.push({ id: doc.id, ...doc.data() });
      });

      if (resultsArr.length === 0) {
        setNotFound(true);
      } else {
        setResults(resultsArr);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  // design for status complaint
  const getStatusColor = (status) => {
    switch (status) {
      case "قيد المعالجة":
        return "bg-yellow-100 text-yellow-800";
      case "تم القبول":
        return "bg-green-100 text-green-800";
      case "مرفوض":
        return "bg-red-100 text-red-800";
      case "تم الحل":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Navbar />

      <section className="flex items-center justify-center px-4 py-12 min-h-screen pt-20">
        <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              متابعة حالة الشكوى
            </h2>
            <p className="text-gray-600 text-lg">
              أدخل رقم الشكوى الخاص بك لمعرفة حالتها الحالية
            </p>
          </div>

          {/* input Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="ادخل رقم الشكوي..."
              className="w-full py-3 px-5 pr-5 bg-gray-50 text-lg rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={searchComplaint}
              onChange={(e) => {
                setSearchComplaint(e.target.value);
                setResults([]);
                setNotFound(false);
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all shadow-sm">
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSearch className="h-5 w-5 text-blue" />
              )}
            </button>
          </div>

          {/* message not found complaint */}
          {notFound && (
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 text-red-600 mb-6">
              <FaInfoCircle className="inline-block ml-2" />
              لم يتم العثور على أي شكوى بهذا الرقم. يرجى التأكد من الرقم
              والمحاولة مرة أخرى.
            </div>
          )}

          {/* section complaint info. */}
          {results.map((complaint, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 bg-white shadow-md mb-6 border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-900">
                  تفاصيل الشكوى
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    complaint.status
                  )}`}>
                  {complaint.status}
                </span>
              </div>

              <div className="space-y-4">
                {/* name */}
                <div className="flex items-start gap-1">
                  <FaUser className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-base">اسم المواطن</p>
                    <p className="font-medium text-gray-800">
                      {complaint.name}
                    </p>
                  </div>
                </div>

                {/* email */}
                <div className="flex items-start gap-1">
                  <FaIdCard className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-base"> البريد الالكتروني</p>
                    <p className="font-medium text-gray-800">
                      {complaint.email}
                    </p>
                  </div>
                </div>

                {/* ministry */}
                <div className="flex items-start gap-1">
                  <FaBuilding className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-base">الوزارة</p>
                    <p className="font-medium text-gray-800">
                      {complaint.ministry}
                    </p>
                  </div>
                </div>

                {/* complaint description */}
                <div className="flex items-start gap-1">
                  <FaFileAlt className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-base">وصف الشكوى</p>
                    <p className="font-medium text-gray-800">
                      {complaint.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ComplaintSearch;
