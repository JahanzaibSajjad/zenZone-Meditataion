import React, { useState } from "react";
import { sendChatMessage } from "../../services/APIsService"; // Your API service

const Chatbot = () => {
  const [userInput, setUserInput] = useState(""); // State to manage user input
  const [chatResponse, setChatResponse] = useState(""); // State to manage chatbot's response
  const [loading, setLoading] = useState(false); // State to handle loading spinner or text
  const [error, setError] = useState(null); // State to handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Input: ", userInput); // Log the user input

    if (!userInput.trim()) {
      setError("Please enter a message!");
      return;
    }

    setLoading(true); // Start loading when the request is sent
    setError(null); // Clear any previous errors
    try {
      const response = await sendChatMessage(userInput); // API call to send the message
      console.log("Chatbot Response: ", response); // Log the response from backend
      setChatResponse(response); // Display the chatbot's response
      setUserInput(""); // Clear the input after sending the message
    } catch (error) {
      console.error("Error:", error);
      setError("Sorry, there was an issue. Please try again."); // Display error to the user
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <div className="chatbot-container">
      <h1>Chat with ZenBot</h1>
      <form onSubmit={handleSubmit} className="chatbot-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-button">
          {loading ? "Sending..." : "Send"} {/* Show loading state */}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Show error message */}
      <div className="chatbot-response">
        <p>
          <strong>Bot:</strong> {chatResponse}
        </p>{" "}
        {/* Show chatbot's response */}
      </div>
    </div>
  );
};

export default Chatbot;
