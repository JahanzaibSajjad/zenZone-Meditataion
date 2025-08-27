const bookService = require("../services/bookService");

const getOneBook = async (req, res) => {
  bookService
    .getOneBook({
      _id: req.params.id,
    })
    .then((book) => res.status(200).send(book ? book : "Book not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllBooks = async (req, res) => {
  bookService
    .getAllBooks(req.body)
    .then((books) => res.status(200).send(books))
    .catch((err) => res.status(500).send(err));
};

const getAllBooksNonPaged = async (req, res) => {
  bookService
    .getAllBooksNonPaged()
    .then((books) => res.status(200).send(books))
    .catch((err) => res.status(500).send(err));
};

const updateBook = async (req, res) => {
  bookService
    .updateBook(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((book) => res.status(200).send(book))
    .catch((err) => res.status(500).send(err));
};

const deleteBook = async (req, res) => {
  bookService
    .deleteBook({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Book is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addBook = async (req, res) => {
  bookService
    .addBook(req.body)
    .then((book) => res.status(200).send(book))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneBook,
  updateBook,
  deleteBook,
  addBook,
  getAllBooks,
  getAllBooksNonPaged,
};
