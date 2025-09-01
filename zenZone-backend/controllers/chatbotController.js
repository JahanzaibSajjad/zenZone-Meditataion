require("dotenv").config(); // This loads the environment variables from .env file
const { HfInference } = require("@huggingface/inference");

// Initialize the Hugging Face API client using the token from .env file
const hf = new HfInference(process.env.HF_TOKEN); // Use the HF_TOKEN from the .env file

// Function to interact with the chatbot
const getChatbotResponse = async (userInput) => {
  try {
    const response = await hf.textGeneration({
      // model: process.env.HF_MODEL,
      model: "microsoft/DialoGPT-medium",
      inputs: userInput,
    });
    console.log("Hugging Face Model Response:", response); // Log the entire response
    return (
      response.generated_text ||
      "Sorry, I couldn't process that. Please try again."
    );
  } catch (error) {
    console.error("Error generating response:", error);
    return "Sorry, I couldn't process that. Please try again.";
  }
};

module.exports = { getChatbotResponse };
