import axios from "axios";
import { getDuration } from "./utils";
const baseURL = process.env.REACT_APP_BACKEND_URL;

// const getCall = async (url) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(baseURL + url)
//       .then((data) => {
//         resolve(data.data);
//       })
//       .catch((err) => reject(err));
//   });
// };
const getCall = async (url, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  try {
    const response = await axios.get(`${baseURL + url}?${queryParams}`);
    console.log("API Call Successful:", response.data); // Log response data
    return response.data;
  } catch (err) {
    console.error("Error in GET request:", err); // Log if request fails
    throw err;
  }
};

// Function to perform POST requests
const postCall = async (url, data) => {
  try {
    const response = await axios.post(baseURL + url, data);
    return response.data; // Return the response data
  } catch (err) {
    console.error("Error in POST request:", err);
    throw err; // Throw the error for further handling
  }
};

// Function to get home videos (example)
export const getHomeVideos = () => {
  return getCall("/compulsory-video");
};

// export const getMeditations = async (body) => {
//   console.log("Starting to fetch meditations...");
//   try {
//     const meds = await getCall("/meditation", body);

//     let meditationsArray = [];
//     if (Array.isArray(meds.meditations)) {
//       meditationsArray = meds.meditations;
//     } else if (meds && typeof meds === "object" && meds._id) {
//       meditationsArray = [meds];
//     }

//     console.log("Processing durations for meditations with meds ...", meds);
//     console.log(
//       "Processing durations for meditations with meditationArray...",
//       meditationsArray
//     );

//     for (let i = 0; i < meds.length; i++) {
//       meds[i].duration = meds[i].audio ? await getDuration(meds[i].audio) : "";
//     }

//     console.log("Fetched Meditations:", {
//       meditations: meds,
//       count: meds.length,
//     });

//     // Return the meditations and count
//     return { meditations: meditationsArray, count: meditationsArray.length };
//   } catch (err) {
//     console.log("Error fetching meditations:", err); // Log any errors
//     throw err;
//   }
// };

//   console.log("Starting to fetch meditations...");
//   try {
//     const { skip, take, mood, search } = body;
//     const query = new URLSearchParams({
//       skip,
//       take,
//       mood,
//       search,
//     }).toString(); // Format query params correctly

//     const meds = await getCall(`/meditation?${query}`); // Make sure the URL is formed correctly

//     console.log("API Response:", meds);

//     return meds;
//   } catch (err) {
//     console.log("Error fetching meditations:", err); // Log any errors
//     throw err;
//   }
// };
export const getMeditations = async (body) => {
  console.log("Starting to fetch meditations...");
  try {
    // const { skip, take, mood, search } = body;
    // const query = new URLSearchParams({
    //   skip,
    //   take,
    //   mood,
    //   search,
    // }).toString();
    // const meds = await getCall(`/meditation?${query}`);
    const meds = await postCall(`/meditation`, body);

    console.log("API Response:", meds);

    return meds;
  } catch (err) {
    console.log("Error fetching meditations:", err); // Log any errors
    throw err;
  }
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
