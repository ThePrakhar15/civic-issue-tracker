import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Simple auth check (frontend-only)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(false);
  }, []);

  // ✅ Firebase-only login
  const login = async (email, password) => {
    const { auth } = await import("../firebase");
    const { signInWithEmailAndPassword } = await import("firebase/auth");

    // 1️⃣ Firebase authentication
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("🔥 FIREBASE LOGIN OK:", cred.user.email);

    // 2️⃣ Get Firebase ID token
    const firebaseToken = await cred.user.getIdToken();

    // 3️⃣ Store token locally
    localStorage.setItem("token", firebaseToken);

    // 4️⃣ Set user in frontend (no backend)
    const loggedInUser = {
      email: cred.user.email,
      role: cred.user.email.includes("admin") ? "admin" : "citizen",
    };

    setUser(loggedInUser);
    return loggedInUser;
  };

  // ❌ Signup disabled (optional)
  const signup = async () => {
    throw new Error("Signup disabled in frontend-only auth");
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// import { useState, useEffect, createContext, useContext } from 'react';
// import axios from 'axios';
// import { API_ENDPOINTS } from '../utils/config';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     setLoading(false);
//     return;
//   }

//   axios
//     .get(API_ENDPOINTS.AUTH.PROTECTED, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((res) => {
//       setUser(res.data);
//     })
//     .catch(() => {
//       localStorage.removeItem("token");
//       setUser(null);
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// }, []);

// const login = async (email, password) => {
//   const { auth } = await import("../firebase");
//   const { signInWithEmailAndPassword } = await import("firebase/auth");

//   let cred;
//   try {
//     cred = await signInWithEmailAndPassword(auth, email, password);
//     console.log("🔥 FIREBASE LOGIN OK:", cred.user.email);
//   } catch (err) {
//     console.error("❌ FIREBASE ERROR:", err.code);
//     throw new Error("FIREBASE_FAILED");
//   }

//   const firebaseToken = await cred.user.getIdToken();

//   try {
//     const response = await axios.post(
//       API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${firebaseToken}`,
//         },
//       }
//     );

//     const { access_token, user } = response.data;
//     localStorage.setItem("token", access_token);
//     setUser(user);
//     return user;

//   } catch (err) {
//     console.error("❌ BACKEND ERROR:", err.response?.status);
//     throw new Error("BACKEND_FAILED");
//   }
// };

// // const login = async (email, password) => {
// //   // 1️⃣ Firebase login (email/password)
// //   const { auth } = await import("../firebase");
// //   const { signInWithEmailAndPassword } = await import("firebase/auth");

// //   const cred = await signInWithEmailAndPassword(auth, email, password);

// //   // 2️⃣ Get Firebase ID token
// //   const firebaseToken = await cred.user.getIdToken();

// //   // 3️⃣ Send Firebase token to backend
// //   const response = await axios.post(
// //     API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
// //     {},
// //     {
// //       headers: {
// //         Authorization: `Bearer ${firebaseToken}`,
// //       },
// //     }
// //   );

// //   // 4️⃣ Backend responds with role + its own JWT
// //   const { access_token, user } = response.data;

// //   localStorage.setItem("token", access_token);
// //   setUser(user);

// //   return user;
// // };


//   const signup = async (name, email, password, role = 'citizen') => {
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('password', password);
//     formData.append('role', role);

//     const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
    
//     return response.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     signup,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };