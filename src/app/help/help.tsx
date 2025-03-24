import React from "react";
import "./styles/help.module.scss"; 
import Form from "../components/HelpMessage"; // Import the Form component

const Help: React.FC = () => {
  return (
    <div className="help-container">
      <h1>Help Page</h1>
      <p>Find answers to common questions here.</p>
      <Form /> 
    </div>
  );
};

export default Help;
