"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles/help.module.scss";
import Form from "../components/HelpMessage"; 


const Help: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: { [key: string]: string } = {}; // Changed from let to const
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) formErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) formErrors.email = "Invalid email format";
    if (!formData.message) formErrors.message = "Message is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!BACKEND_URL) {
      toast.error("Server configuration error. Please contact support.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        toast.success("Message sent successfully!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    
    <div className={styles.container}>
   
    <Form
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
    />
    <ToastContainer position="bottom-right" autoClose={3000} />
  </div>
  );
  
  
};

export default Help;
