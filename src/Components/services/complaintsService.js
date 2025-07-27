import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function getComplaintsByDepartment(ministry) {
  const complaintsRef = collection(db, "complaints");

  let q;

  if (ministry) {
    q = query(complaintsRef, where("ministry", "==", ministry));
  } else {
    q = complaintsRef; // جلب كل البيانات
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return complaints;
}
