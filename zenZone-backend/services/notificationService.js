const admin = require("../config/firebaseAdmin");
const userService = require("../services/userService");
const meditationService = require("../services/meditationService");
const moment = require("moment");

const pushNewMeditationNotification = async () => {
  console.log("Current time local: ", moment().toString());
  console.log("Current time UTC: ", moment().utc().toString());
  try {
    const todaysMed = await meditationService.getOneMeditation({
      date: new Date(moment.utc(moment()).format("YYYY-MM-DD").toString()),
    });
    if (todaysMed) {
      console.log("Sending Notification...");
      let count = 0;
      let skip = 0;
      do {
        const res = await userService.getAllPaged({ take: 1000, skip });
        skip += 1000;
        count = res.count - skip;
        const users = res.users;
        const tokens = users
          .filter((user) => !user.isTodaysMediationRead)
          .map((user) => user.firebaseToken);
        if (tokens.length) {
          const payload = {
            notification: {
              title: "Balanced Healing App for Heroes",
              body: "There is a new Meditation available. Check out now!",
            },
          };

          await admin
            .messaging()
            .sendToDevice(tokens, payload, { priority: "high" })
            .then((res) => console.log(JSON.stringify(res, null, 4)))
            .catch((err) => console.log(err));
        }
      } while (count > 0);
    } else {
      console.log("Meditation for Today not found");
    }
  } catch (error) {
    console.log(`Error in pushNewMeditationNotification method: ${error}`);
  }
};

const pushNewMeditationData = async () => {
  console.log("Current time local: ", moment().toString());
  console.log("Current time UTC: ", moment().utc().toString());
  try {
    await userService.updateMultiple({}, { isTodaysMediationRead: false });
    const today = moment.utc(moment()).format("YYYY-MM-DD").toString();
    const meditation = await meditationService.getOneMeditation({
      date: { $lte: new Date(today) },
    });
    const data = {
      title: meditation.title,
      description: meditation.description,
      image: meditation.image,
      audio: meditation.audio,
    };
    let count = 0;
    let skip = 0;
    do {
      const res = await userService.getAllPaged({ take: 1000, skip });
      skip += 1000;
      count = res.count - skip;
      const users = res.users;
      const tokens = users.map((user) => user.firebaseToken);
      if (tokens.length) {
        const payload = {
          notification: {},
          data,
        };
        const options = {
          contentAvailable: true,
        };

        admin
          .messaging()
          .sendToDevice(tokens, payload, options)
          .then((res) => console.log(JSON.stringify(res, null, 4)))
          .catch((err) => console.log(err));
      }
    } while (count > 0);
  } catch (error) {
    console.log(`Error in pushNewMeditationData method: ${error}`);
  }
};

module.exports = {
  pushNewMeditationNotification,
  pushNewMeditationData,
};
