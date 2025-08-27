import React, { useEffect, useState } from "react";
import { Container, FormControl, Pagination } from "react-bootstrap";
import { getBooks } from "../../services/APIsService";
import BookModal from "../common/BookModal";

const BooksList = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState([]);
  const [showBookModal, setBookModal] = useState(false);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const pageSize = 10;

  const pages = () => {
    let pagesArr = [];
    for (let i = 1; i <= Math.ceil(count / pageSize); i++) {
      pagesArr.push(
        <Pagination.Item
          onClick={(e) => handlePageClick(e, i)}
          key={i}
          active={i === currentPage}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pagesArr;
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    fetchBooks({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(1);
  }, [search]);

  const fetchBooks = (body) => {
    getBooks(body)
      .then((data) => {
        setBooks(data.books);
        setCount(data.count);
      })
      .catch((err) => console.log(err));
  };

  const booksRows = () => {
    let rows = [];
    for (let i = 0; i < Math.ceil(books.length / 5); i++) {
      rows.push(
        <div className="my-5 w-100" key={i}>
          {booksCols(i)}
        </div>
      );
    }
    return rows;
  };

  const openBook = (book) => {
    setBook(book);
    setBookModal(true);
  };

  const booksCols = (row) => {
    let cols = [];
    for (let i = 0; i < 5; i++) {
      books[row * 5 + i] &&
        cols.push(
          <div className="col-20-percent" key={row * 5 + i}>
            <div className="d-flex justify-content-center">
              <div
                role={"button"}
                onClick={() => openBook(books[row * 5 + i])}
                className="bookDiv bg-white py-3 px-4 mx-1 my-4"
              >
                <img
                  className="bookImg"
                  alt="book-cover"
                  src={books[row * 5 + i].cover}
                />
                <h5 className="pt-4 mainDarkColor text-capitalize MontserratFont boldText">
                  {books[row * 5 + i].title}
                </h5>
              </div>
            </div>
          </div>
        );
    }
    return cols;
  };

  return (
    <>
      {books.length ? (
        <div className="position-absolute bg-rectangle-dark"></div>
      ) : (
        ""
      )}
      <div className="position-relative pt-5 mt-3">
        <h1 className="text-center MontserratFont mainDarkColor boldText">
          Recommended Books
        </h1>
        <h1 className="mt-3 text-center main-text-color intoText MorganiteFont">
          EDUCATION AND RESOURCES LIBRARY
        </h1>
        <div className="mt-4 small-container">
          <Container>
            <div className="position-relative">
              <FormControl
                className="search-input"
                type={"text"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
              />
              <img
                alt="search-icon"
                className="search-icon"
                src="/assets/images/search-icon.png"
              />
            </div>
          </Container>
        </div>
        <div className="mediumContainer">
          {books.length ? (
            <>
              {booksRows()}
              <hr />
              <div className="pt-5 px-5 d-flex align-items-center justify-content-end">
                <Pagination size="sm">
                  <i
                    role={"button"}
                    onClick={(e) =>
                      currentPage > 1 && handlePageClick(e, currentPage - 1)
                    }
                    className={
                      (currentPage <= 1 ? "paragraphDim" : "") +
                      " fa fa-angle-left pageIcon"
                    }
                  ></i>
                  {pages()}
                  <i
                    role={"button"}
                    onClick={(e) =>
                      currentPage < Math.ceil(count / pageSize) &&
                      handlePageClick(e, currentPage + 1)
                    }
                    className={
                      (currentPage >= Math.ceil(count / pageSize)
                        ? "paragraphDim"
                        : "") + " fa fa-angle-right pageIcon"
                    }
                  ></i>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="mt-5 d-flex align-items-center justify-content-center">
              No records found
            </div>
          )}
        </div>
        <BookModal
          show={showBookModal}
          handleClose={() => setBookModal(false)}
          book={book}
        />
      </div>
    </>
  );
};

export default BooksList;
