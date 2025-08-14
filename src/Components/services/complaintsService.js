import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function getComplaintsByDepartment(
  department = null,
  governorate = null,
  ministry = null
) {
  const complaintsRef = collection(db, "complaints");

  let q;
  // 🔹 لو فيه وزارة
  if (ministry) {
    // هات الإدارات التابعة للوزارة
    const deptRef = collection(db, "departmentAccounts");
    const deptQuery = query(deptRef, where("ministry", "==", ministry));
    const deptSnap = await getDocs(deptQuery);

    const departmentNames = deptSnap.docs.map((doc) => doc.data().department);

    if (departmentNames.length === 0) return [];

    // جلب الشكاوى لكل الإدارات (مقسمة chunks لو أكتر من 10)
    let complaints = [];
    for (let i = 0; i < departmentNames.length; i += 10) {
      const chunk = departmentNames.slice(i, i + 10);
      let q = query(complaintsRef, where("administration", "in", chunk));
      const complaintsSnap = await getDocs(q);
      complaints = complaints.concat(
        complaintsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
    return complaints;
  }

  // 🔹 لو فيه مديرية ومحافظة
  if (department && governorate) {
    // فلترة حسب الإدارة والمحافظة معاً
    q = query(
      complaintsRef,
      where("administration", "==", department),
      where("governorate", "==", governorate)
    );
  } else if (department) {
    // فلترة حسب الإدارة فقط
    q = query(complaintsRef, where("administration", "==", department));
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

export async function getComplaintsForMinistry(ministry) {
  return getComplaintsByDepartment(null, null, ministry);
}

// export async function getComplaintsForMinistry(ministryName) {
//   try {
//     // 1️⃣ هات الإدارات التابعة للوزارة
//     const deptRef = collection(db, "departmentAccounts");
//     const deptQuery = query(deptRef, where("ministry", "==", ministryName));
//     const deptSnap = await getDocs(deptQuery);

//     const departmentNames = deptSnap.docs.map((doc) => doc.data().department);

//     if (departmentNames.length === 0) {
//       return [];
//     }

//     // 2️⃣ لو أكتر من 10 إدارة، لازم نجزّئ الاستعلام
//     let complaints = [];
//     const complaintsRef = collection(db, "complaints");

//     for (let i = 0; i < departmentNames.length; i += 10) {
//       const chunk = departmentNames.slice(i, i + 10);
//       const complaintsQuery = query(
//         complaintsRef,
//         where("administration", "in", chunk)
//       );
//       const complaintsSnap = await getDocs(complaintsQuery);
//       complaints = complaints.concat(
//         complaintsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//     }

//     return complaints;
//   } catch (error) {
//     console.error("Error fetching complaints for ministry:", error);
//     return [];
//   }
// }

// دالة جديدة لجلب الشكاوى حسب المحافظة
export async function getComplaintsByGovernorate(governorate) {
  return getComplaintsByDepartment(null, governorate);
}

// دالة جديدة لجلب الشكاوى حسب الإدارة والمحافظة
export async function getComplaintsByDepartmentAndGovernorate(
  department,
  governorate
) {
  return getComplaintsByDepartment(department, governorate);
}

export async function updateComplaintStatus(id, newStatus) {
  const complaintRef = doc(db, "complaints", id);
  await updateDoc(complaintRef, {
    status: newStatus,
    updatedAt: new Date(),
  });
}
