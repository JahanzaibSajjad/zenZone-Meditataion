const moodService = require("../services/moodService");
const sheetService = require("../services/sheetService");

const getOneMood = async (req, res) => {
  moodService
    .getOneMood({
      _id: req.params.id,
    })
    .then((mood) => res.status(200).send(mood ? mood : "Mood not Found"))
    .catch((err) => res.status(500).send(err));
};

const getAllMoods = async (req, res) => {
  moodService
    .getAllMoods(req.body)
    .then((moods) => res.status(200).send(moods))
    .catch((err) => res.status(500).send(err));
};

const updateMood = async (req, res) => {
  moodService
    .updateMood(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((moods) => res.status(200).send(moods))
    .catch((err) => res.status(500).send(err));
};

const deleteMood = async (req, res) => {
  moodService
    .deleteMood({ _id: req.params.id })
    .then(() => res.status(200).send("Mood is deleted!"))
    .catch((err) => res.status(500).send(err));
};

const addMood = async (req, res) => {
  try {
    const { title, sheetId } = req.body;
    const sheet = await sheetService.getOneSheet({ _id: sheetId });
    const mood = await moodService.addMood({
      title,
      sheet,
    });
    res.status(200).send(mood);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllMoodsNonPaged = async (req, res) => {
  moodService
    .getAllMoodsNonPaged()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneMood,
  updateMood,
  deleteMood,
  addMood,
  getAllMoods,
  getAllMoodsNonPaged,
};
