export const customIcons = {
  play: <i className="fa fa-play playIcon"></i>,
  pause: <i className="fa fa-pause playIcon"></i>,
};

export const defaultMeditation = {
  title: "",
  date: "",
  description: "",
  audio: "",
  image: "",
};

export const defaultBook = {
  title: "",
  url: "",
  description: "",
  cover: "",
};

export const defaultPodcast = {
  title: "",
  url: "",
  cover: "",
};

export const defaultWebsite = {
  title: "",
  url: "",
};

export const defaultSheet = {
  title: "",
  detail: "",
};

export const defaultVideo = {
  url: "",
  description: "",
  title: "",
};

export const defaultEvent = {
  title: "",
  location: "",
  date: "",
  detail: "",
};

export const updateToast = {
  className: "updateToast",
  iconTheme: {
    primary: "white",
    secondary: "#3a3a73",
  },
};

export const successToast = {
  className: "successToast",
  iconTheme: {
    primary: "white",
    secondary: "#76d89c",
  },
};

export const errorToast = {
  className: "errorToast",
  iconTheme: {
    primary: "white",
    secondary: "red",
  },
};

export const meditationDeleteMessage = `Are you sure you want to delete this Meditation?`;

export const videoDeleteMessage = `Are you sure you want to delete this Biochemical Screen Video?`;

export const moodDeleteMessage = `Are you sure you want to delete this Mood?`;

export const sheetDeleteMessage = `Are you sure you want to delete this Sheet?<br/> This sheet might be linked with Moods`;

export const eventDeleteMessage = `Are you sure you want to delete this Meeting & Event?`;

export const bookDeleteMessage = `Are you sure you want to delete this Book?`;

export const podcastDeleteMessage = `Are you sure you want to delete this Podcast?`;

export const websiteDeleteMessage = `Are you sure you want to delete this Website?`;

//styles for the webview in mobile phones
export const fontClasses = `<style> * {font-family: sans-serif;} .ql-font-serif, .ql-font-serif * { font-family: serif !important; } .ql-font-san-serif, .ql-font-san-serif * { font-family: sans-serif !important; } .ql-font-monospace, .ql-font-monospace * { font-family: monospace !important; } </style>`;
