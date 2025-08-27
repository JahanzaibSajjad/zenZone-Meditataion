const sheetController = require("../controllers/sheetController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", sheetController.getOneSheet);

router.post("/", sheetController.getAllSheets);

router.get("/", sheetController.getAllSheetsNonPaged);

router.put("/:id", authMiddleware.verifyAuth, sheetController.updateSheet);

router.delete("/:id", authMiddleware.verifyAuth, sheetController.deleteSheet);

router.post("/add", authMiddleware.verifyAuth, sheetController.addSheet);

router.post("/get-sheets-by-moods", sheetController.getSheetsByMoods);

module.exports = router;
