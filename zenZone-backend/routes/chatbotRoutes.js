// chatbotRoutes.js
const express = require("express");
const { getChatbotResponse } = require("../controllers/chatbotController"); // Import the function

const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body; // Extract the message from the request body
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call the chatbot model with the user input
    const response = await getChatbotResponse(message);

    // Send the chatbot response back to the client
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
