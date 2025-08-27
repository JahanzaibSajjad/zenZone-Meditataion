require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/database");
const cron = require("node-cron");
const PORT = process.env.PORT || 5000;
const {
  pushNewMeditationNotification,
  pushNewMeditationData,
} = require("./services/notificationService");

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(cors());
app.use(cors());

//cron schedule for notification
cron.schedule("0 8,18 * * *", pushNewMeditationNotification, {
  timezone: "Etc/UTC",
});
cron.schedule("0 0 * * *", pushNewMeditationData, {
  timezone: "Etc/UTC",
});

//Routes
app.use("/api/v1/chat", require("./routes/chatRoutes"));
app.use("/api/v1/meditation", require("./routes/meditationRoutes"));
app.use("/api/v1/mood", require("./routes/moodRoutes"));
app.use("/api/v1/sheet", require("./routes/sheetRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/aws", require("./routes/awsRoutes"));
app.use("/api/v1/event", require("./routes/eventRoutes"));
app.use("/api/v1/video", require("./routes/videoRoutes"));
app.use("/api/v1/compulsory-video", require("./routes/compulsoryVideoRoutes"));
app.use("/api/v1/book", require("./routes/bookRoutes"));
app.use("/api/v1/podcast", require("./routes/podcastRoutes"));
app.use("/api/v1/website", require("./routes/websiteRoutes"));

db.then(() => {
  console.log("Database Connected Successfully");
  app.listen(
    PORT,
    console.log(
      `Server Started on PORT: ${PORT}`,
      console.log(process.env.HF_MODEL)
    )
  );
}).catch((err) => console.log("Database Connection Error: ", err));
