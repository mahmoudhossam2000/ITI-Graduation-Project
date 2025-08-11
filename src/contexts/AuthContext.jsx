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

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [adminSessionData, setAdminSessionData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', { 
        user: user?.uid, 
        isCreatingAccount, 
        adminSessionData: adminSessionData?.uid,
        currentUser: currentUser?.uid 
      });
      
      // Skip auth state changes if we're in the middle of creating an account
      if (isCreatingAccount) {
        console.log('Skipping auth state change - account creation in progress');
        return;
      }

      // If we have admin session data and no user, we're restoring the admin session
      if (adminSessionData && !user) {
        console.log('Skipping auth state change - restoring admin session');
        return;
      }

      // If we have a current user and a new user comes in, check if this is a new account creation
      if (currentUser && user && currentUser.uid !== user.uid) {
        console.log('Skipping auth state change - new account creation detected');
        // This is likely a new account creation, don't update the state
        // The admin should stay on their dashboard
        return;
      }

      // If we're restoring admin session, don't process this auth change
      if (adminSessionData && user && user.uid === adminSessionData.uid) {
        console.log('Skipping auth state change - admin session restoration');
        return;
      }

      console.log('Processing auth state change');
      setCurrentUser(user);

      if (user) {
        // Check if user is admin or department/governorate account
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
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
  }, [isCreatingAccount, currentUser, adminSessionData]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Add new user data
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
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

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
      console.log('Starting account creation for:', accountType, email);
      
      // Store the current admin user's session data before creating the new account
      const adminUID = auth.currentUser?.uid;
      const adminData = userData;
      
      console.log('Admin session data:', { adminUID, adminData });
      
      if (adminUID && adminData) {
        setAdminSessionData({ uid: adminUID, userData: adminData });
      }
      
      // Set flag to prevent auth state changes during account creation
      setIsCreatingAccount(true);
      console.log('Set isCreatingAccount to true');

      // Create auth user (this will automatically sign in the new user)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Created new user:', user.uid);

      // Save additional user data to Firestore
      await addDoc(collection(db, 'departmentAccounts'), {
        uid: user.uid,
        email,
        accountType,
        department: accountType === 'department' ? department : null,
        governorate: accountType === 'department' ? governorate : (accountType === 'governorate' ? governorate : null),
        createdAt: new Date()
      });
      console.log('Saved account data to Firestore');

      // Sign out the newly created user to return to the previous auth state
      await signOut(auth);
      console.log('Signed out newly created user');

      // Wait a moment for the signOut to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Restore the admin's session data
      if (adminSessionData) {
        console.log('Restoring admin session data');
        setCurrentUser({ uid: adminSessionData.uid });
        setUserData(adminSessionData.userData);
        setAdminSessionData(null);
      }

      // Reset the flag after account creation is complete
      setIsCreatingAccount(false);
      console.log('Account creation completed successfully');

      return user;
    } catch (error) {
      console.error('Error creating department account:', error);
      // Reset the flag in case of error
      setIsCreatingAccount(false);
      // Clear admin session data in case of error
      setAdminSessionData(null);
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
    preventNavigation,
    isCreatingAccount,
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
