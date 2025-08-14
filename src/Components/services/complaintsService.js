import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
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
export async function getComplaintsByDepartmentAndGovernorate(
  department,
  governorate
) {
  return getComplaintsByDepartment(department, governorate);
}

export async function updateComplaintStatus(id, newStatus) {
  try {
    console.log(`Updating complaint ${id} status to:`, newStatus);
    const complaintRef = doc(db, "complaints", id);

    // Get complaint data to verify it exists
    const complaintDoc = await getDoc(complaintRef);
    if (!complaintDoc.exists()) {
      console.error("Complaint not found:", id);
      throw new Error("Complaint not found");
    }

    // Update complaint status
    await updateDoc(complaintRef, {
      status: newStatus,
      updatedAt: new Date(),
    });
    
    console.log("Complaint status updated successfully");
    
    return { 
      success: true, 
      complaintId: id, 
      newStatus
    };
    
  } catch (error) {
    console.error("Error in updateComplaintStatus:", error);
    return { 
      success: false, 
      error: error.message,
      complaintId: id,
      newStatus
    };
  }
}
