import axios from "axios";
import { getDuration } from "./utils";
const baseURL = process.env.REACT_APP_BACKEND_URL;

const getCall = async (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(baseURL + url)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => reject(err));
  });
};

const postCall = async (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + url, data)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => reject(err));
  });
};

export const getHomeVideos = () => {
  return new Promise((resolve, reject) => {
    getCall("/compulsory-video")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const getMeditations = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const meds = await postCall("/meditation", {
        ...body,
        ...{ filter: "past" },
      });
      for (let i = 0; i < meds.meditations.length; i++) {
        meds.meditations[i].duration = meds.meditations[i].audio
          ? await getDuration(meds.meditations[i].audio)
          : "";
      }
      resolve(meds);
    } catch (err) {
      reject(err);
    }
  });
};

export const getBiochemVideos = () => {
  return new Promise((resolve, reject) => {
    getCall("/video")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const getBooks = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const books = await postCall("/book", body);
      resolve(books);
    } catch (err) {
      reject(err);
    }
  });
};

export const getPodcasts = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const books = await postCall("/podcast", body);
      resolve(books);
    } catch (err) {
      reject(err);
    }
  });
};

export const getWebsites = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const websites = await postCall("/website", body);
      resolve(websites);
    } catch (err) {
      reject(err);
    }
  });
};

export const getEvents = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = await postCall("/event", {
        ...body,
        ...(!body.date && { filter: "upcoming" }),
      });
      resolve(events);
    } catch (err) {
      reject(err);
    }
  });
};

export const sendEmail = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await postCall("/user/send-email", body);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export async function askZenBot(message) {
  try {
    const base =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/v1";
    const r = await fetch(`${base}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });
    if (!r.ok) {
      const t = await r.text();
      return { reply: `Server error: ${t}` };
    }
    return await r.json(); // { reply: "...", ... }
  } catch (e) {
    console.error(e);
    return { reply: "Network error. Please try again." };
  }
}
