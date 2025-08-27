const BookModel = require("../models/Book");

const getOneBook = async (condition) => {
  return new Promise((resolve, reject) => {
    BookModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllBooks = async (body) => {
  return new Promise((resolve, reject) => {
    BookModel.find({
      ...(body.search && {
        $or: [
          { title: { $regex: body.search, $options: "i" } },
          { description: { $regex: body.search, $options: "i" } },
        ],
      }),
    })
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((books) => {
        BookModel.count({
          ...(body.search && {
            $or: [
              { title: { $regex: body.search, $options: "i" } },
              { description: { $regex: body.search, $options: "i" } },
            ],
          }),
        })
          .then((count) => {
            resolve({ count, books });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllBooksNonPaged = async () => {
  return new Promise((resolve, reject) => {
    BookModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateBook = async (condition, data) => {
  return new Promise((resolve, reject) => {
    BookModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteBook = async (condition) => {
  return new Promise((resolve, reject) => {
    BookModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addBook = async (data) => {
  return new Promise((resolve, reject) => {
    new BookModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneBook,
  updateBook,
  deleteBook,
  addBook,
  getAllBooks,
  getAllBooksNonPaged,
};
