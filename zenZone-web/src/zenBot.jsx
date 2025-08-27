import React, { useEffect, useRef, useState } from "react";
import { db } from "./services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const KB = [
  {
    q: [
      "how to start meditation",
      "beginner",
      "first time",
      "tips for meditation",
    ],
    a: "Great to start! Pick a short 5–10 minute guided session in Meditation. Sit comfortably, breathe naturally, and when your mind wanders, gently bring it back to the breath.",
  },
  {
    q: ["sleep", "can’t sleep", "insomnia tips", "night routine"],
    a: "For sleep: avoid screens 30 mins before bed, try our *Sleep* meditations (10–20 min), and do slow exhale breathing (4-in, 6-out) for 2–3 mins.",
  },
  {
    q: ["anxiety", "panic", "stressed", "calm down"],
    a: "Try a 60-sec box-breathing: 4-in, hold 4, out 4, hold 4. I can guide you — just say *start breathing*.",
  },
  {
    q: [
      "nutrition consultation",
      "diet help",
      "speak to nutritionist",
      "contact nutrition",
    ],
    a: "Open **Nutrition Consultation** and submit the form. Your request is emailed to admins who’ll arrange a follow-up.",
  },
  {
    q: ["books", "podcasts", "library", "resources"],
    a: "Open **Library** to find curated *Books*, *Podcasts*, and *Websites*. Use the search box to filter by title.",
  },
  {
    q: ["events", "meeting", "sessions schedule"],
    a: "Open **Events** to see upcoming meetings. You can search by title or use the date picker.",
  },
];

// simple word-overlap score (fast & good enough)
function kbBestMatch(message) {
  const m = message.toLowerCase();
  const words = m.split(/[^a-z]+/).filter(Boolean);
  let best = { score: 0, a: null };
  for (const item of KB) {
    const keybag = item.q
      .join(" ")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean);
    const overlap = words.filter((w) => keybag.includes(w)).length;
    if (overlap > best.score) best = { score: overlap, a: item.a };
  }
  return best.score >= 2 ? best.a : null; // require min overlap
}

function detectMood(message) {
  const m = message.toLowerCase();
  if (/(anxious|anxiety|panic|overwhelm|stressed|stress)/.test(m))
    return "anxiety";
  if (/(sleep|insomnia|tired|awake)/.test(m)) return "sleep";
  if (/(sad|down|low|depress)/.test(m)) return "low_mood";
  if (/(focus|distract|concentrate|study|work)/.test(m)) return "focus";
  return null;
}

const INTENTS = [
  {
    id: "start_breathing",
    patterns: /(start )?(breath|breathing|box breathing)/i,
    reply: () => "__BREATHING_AWAIT__",
  },
  {
    id: "greeting",
    patterns: [/^hi$|^hello$|hey|good (morning|afternoon|evening)/i],
    reply: () =>
      "Hi! I’m ZenBot. Say “I feel anxious”, “start breathing”, “open library”, or “what’s the time?”",
  },
  {
    id: "site_help",
    patterns: [/how (do|to) (use|start)|what can you do|help/i],
    reply: () =>
      "Try: “I feel anxious”, “recommend sleep meditation”, “open library”, “nutrition consultation”, “start breathing”, or “what’s the time?”",
  },
  {
    id: "start_breathing",
    // ✅ even a single regex is fine; matchIntent will wrap it
    patterns: /(start )?(breath|breathing|box breathing)/i,
    reply: () => "__BREATHING_FLOW__",
  },
  {
    id: "time_now",
    patterns: /what('?s| is) the time|time now|date|today/i,
    reply: () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `It’s ${time} on ${date}.`;
    },
  },
  {
    id: "thanks",
    patterns: /thanks|thank you|cheers|bye|goodbye/i,
    reply: () => "You’re welcome! I’m here if you need anything else. 🌿",
  },
];

const BREATH_STEPS = [
  "Let’s do box-breathing for 60 seconds. Sit comfortably. Ready? We’ll do 4 cycles.",
  "Cycle 1 — Inhale 4… 1…2…3…4… Hold 4… 1…2…3…4… Exhale 4… 1…2…3…4… Hold 4… 1…2…3…4…",
  "Cycle 2 — Inhale… Hold… Exhale… Hold… (keep your shoulders relaxed).",
  "Cycle 3 — Inhale… Hold… Exhale… Hold… (slow, gentle breath).",
  "Cycle 4 — Inhale… Hold… Exhale… Hold…",
  "Nice work. Notice how you feel now. You can try a Calm/Anxiety meditation next.",
];

export default function ZenBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I’m ZenBot. I can guide a 60-sec breathing exercise, recommend meditations by mood, and answer basic wellness questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState(null); // "breathing" or null
  const [flowStep, setFlowStep] = useState(0);
  const endRef = useRef(null);
  const cancelRef = useRef(false);
  const BREATH_INTRO =
    "We’ll do 4 cycles of box-breathing (inhale 4 • hold 4 • exhale 4 • hold 4). " +
    "Sit comfortably. **Say ‘ready’** to begin, or **‘cancel’** to stop.";
  const BREATH_STEPS = [
    "Cycle 1 — Inhale 4… 1…2…3…4… Hold 4… 1…2…3…4… Exhale 4… 1…2…3…4… Hold 4… 1…2…3…4…",
    "Cycle 2 — Inhale… Hold… Exhale… Hold… (keep your shoulders relaxed).",
    "Cycle 3 — Inhale… Hold… Exhale… Hold… (slow, gentle breath).",
    "Cycle 4 — Inhale… Hold… Exhale… Hold…",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const logToFirestore = async (userText, botReply, intentId) => {
    try {
      await addDoc(collection(db, "chat_logs"), {
        userText,
        botReply,
        intentId: intentId || "fallback",
        createdAt: serverTimestamp(),
      });
    } catch {}
  };
  function startBreathingAwait() {
    setFlow("breathing-await");
    setFlowStep(0);
    setMessages((m) => [...m, { from: "bot", text: BREATH_INTRO }]);
  }

  // Progress breathing flow with slight delays for realism
  async function runBreathingFlow() {
    cancelRef.current = false;
    setFlow("breathing-running");
    setFlowStep(0);

    // brief “get ready”
    setMessages((m) => [
      ...m,
      { from: "bot", text: "Great. We’ll begin in 3…2…1…" },
    ]);
    await new Promise((r) => setTimeout(r, 900));

    for (let i = 0; i < BREATH_STEPS.length; i++) {
      if (cancelRef.current) break;
      setMessages((m) => [...m, { from: "bot", text: BREATH_STEPS[i] }]);
      setFlowStep(i + 1);
      await new Promise((r) => setTimeout(r, 2500)); // pacing
    }

    if (!cancelRef.current) {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Nice work. Notice how you feel. Try a **Calm/Anxiety** meditation next or say *again* to repeat.",
        },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Flow cancelled. Whenever you’re ready, say *start breathing* again.",
        },
      ]);
    }

    setFlow(null);
    setFlowStep(0);
  }

  // allow user to stop mid-flow
  function cancelBreathing() {
    cancelRef.current = true;
    setFlow("breathing-cancelled");
  }

  function toArray(x) {
    if (Array.isArray(x)) return x;
    if (x == null) return [];
    return [x]; // wrap single RegExp or string
  }

  function asRegex(pat) {
    if (pat instanceof RegExp) return pat;
    // if someone wrote a plain string, make it case-insensitive regex
    return new RegExp(String(pat), "i");
  }

  function matchIntent(message) {
    const msg = String(message);
    for (const intent of INTENTS) {
      const patterns = toArray(intent.patterns).filter(Boolean).map(asRegex);

      if (patterns.length && patterns.some((re) => re.test(msg))) {
        return intent;
      }
    }
    return null;
  }

  const send = async () => {
    const msg = input.trim();
    if (!msg) return;

    setMessages((m) => [...m, { from: "user", text: msg }]);
    setInput("");

    const lower = msg.toLowerCase();

    // -------------------------------
    // 0) FLOW CONTROL COMES FIRST
    // -------------------------------

    // Waiting for user to confirm the breathing flow
    if (flow === "breathing-await") {
      if (/^(ready|yes|yep|start|go|let'?s go)$/i.test(lower)) {
        // acknowledge and start
        setMessages((m) => [
          ...m,
          { from: "bot", text: "Great. We’ll begin in 3…2…1…" },
        ]);
        setFlow("breathing-running");
        try {
          await logToFirestore(msg, "[breathing: begin]", "breathing_begin");
        } catch {}
        // kick off your paced prompts
        runBreathingFlow();
        return;
      }
      if (/^(cancel|stop|not now|later)$/i.test(lower)) {
        setFlow(null);
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: "No problem. Say *start breathing* whenever you want to try.",
          },
        ]);
        try {
          await logToFirestore(
            msg,
            "[breathing: cancelled at await]",
            "breathing_cancel"
          );
        } catch {}
        return;
      }
      // any other input while awaiting
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Say **‘ready’** to begin or **‘cancel’** to stop.",
        },
      ]);
      return;
    }

    // Flow is running – allow stop; otherwise guide the user
    if (flow === "breathing-running") {
      if (/^(stop|cancel|enough|pause|end)$/i.test(lower)) {
        // If you have a cancel API, call it; otherwise set a ref in runBreathingFlow.
        if (typeof cancelBreathing === "function") cancelBreathing();
        setFlow(null);
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: "Flow cancelled. Say *start breathing* to try again.",
          },
        ]);
        try {
          await logToFirestore(
            msg,
            "[breathing: cancelled mid-flow]",
            "breathing_cancel"
          );
        } catch {}
        return;
      }
      setMessages((m) => [
        ...m,
        { from: "bot", text: "We’re mid-flow. Say **‘stop’** to cancel." },
      ]);
      return;
    }

    // -------------------------------
    // 1) HANDLE EXPLICIT INTENTS
    // -------------------------------

    const intent = matchIntent(msg);
    if (intent) {
      const out =
        typeof intent.reply === "function" ? intent.reply(msg) : intent.reply;

      // Instead of starting immediately, move to an "await" state
      if (out === "__BREATHING_FLOW__" || out === "__BREATHING_AWAIT__") {
        setFlow("breathing-await");
        const intro =
          "We’ll do 4 cycles of box-breathing (inhale 4 • hold 4 • exhale 4 • hold 4). " +
          "Sit comfortably. **Say ‘ready’** to begin, or **‘cancel’** to stop.";
        setMessages((m) => [...m, { from: "bot", text: intro }]);
        try {
          await logToFirestore(msg, intro, "breathing_intro");
        } catch {}
        return;
      }

      setTimeout(async () => {
        setMessages((m) => [...m, { from: "bot", text: out }]);
        try {
          await logToFirestore(msg, out, intent.id);
        } catch {}
      }, 250);
      return;
    }

    // -------------------------------
    // 2) MOOD / SENTIMENT → RECS
    // -------------------------------
    const mood = detectMood(msg);
    if (mood) {
      let reply = "";
      if (mood === "anxiety")
        reply =
          "I’m here with you. Try **Calm & Anxiety Relief** meditations (Meditation → filter: Calm/Anxiety). Or say *start breathing* and I’ll guide you for 60 seconds.";
      else if (mood === "sleep")
        reply =
          "Sleep can be tricky. Try **Sleep** meditations (10–20 min). Dim lights, slow your exhale. I can also guide a 60-sec breath — say *start breathing*.";
      else if (mood === "low_mood")
        reply =
          "I’m sorry you’re feeling low. Try **Uplift/Gratitude** meditations (Meditation → filter: Uplift). A short compassion practice can help.";
      else if (mood === "focus")
        reply =
          "Let’s get centered. Try **Focus** meditations (5–10 min). A quick breath cycle can prime attention — say *start breathing*.";

      setTimeout(async () => {
        setMessages((m) => [...m, { from: "bot", text: reply }]);
        try {
          await logToFirestore(msg, reply, "mood_recommend");
        } catch {}
      }, 250);
      return;
    }

    // -------------------------------
    // 3) KNOWLEDGE BASE (FUZZY)
    // -------------------------------
    const kb = kbBestMatch(msg);
    if (kb) {
      setTimeout(async () => {
        setMessages((m) => [...m, { from: "bot", text: kb }]);
        try {
          await logToFirestore(msg, kb, "kb_answer");
        } catch {}
      }, 250);
      return;
    }

    // -------------------------------
    // 4) FALLBACK
    // -------------------------------
    const fallback =
      "I’m not sure I got that. You can say: *start breathing*, *I feel anxious*, *open library*, *nutrition consultation*, or *what’s the time?*";
    setTimeout(async () => {
      setMessages((m) => [...m, { from: "bot", text: fallback }]);
      try {
        await logToFirestore(msg, fallback, "fallback");
      } catch {}
    }, 250);
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
            ZenBot — Wellness Assistant{" "}
            {flow === "breathing" ? "• Breathing" : ""}
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
}
