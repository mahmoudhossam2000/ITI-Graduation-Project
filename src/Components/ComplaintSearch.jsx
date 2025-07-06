import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";

function ComplaintSearch() {
  const [searchComplaint, setSearchComplaint] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchComplaint.trim()) {
      alert("من فضلك ادخل رقم الشكوى او رقمك القومي")
      return;
    }
    setLoading(true);
    setResults([]);
    setNotFound(false);

    const Complaints = collection(db, "complaints");

    const queryByNID = query(
      Complaints,
      where("nationalId", "==", searchComplaint)
    );
    const queryByID = query(Complaints, where("id", "==", searchComplaint));

    const [resultNID, resultID] = await Promise.all([
      getDocs(queryByNID),
      getDocs(queryByID),
    ]);

    const resultsArr = [];

    resultNID.forEach((doc) => resultsArr.push({ id: doc.id, ...doc.data() }));
    resultID.forEach((doc) => {
      if (!resultsArr.find((r) => r.id === doc.id)) {
        resultsArr.push({ id: doc.id, ...doc.data() });
      }
    });

    if (resultsArr.length === 0) {
      setNotFound(true);
    } else {
      setResults(resultsArr);
    }

    setLoading(false);
  };

  return (
    <>
      <main className="bg-background">
        <Navbar />

        <section className="flex items-center justify-center px-4 min-h-screen">
          <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-darkTeal text-center">
              متابعة حالة الشكوى
            </h2>
            <input
              type="text"
              placeholder="ادخل رقم الشكوى أو الرقم القومي"
              className="input input-bordered w-full mb-4 bg-background text-lg"
              value={searchComplaint}
              onChange={(e) => setSearchComplaint(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="btn w-full mb-4 bg-blue text-white border-blue hover:bg-blue/90">
              {loading ? "جاري البحث..." : "بحث"}
            </button>

            {notFound && (
              <div className="text-red-500 text-center">
                لم يتم العثور على أي شكوى بهذا الرقم.
              </div>
            )}

            {results.map((complaint, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-background mt-2">
                <p>
                  <strong>اسم:</strong> {complaint.name}
                </p>
                <p>
                  <strong>الرقم القومي:</strong> {complaint.nationalId}
                </p>
                <p>
                  <strong>الوزارة:</strong> {complaint.ministry}
                </p>
                <p>
                  <strong>الوصف:</strong> {complaint.description}
                </p>
                <p>
                  <strong>الحالة:</strong>{" "}
                  <span className="font-bold">{complaint.status}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default ComplaintSearch;
