import React from "react";
import BooksList from "../components/books/BooksList";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";

const Books = () => {
  return (
    <div className="bg-shine bg-shine-large">
      <TopNav />
      <div className="py-5">
        <BooksList />
      </div>
      <Footer />
    </div>
  );
};

export default Books;
