import React from "react";


import styles from "./help.module.scss";

const Form: React.FC = () => {
  return (
    <div className="form-container">
      <h2>Get In Touch</h2>
      <form>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="message" placeholder="Message" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
