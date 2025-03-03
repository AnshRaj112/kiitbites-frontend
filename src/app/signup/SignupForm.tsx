import React, { useState, useCallback } from "react";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure Toastify works properly
import styles from "./styles/Signup.module.scss";
import GoogleSignup from "./GoogleSignup";

interface SignupFormState {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormState>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password) &&
    !/\s/.test(password);

  const notify = (message: string, type: "success" | "error") => {
    toast[type](message, { position: "bottom-right", autoClose: 3000 });
  };

  const handleSignup = async () => {
    if (!BACKEND_URL) {
      notify("Server configuration error. Please contact support.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        notify("Signup successful!", "success");
      } else {
        notify(data.message || "Signup failed. Try again.", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      notify("Network error. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !validateEmail(formData.email) || formData.phone.length !== 10) {
        notify("Please enter a valid name, email, and 10-digit phone number.", "error");
        return;
      }
    } else if (step === 2) {
      if (!validatePassword(formData.password) || formData.password !== formData.confirmPassword) {
        notify("Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.", "error");
        return;
      }
    } else if (step === 3 && !formData.gender) {
      notify("Please select your gender.", "error");
      return;
    }

    if (step < 3) {
      setStep((prevStep) => prevStep + 1);
    } else {
      handleSignup();
    }
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
      }));
    },
    []
  );

  const handleGenderSelection = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    setShowGenderDropdown(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Sign Up</h1>
        <form>
          {step === 1 && (
            <>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                type="text"
                placeholder="Full Name"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.passwordField}>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className={styles.passwordField}>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </>
          )}

          {step === 3 && (
            <div className={styles.genderField}>
              <input
                name="gender"
                value={formData.gender}
                readOnly
                placeholder="Gender"
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
              />
              <FaChevronDown
                className={styles.dropdownIcon}
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
              />
              {showGenderDropdown && (
                <ul className={styles.genderList}>
                  {["Male", "Female"].map((genderOption) => (
                    <li
                      key={genderOption}
                      onClick={() => handleGenderSelection(genderOption)}
                    >
                      {genderOption}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={step === 1 ? styles.buttons : styles.buttonsSpaced}>
            {step > 1 && (
              <button
                type="button"
                className={styles.stepButton}
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className={styles.stepButton}
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : step === 3 ? "Submit" : "Next"}
            </button>
          </div>

          {step === 1 && (
            <>
              <div className={styles.divider}>
                <span> OR </span>{" "}
              </div>
              <div className={styles.googleSignUp}>
                <GoogleSignup />
              </div> 

              <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Login
          </a>
        </p>
            </>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
