import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getDoc,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);

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
            collection(db, "departmentAccounts"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(deptQuery);

          if (!querySnapshot.empty) {
            const accountData = querySnapshot.docs[0].data();
            setUserData({
              ...accountData,
              role: accountData.accountType, // 'department' or 'governorate'
            });
          } else {
            // Check if it's a ministry account
            const ministryQuery = query(
              collection(db, "ministryAccounts"),
              where("uid", "==", user.uid)
            );
            const ministrySnapshot = await getDocs(ministryQuery);

            if (!ministrySnapshot.empty) {
              const accountData = ministrySnapshot.docs[0].data();
              // console.log("User found in ministry accounts:", accountData);
              // console.log("Ministry account fields:", Object.keys(accountData));
              // console.log("Ministry account role field:", accountData.role);
              // console.log(
              //   "Ministry account accountType field:",
              //   accountData.accountType
              // );

              const userDataToSet = {
                ...accountData,
                role: accountData.role || accountData.accountType, // Support both old and new field names
              };
              // console.log(
              //   "Setting userData for ministry account:",
              //   userDataToSet
              // );
              setUserData(userDataToSet);
            } else {
              // Check if it's a governorate account
              const governorateQuery = query(
                collection(db, "governorateAccounts"),
                where("uid", "==", user.uid)
              );
              const governorateSnapshot = await getDocs(governorateQuery);

              if (!governorateSnapshot.empty) {
                const accountData = governorateSnapshot.docs[0].data();
                console.log("User found in governorate accounts:", accountData);
                console.log(
                  "Governorate account fields:",
                  Object.keys(accountData)
                );
                console.log(
                  "Governorate account role field:",
                  accountData.role
                );
                console.log(
                  "Governorate account accountType field:",
                  accountData.accountType
                );

                const userDataToSet = {
                  ...accountData,
                  role: accountData.role || accountData.accountType, // Support both old and new field names
                };
                console.log(
                  "Setting userData for governorate account:",
                  userDataToSet
                );
                setUserData(userDataToSet);
              } else {
                console.log("User not found anywhere, setting default role");
                // Default user role
                setUserData({ role: "user" });
              }
            }
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
          role: "user",
          createdAt: new Date(),
        });

        setUserData({
          name: user.displayName || "مستخدم جوجل",
          email: user.email,
          role: "user",
        });
      } else {
        setUserData({
          ...userSnap.data(),
          role: userSnap.data().role || "user",
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
      console.log("=== LOGIN WITH EMAIL START ===");
      console.log("Attempting to login with email:", email);
      console.log("Current auth state before login:", {
        currentUser: currentUser?.uid,
        userData: userData?.role,
        isCreatingAccount,
      });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Store admin credentials temporarily for re-authentication
      // Only store if this is an admin user
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setAdminCredentials({ email, password });
        console.log("Stored admin credentials for re-authentication");
      }

      console.log("Login successful, user:", userCredential.user.uid);
      console.log("User credential:", userCredential);
      console.log("=== LOGIN WITH EMAIL END ===");

      // The user data will be handled by the onAuthStateChanged listener
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  };

  const createDepartmentAccount = async (
    email,
    password,
    accountType,
    department = null,
    governorate = null
  ) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user data to Firestore
      await addDoc(collection(db, "departmentAccounts"), {
        uid: user.uid,
        email,
        accountType,
        department: accountType === "department" ? department : null,
        governorate: accountType === "governorate" ? governorate : null,
        createdAt: new Date(),
      });
      console.log("Saved account data to Firestore");

      // Sign back in as admin if we have admin credentials
      if (adminCredentials) {
        console.log("Signing back in as admin");
        await signInWithEmailAndPassword(
          auth,
          adminCredentials.email,
          adminCredentials.password
        );
        console.log("Successfully signed back in as admin");
      }

      // Reset the flag after account creation is complete
      setIsCreatingAccount(false);
      console.log("Account creation completed successfully");

      return user;
    } catch (error) {
      console.error("Error creating department account:", error);
      // Reset the flag in case of error
      setIsCreatingAccount(false);

      // Provide better error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("البريد الإلكتروني غير صحيح");
      } else if (error.code === "auth/weak-password") {
        throw new Error("كلمة المرور ضعيفة جداً");
      } else {
        throw new Error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    }
  };

  const createMinistryAccount = async (email, password, ministry) => {
    try {
      console.log("Starting ministry account creation for:", ministry, email);

      // Set flag to prevent auth state changes during account creation
      setIsCreatingAccount(true);
      console.log("Set isCreatingAccount to true");

      // Store the current admin user's credentials
      const currentAdminUser = currentUser; // Use currentUser from state instead of auth.currentUser
      if (!currentAdminUser) {
        throw new Error("Admin user not authenticated");
      }

      console.log("Current admin user:", currentAdminUser.uid);

      // Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Created new Firebase Auth user:", user.uid);

      // Save additional user data to Firestore in ministryAccounts collection
      await addDoc(collection(db, "ministryAccounts"), {
        uid: user.uid,
        email,
        role: "ministry",
        ministry,
        createdAt: new Date(),
      });
      console.log("Saved ministry account data to Firestore");

      // Sign back in as admin if we have admin credentials
      if (adminCredentials) {
        console.log("Signing back in as admin");
        await signInWithEmailAndPassword(
          auth,
          adminCredentials.email,
          adminCredentials.password
        );
        console.log("Successfully signed back in as admin");
      }

      // Reset the flag after account creation is complete
      setIsCreatingAccount(false);
      console.log("Ministry account creation completed successfully");

      return user;
    } catch (error) {
      console.error("Error creating ministry account:", error);
      // Reset the flag in case of error
      setIsCreatingAccount(false);

      // Provide better error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("البريد الإلكتروني غير صحيح");
      } else if (error.code === "auth/weak-password") {
        throw new Error("كلمة المرور ضعيفة جداً");
      } else {
        throw new Error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    }
  };

  const createGovernorateAccount = async (email, password, governorate) => {
    try {
      console.log(
        "Starting governorate account creation for:",
        governorate,
        email
      );

      // Set flag to prevent auth state changes during account creation
      setIsCreatingAccount(true);
      console.log("Set isCreatingAccount to true");

      // Store the current admin user's credentials
      const currentAdminUser = currentUser; // Use currentUser from state instead of auth.currentUser
      if (!currentAdminUser) {
        throw new Error("Admin user not authenticated");
      }

      console.log("Current admin user:", currentAdminUser.uid);

      // Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Created new Firebase Auth user:", user.uid);

      // Save additional user data to Firestore in governorateAccounts collection
      await addDoc(collection(db, "governorateAccounts"), {
        uid: user.uid,
        email,
        role: "governorate",
        governorate,
        createdAt: new Date(),
      });
      console.log("Saved governorate account data to Firestore");

      // Sign back in as admin if we have admin credentials
      if (adminCredentials) {
        console.log("Signing back in as admin");
        await signInWithEmailAndPassword(
          auth,
          adminCredentials.email,
          adminCredentials.password
        );
        console.log("Successfully signed back in as admin");
      }

      // Reset the flag after account creation is complete
      setIsCreatingAccount(false);
      console.log("Governorate account creation completed successfully");

      return user;
    } catch (error) {
      console.error("Error creating governorate account:", error);
      // Reset the flag in case of error
      setIsCreatingAccount(false);

      // Provide better error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("البريد الإلكتروني مستخدم بالفعل في حساب آخر");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("البريد الإلكتروني غير صحيح");
      } else if (error.code === "auth/weak-password") {
        throw new Error("كلمة المرور ضعيفة جداً");
      } else {
        throw new Error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    }
  };

  const updateDepartmentAccount = async (docId, updates) => {
    try {
      const docRef = doc(db, "departmentAccounts", docId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating department account:", error);
      throw error;
    }
  };

  const updateMinistryAccount = async (docId, updates) => {
    try {
      const docRef = doc(db, "ministryAccounts", docId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating ministry account:", error);
      throw error;
    }
  };

  const updateGovernorateAccount = async (docId, updates) => {
    try {
      const docRef = doc(db, "governorateAccounts", docId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating governorate account:", error);
      throw error;
    }
  };

  const updateDepartmentAccountPassword = async (uid, newPassword) => {
    try {
      // Store the new password in Firestore as a temporary password
      // The user will need to use this temporary password to sign in and then change it
      const deptQuery = query(
        collection(db, "departmentAccounts"),
        where("uid", "==", uid)
      );
      const deptSnapshot = await getDocs(deptQuery);

      if (!deptSnapshot.empty) {
        const docRef = doc(db, "departmentAccounts", deptSnapshot.docs[0].id);
        await updateDoc(docRef, {
          tempPassword: newPassword,
          passwordUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return true;
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      console.error("Error updating department account password:", error);
      throw error;
    }
  };

  const updateMinistryAccountPassword = async (uid, newPassword) => {
    try {
      // Store the new password in Firestore as a temporary password
      // The user will need to use this temporary password to sign in and then change it
      const ministryQuery = query(
        collection(db, "ministryAccounts"),
        where("uid", "==", uid)
      );
      const ministrySnapshot = await getDocs(ministryQuery);

      if (!ministrySnapshot.empty) {
        const docRef = doc(db, "ministryAccounts", ministrySnapshot.docs[0].id);
        await updateDoc(docRef, {
          tempPassword: newPassword,
          passwordUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return true;
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      console.error("Error updating ministry account password:", error);
      throw error;
    }
  };

  const updateGovernorateAccountPassword = async (uid, newPassword) => {
    try {
      // Store the new password in Firestore as a temporary password
      // The user will need to use this temporary password to sign in and then change it
      const governorateQuery = query(
        collection(db, "governorateAccounts"),
        where("uid", "==", uid)
      );
      const governorateSnapshot = await getDocs(governorateQuery);

      if (!governorateSnapshot.empty) {
        const docRef = doc(
          db,
          "governorateAccounts",
          governorateSnapshot.docs[0].id
        );
        await updateDoc(docRef, {
          tempPassword: newPassword,
          passwordUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return true;
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      console.error("Error updating governorate account password:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    // Clear admin credentials on logout
    setAdminCredentials(null);
    console.log("State cleared after logout and admin credentials cleared");
  };

  const value = {
    currentUser,
    setCurrentUser,
    userData,
    signInWithGoogle,
    loginWithEmail,
    logout,
    createDepartmentAccount,
    isAdmin: userData?.role === "admin",
    isDepartment: userData?.role === "department",
    isGovernorate: userData?.role === "governorate",
    isMinistry: userData?.role === "ministry",
    isModerator: userData?.role === "moderator",
  };

  // Debug logging for role checks
  // console.log("AuthContext role debug:", {
  //   userDataRole: userData?.role,
  //   userDataExists: !!userData,
  //   isAdmin: userData?.role === "admin",
  //   isDepartment: userData?.role === "department",
  //   isGovernorate: userData?.role === "governorate",
  //   isMinistry: userData?.role === "ministry",
  //   isModerator: userData?.role === "moderator",
  //   currentUser: currentUser?.uid,
  //   loading,
  // });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
