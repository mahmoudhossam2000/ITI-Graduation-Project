import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";

export default function UrgentAlertsSection() {
  const [delayedComplaints, setDelayedComplaints] = useState([]);
  const [highPriorityComplaints, setHighPriorityComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaintsRef = collection(db, "complaints");
      const snapshot = await getDocs(complaintsRef);
      const now = new Date();

      const delayed = [];
      const highPriority = [];

      const highPriorityCategories = ["الصحة", "المياه", "الكهرباء", "الأمان"];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const daysDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

        if (daysDiff > 7) {
          delayed.push({ id: doc.id, ...data });
        }

        if (highPriorityCategories.includes(data.category)) {
          highPriority.push({ id: doc.id, ...data });
        }
      });

      setDelayedComplaints(delayed);
      setHighPriorityComplaints(highPriority);
    };

    fetchComplaints();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* كارت الشكاوى المتأخرة */}
      <div className="bg-red-100 border border-red-300 rounded-xl p-4 shadow">
        <h3 className="text-lg font-bold text-red-700 mb-3">⏳ شكاوى متأخرة</h3>
        <p className="mb-2 text-sm text-red-800">
          عدد الشكاوى: {delayedComplaints.length}
        </p>
        <ul className="space-y-2">
          {delayedComplaints.slice(0, 5).map((c) => (
            <li
              key={c.id}
              className="bg-white rounded-lg p-2 shadow-sm text-sm"
            >
              <span className="font-semibold">
                {c.title || "شكوى بدون عنوان"}
              </span>
              <span className="block text-gray-500">
                {c.ministry || c.department}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* كارت الشكاوى ذات الأولوية العالية */}
      <div className="bg-orange-100 border border-orange-300 rounded-xl p-4 shadow">
        <h3 className="text-lg font-bold text-orange-700 mb-3">
          🚨 أولوية عالية
        </h3>
        <p className="mb-2 text-sm text-orange-800">
          عدد الشكاوى: {highPriorityComplaints.length}
        </p>
        <ul className="space-y-2">
          {highPriorityComplaints.slice(0, 5).map((c) => (
            <li
              key={c.id}
              className="bg-white rounded-lg p-2 shadow-sm text-sm"
            >
              <span className="font-semibold">
                {c.title || "شكوى بدون عنوان"}
              </span>
              <span className="block text-gray-500">
                {c.category} - {c.ministry || c.department}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
