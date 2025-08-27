// routes/chatRoutes.js
const express = require("express");
const router = express.Router();

const DEFAULT_MODEL = "gpt2";

async function callHF({ model, token, prompt }) {
  const r = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  const txt = await r.text();
  let data;
  try {
    data = JSON.parse(txt);
  } catch {
    data = txt;
  }
  return { ok: r.ok, status: r.status, data, raw: txt };
}

router.post("/message", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const HF_MODEL = process.env.HF_MODEL || "tanusrich/Mental_Health_Chatbot";
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN)
      return res.status(500).json({ error: "HF_TOKEN not configured" });

    let result = await callHF({ model: HF_MODEL, token: HF_TOKEN, prompt });

    if (
      !result.ok &&
      [404, 503].includes(result.status) &&
      HF_MODEL !== DEFAULT_MODEL
    ) {
      console.warn(
        `[chat] ${HF_MODEL} -> ${result.status}. Retrying with ${DEFAULT_MODEL}`
      );
      result = await callHF({ model: DEFAULT_MODEL, token: HF_TOKEN, prompt });
    }

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ error: `HF error (${result.status}): ${result.raw}` });
    }

    const data = result.data;
    let reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data?.generated_text
        ? data.generated_text
        : typeof data === "string"
        ? data
        : JSON.stringify(data);

    res.json({ reply });
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/ping", (req, res) =>
  res.json({ ok: true, route: "/api/v1/chat" })
);
module.exports = router;
