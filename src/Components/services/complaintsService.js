import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function getComplaintsByDepartment(ministry, governorate = null) {
  const complaintsRef = collection(db, "complaints");

  let q;

  if (ministry && governorate) {
    // فلترة حسب الإدارة والمحافظة معاً
    q = query(
      complaintsRef, 
      where("administration", "==", ministry),
      where("governorate", "==", governorate)
    );
  } else if (ministry) {
    // فلترة حسب الإدارة فقط
    q = query(complaintsRef, where("administration", "==", ministry));
  } else if (governorate) {
    // فلترة حسب المحافظة فقط
    q = query(complaintsRef, where("governorate", "==", governorate));
  } else {
    q = complaintsRef; // جلب كل البيانات
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// دالة جديدة لجلب الشكاوى حسب المحافظة
export async function getComplaintsByGovernorate(governorate) {
  return getComplaintsByDepartment(null, governorate);
}

// دالة جديدة لجلب الشكاوى حسب الإدارة والمحافظة
export async function getComplaintsByDepartmentAndGovernorate(department, governorate) {
  return getComplaintsByDepartment(department, governorate);
}

export async function updateComplaintStatus(id, newStatus) {
  const complaintRef = doc(db, "complaints", id);
  await updateDoc(complaintRef, {
    status: newStatus,
    updatedAt: new Date(),
  });
}
