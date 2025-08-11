import { useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const departments = [
  { name: "وزارة الصحة", email: "health@egy.gov" },
  { name: "وزارة التعليم", email: "education@egy.gov" },
  { name: "وزارة الداخلية", email: "interior@egy.gov" },
  { name: "وزارة التموين", email: "supply@egy.gov" },
  { name: "وزارة الكهرباء والطاقة", email: "energy@egy.gov" },
  { name: "وزارة النقل", email: "transport@egy.gov" },
  { name: "وزارة البيئة", email: "environment@egy.gov" },
  { name: "وزارة التضامن الاجتماعي", email: "social@egy.gov" },
  { name: "وزارة الاتصالات وتكنولوجيا المعلومات", email: "ict@egy.gov" },
  { name: "وزارة الإسكان والمرافق", email: "housing@egy.gov" },
  { name: "وزارة القوى العاملة", email: "manpower@egy.gov" },
  { name: "وزارة الثقافة", email: "culture@egy.gov" },
  { name: "وزارة التنمية المحلية", email: "localdev@egy.gov" },
  { name: "وزارة العدل", email: "justice@egy.gov" },
  { name: "وزارة المالية", email: "finance@egy.gov" },
];

export default function AddDepartments() {
  useEffect(() => {
    async function addDepartments() {
      for (let dept of departments) {
        try {
          await setDoc(doc(db, "users", dept.email), {
            email: dept.email,
            department: dept.name,
            role: "department",
            createdAt: new Date(),
          });
          console.log(`✅ Added ${dept.name}`);
        } catch (err) {
          console.error(`❌ Error adding ${dept.name}:`, err.message);
        }
      }
    }

    addDepartments();
  }, []);

  return <div className="p-10 text-center">✅ Adding Departments...</div>;
}
