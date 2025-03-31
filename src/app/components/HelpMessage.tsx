import React from "react";
import styles from "./styles/HelpPage.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormProps {
  formData: { name: string; email: string; message: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: { [key: string]: string };
}

const HelpMessage: React.FC<FormProps> = ({ formData, handleChange, handleSubmit, errors }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={styles.input}
          />
          {errors.name && <p>{errors.name}</p>}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className={styles.input}
          />
          {errors.email && <p>{errors.email}</p>}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className={styles.input}
          />
          {errors.message && <p>{errors.message}</p>}

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default HelpMessage;
