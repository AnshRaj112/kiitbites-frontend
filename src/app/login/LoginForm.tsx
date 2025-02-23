import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import styles from "./styles/Login.module.scss";
import GoogleLogin from "./GoogleLogin";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notify = (message, type) => {
    toast[type](message, { position: "bottom-right", autoClose: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      notify("Please fill all the fields.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (res.ok) {
        notify("Login successful!", "success");
      } else {
        notify(
          responseData.message || "Login failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      notify("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <input
              key={field}
              name={field}
              type={field === "password" && !showPassword ? "password" : "text"}
              placeholder={
                field === "identifier"
                  ? "Username, Email, or Phone"
                  : "Password"
              }
              value={formData[field]}
              onChange={handleInputChange}
              required
              style={{ color: "black" }}
            />
          ))}
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        <div
          style={{
            backgroundColor: "#4ea199",
            color: "black",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1em",
            textAlign: "center",
            margin: "10px 0",
          }}
          className={styles.googleSignUp}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#01796f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4ea199")
          }
        >
          <GoogleLogin />
        </div>
        <div className={styles.register}>
          <p className={styles["text-black"]}>
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
