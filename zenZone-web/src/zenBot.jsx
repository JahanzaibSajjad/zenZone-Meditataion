import React, { useState, useEffect, useRef } from "react";
import { db } from "./services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { INTENTS } from "./data/intent"; // Import the enhanced intents

const ZenBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m ZenBot. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [previousIntent, setPreviousIntent] = useState(""); // Track previous intent
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const logToFirestore = async (userText, botReply) => {
    try {
      await addDoc(collection(db, "chat_logs"), {
        userText,
        botReply,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error logging to Firestore: ", error);
    }
  };

  // This function is invoked when the user sends a message
  const send = async () => {
    const msg = input.trim();
    if (!msg) return;

    // Add user message to the conversation
    setMessages((m) => [...m, { from: "user", text: msg }]);
    setInput("");

    // Check for a matched intent based on the user's input
    const matchedIntent = matchIntent(msg);
    if (matchedIntent) {
      setPreviousIntent(matchedIntent.id); // Save the previous intent
      const reply = matchedIntent.reply(matchedIntent.id, setMessages); // Execute the reply function for the matched intent
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      await logToFirestore(msg, reply);
    } else {
      // If no intent is matched, return a fallback message
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Sorry, I couldn't understand that. Can you rephrase?",
        },
      ]);
      await logToFirestore(msg, "Sorry, I couldn't understand that.");
    }
  };

  // This function matches the user message with predefined intents
  const matchIntent = (message) => {
    const lowerMessage = message.toLowerCase();

    // Match for greeting (hi, hello, etc.)
    if (
      ["hi", "hello", "hey", "good morning", "good evening"].includes(
        lowerMessage
      )
    ) {
      return INTENTS.find((intent) => intent.id === "greeting");
    }
    //exercises
    if (
      lowerMessage.includes("progressive muscle relaxation") ||
      lowerMessage.includes("pmr") ||
      lowerMessage.includes("progressive muscle")
    ) {
      return INTENTS.find((intent) => intent.id === "explain_pmr_exercise");
    }
    if (lowerMessage.includes("yoga")) {
      return INTENTS.find((intent) => intent.id === "explain_yoga_exercise");
    }

    if (lowerMessage.includes("stretching")) {
      return INTENTS.find(
        (intent) => intent.id === "explain_stretching_exercise"
      );
    }
    if (
      lowerMessage.includes("tai chi for relaxation") ||
      lowerMessage.includes("tai chi")
    ) {
      return INTENTS.find((intent) => intent.id === "explain_tai_chi_exercise");
    }
    // Match for Breathing Exercise explanation
    if (
      lowerMessage.includes("box-breathing") ||
      lowerMessage.includes("exercise for breathing") ||
      lowerMessage.includes("breathing")
    ) {
      return INTENTS.find(
        (intent) => intent.id === "explain_breathing_exercise"
      );
    }
    if (
      [
        "thanks",
        "thank you",
        "thank you very much",
        "oh okay thank you so much",
        "thank you so much",
        "thanks a lot",
        "appreciate it",
        "cheers",
        "thanks so much",
      ].includes(lowerMessage)
    ) {
      return INTENTS.find((intent) => intent.id === "thanks");
    }

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("focus") ||
      lowerMessage.includes("relaxation")
    ) {
      // Match for meditation-related queries
      if (lowerMessage.includes("stress")) {
        return INTENTS.find(
          (intent) => intent.id === "recommend_stress_meditation"
        );
      }
      if (lowerMessage.includes("sleep")) {
        return INTENTS.find(
          (intent) => intent.id === "recommend_sleep_meditation"
        );
      }
      if (lowerMessage.includes("focus")) {
        return INTENTS.find(
          (intent) => intent.id === "recommend_focus_meditation"
        );
      }
      if (lowerMessage.includes("relaxation")) {
        return INTENTS.find(
          (intent) => intent.id === "recommend_relaxation_meditation"
        );
      }
    }
    if (
      lowerMessage.includes("tips") ||
      lowerMessage.includes("wellness-tips")
    ) {
      return INTENTS.find((intent) => intent.id === "wellness_tips");
    }

    // Match for exercise suggestions
    if (lowerMessage.includes("exercise") || lowerMessage.includes("workout")) {
      return INTENTS.find((intent) => intent.id === "suggest_exercises");
    }

    if (["go for it"].some((word) => lowerMessage.includes(word))) {
      return INTENTS.find(
        (intent) => intent.id === "affirmative_response_exercise"
      );
    }

    if (lowerMessage.includes("wellness")) {
      return INTENTS.find((intent) => intent.id === "ask_about_wellness");
    }

    // Match for system/platform-related queries
    if (
      lowerMessage.includes("system") ||
      lowerMessage.includes("zenzone") ||
      lowerMessage.includes("platform") ||
      lowerMessage.includes("offer") ||
      lowerMessage.includes("website")
    ) {
      return INTENTS.find((intent) => intent.id === "ask_about_system");
    }

    // Match for meditation guidance (e.g., "how to meditate")
    if (
      lowerMessage.includes("how to meditate") ||
      lowerMessage.includes("what is meditation") ||
      lowerMessage.includes("can you guide me about meditation")
    ) {
      return INTENTS.find((intent) => intent.id === "ask_about_meditation");
    }

    // Match for positive responses (Yes/No)

    // Fallback to handle any unmatched messages
    return INTENTS.find((intent) =>
      intent.patterns.some((pattern) => pattern.test(lowerMessage))
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 2147483647,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#1e2a78",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "12px 16px",
          cursor: "pointer",
          marginBottom: 8,
        }}
      >
        {open ? "Close ZenBot" : "Chat with ZenBot"}
      </button>

      {open && (
        <div
          style={{
            width: 320,
            height: 460,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#1e2a78",
              color: "white",
              padding: "10px 14px",
              fontWeight: 600,
            }}
          >
            ZenBot — Wellness Assistant
          </div>

          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              background: "#f8f9fc",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: m.from === "user" ? "#E7EAFE" : "white",
                    border: "1px solid #e6e8f0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              background: "white",
              borderTop: "1px solid #eef1f6",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{
                flex: 1,
                border: "1px solid #d8dbe6",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            />
            <button
              onClick={send}
              style={{
                background: "#1e2a78",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenBot;
