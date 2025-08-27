const sheetService = require("../services/sheetService");
const moodService = require("../services/moodService");

const getOneSheet = async (req, res) => {
  sheetService
    .getOneSheet({
      _id: req.params.id,
    })
    .then((sheet) => res.status(200).send(sheet ? sheet : "Sheet not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllSheets = async (req, res) => {
  sheetService
    .getAllSheets(req.body)
    .then((sheets) => res.status(200).send(sheets))
    .catch((err) => res.status(500).send(err));
};

const getAllSheetsNonPaged = async (req, res) => {
  sheetService
    .getAllSheetsNonPaged()
    .then((sheets) => res.status(200).send(sheets))
    .catch((err) => res.status(500).send(err));
};

const getSheetsByMoods = async (req, res) => {
  try {
    if (req.body.moods && req.body.moods.length) {
      const { moods } = req.body;
      const sheetIDs = await moodService.getSheetsByMoods(moods);
      let sheets = await sheetService.getSheetsByIDs(sheetIDs);
      res.status(200).send(sheets);
    } else {
      res.status(422).json({ message: "'moods' array missing or empty" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateSheet = async (req, res) => {
  sheetService
    .updateSheet(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((sheet) => res.status(200).send(sheet))
    .catch((err) => res.status(500).send(err));
};

const deleteSheet = async (req, res) => {
  sheetService
    .deleteSheet({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Sheet is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addSheet = async (req, res) => {
  sheetService
    .addSheet(req.body)
    .then((sheet) => res.status(200).send(sheet))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneSheet,
  updateSheet,
  deleteSheet,
  addSheet,
  getSheetsByMoods,
  getAllSheets,
  getAllSheetsNonPaged,
};
