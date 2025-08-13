import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getDoc, setDoc, doc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // متابعة حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user is admin or department/governorate account
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setUserData(userSnap.data());
        } else {
          // Check if it's a department or governorate account
          const deptQuery = query(
            collection(db, 'departmentAccounts'),
            where('uid', '==', user.uid)
          );
          const querySnapshot = await getDocs(deptQuery);
          
          if (!querySnapshot.empty) {
            const accountData = querySnapshot.docs[0].data();
            setUserData({
              ...accountData,
              role: accountData.accountType // 'department' or 'governorate'
            });
          } else {
            // Default user role
            setUserData({ role: 'user' });
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // تسجيل الدخول بـ Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // التحقق إذا كان المستخدم جديد
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "مستخدم جوجل",
          email: user.email,
          phone: "",
          complaintCount: 0,
          banned: false,
          role: 'user',
          createdAt: new Date(),
        });
        
        setUserData({
          name: user.displayName || "مستخدم جوجل",
          email: user.email,
          role: 'user'
        });
      } else {
        setUserData({
          ...userSnap.data(),
          role: userSnap.data().role || 'user'
        });
      }

      return user;
    } catch (error) {
      console.error("خطأ في تسجيل الدخول بـ Google", error);
      throw error;
    }
  };

  // تسجيل الدخول بالإيميل
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // The user data will be handled by the onAuthStateChanged listener
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  };

  const createDepartmentAccount = async (email, password, accountType, department = null, governorate = null) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await addDoc(collection(db, 'departmentAccounts'), {
        uid: user.uid,
        email,
        accountType,
        department: accountType === 'department' ? department : null,
        governorate: accountType === 'governorate' ? governorate : null,
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      console.error('Error creating department account:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const value = {
    currentUser,
    userData,
    signInWithGoogle,
    loginWithEmail,
    logout,
    createDepartmentAccount,
    isAdmin: userData?.role === 'admin',
    isDepartment: userData?.accountType === 'department',
    isGovernorate: userData?.accountType === 'governorate'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
