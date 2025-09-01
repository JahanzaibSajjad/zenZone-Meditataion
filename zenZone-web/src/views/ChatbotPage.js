import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/chatbot/chatbot";
import Navbar from "../components/common/Navbar"; // Ensure Navbar is imported
import "../components/chatbot/chatbot.css";

const ChatbotPage = () => {
  return (
    <div className="chatbot-page">
      {/* Navbar remains fixed at the top */}
      <Navbar />

      {/* Chatbot Container - Centered with proper spacing */}
      <div className="chatbot-container">
        <h2>Chat with ZenBot</h2>
        <Chatbot />
      </div>
    </div>
  );
};

export default ChatbotPage;
