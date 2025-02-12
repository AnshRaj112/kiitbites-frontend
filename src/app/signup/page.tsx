// "use client";

// import React, { useState, useContext, useEffect } from "react";
// import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { useRouter } from "next/navigation";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import AuthContext from "../context/AuthContext";
// import axios from "axios";
// import styles from "./styles/Signup.module.scss";

// interface GoogleTokenResponse {
//   access_token: string;
// }

// export default function SignupPage() {
//   const authCtx = useContext(AuthContext);
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [alert, setAlert] = useState<string | null>(null);
//   const [googleClientId, setGoogleClientId] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//       if (!clientId) {
//         setAlert("Google client ID is missing. Please check your environment variables.");
//         return;
//       }
//       setGoogleClientId(clientId);
//     }
//   }, []);

//   const googleSignup = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       await handleGoogleSignup(tokenResponse);
//     },
//     onError: (error) => console.error("Google signup failed:", error),
//   });

//   if (!googleClientId || !authCtx) {
//     if (!authCtx) {
//       console.error("AuthContext is undefined. Ensure AuthProvider is wrapping this component.");
//     }
//     return <div>Loading...</div>;
//   }

//   const handleGoogleSignup = async (tokenResponse: GoogleTokenResponse) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/googleAuth`,
//         { access_token: tokenResponse.access_token },
//         { withCredentials: true }
//       );

//       if (response.status === 200 || response.status === 201) {
//         const user = response.data.user;
//         setAlert("Signup successful! Logged in.");

//         authCtx.login(
//           user.name,
//           user.email,
//           user.img,
//           user.rollNumber,
//           user.school,
//           user.college,
//           user.contactNo,
//           user.year,
//           user.access,
//           user.editProfileCount,
//           user.regForm,
//           user.blurhash,
//           response.data.token,
//           9600000
//         );

//         setTimeout(() => {
//           router.push("/");
//         }, 800);
//       } else {
//         setAlert("Google signup failed. Please try again.");
//       }
//     } catch (error) {
//       setAlert("Error during Google signup. Please try again.");
//       console.error("Google Auth API error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!username || !email || !phone || !password || !confirmPassword) {
//       setAlert("Please fill all the fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setAlert("Passwords do not match!");
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, email, phone, password }),
//       });
//       if (res.ok) {
//         setUsername("");
//         setEmail("");
//         setPhone("");
//         setPassword("");
//         setConfirmPassword("");
//         setAlert("Signup successful!");
//         setTimeout(() => router.push("/login"), 800);
//       } else {
//         const errorData = await res.json();
//         setAlert(errorData.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       setAlert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={googleClientId}>
//       <div className={styles.container}>
//         <div className={styles.box}>
//           <h1>Sign Up</h1>
//           {alert && <div className={styles.alert}>{alert}</div>}
//           <form onSubmit={handleSubmit}>
//             <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//             <div className={styles.passwordField}>
//               <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//               </span>
//             </div>
//             <div className={styles.passwordField}>
//               <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//               <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
//               </span>
//             </div>
//             <button type="submit">Sign Up</button>
//           </form>
//           <div className={styles.divider}>OR</div>
//           <div className={styles.googleSignUp} onClick={() => googleSignup()}>{isLoading ? "Signing up..." : "Sign up with Google"}</div>
//           <p className={styles.alreadyAccount}>Already have an account? <a href="/login" className={styles.loginLink}>Login</a></p>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

"use client";

import SignupForm from "./SignupForm";


export default function SignupPage() {
  return (
    <div>
      <SignupForm />
    </div>
  );
}
