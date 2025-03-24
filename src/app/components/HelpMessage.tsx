import React from "react";

interface FormProps {
  formData: { name: string; email: string; message: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: { [key: string]: string };
}

const HelpMessage: React.FC<FormProps> = ({ formData, handleChange, handleSubmit, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
      />
      {errors.name && <p>{errors.name}</p>}
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email"
      />
      {errors.email && <p>{errors.email}</p>}
      
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your Message"
      />
      {errors.message && <p>{errors.message}</p>}
      
      <button type="submit">Send</button>
    </form>
  );
};

export default HelpMessage;
