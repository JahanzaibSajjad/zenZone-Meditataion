const bookController = require("../controllers/bookController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", bookController.getOneBook);

router.post("/", bookController.getAllBooks);

router.get("/", bookController.getAllBooksNonPaged);

router.put("/:id", authMiddleware.verifyAuth, bookController.updateBook);

router.delete("/:id", authMiddleware.verifyAuth, bookController.deleteBook);

router.post("/add", authMiddleware.verifyAuth, bookController.addBook);

module.exports = router;
