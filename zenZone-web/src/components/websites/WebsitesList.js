import React, { useEffect, useState } from "react";
import { Col, Container, FormControl, Pagination, Row } from "react-bootstrap";
import { getWebsites } from "../../services/APIsService";

const WebsitesList = () => {
  const [search, setSearch] = useState("");
  const [websites, setWebsites] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const pageSize = 8;

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
    fetchWebsites({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchWebsites({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(1);
  }, [search]);

  const fetchWebsites = (body) => {
    getWebsites(body)
      .then((data) => {
        setWebsites(data.websites);
        setCount(data.count);
      })
      .catch((err) => console.log(err));
  };

  const websitesRows = () => {
    let websiteArr = [];
    for (let i = 0; i < websites.length; i++) {
      websiteArr.push(
        <Col key={i} lg="6" md="12">
          <div className="websiteDiv my-3 px-5 py-4">
            <h4 className="pb-2 anchor text-capitalize MontserratFont boldText600">
              {websites[i].title}
            </h4>
            <a
              href={websites[i].url}
              rel="noreferrer"
              target="_blank"
              className="pt-1 pb-4 anchor MontserratFont"
            >
              {websites[i].url}
            </a>
          </div>
        </Col>
      );
    }
    return websiteArr;
  };

  return (
    <>
      {websites.length ? (
        <div className="position-absolute bg-rectangle-dark"></div>
      ) : (
        ""
      )}
      <div className="position-relative pt-5 mt-3">
        <h1 className="text-center MontserratFont mainDarkColor boldText">
          Third-party Websites
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
            {websites.length ? (
              <>
                <Row className="my-5">{websitesRows()}</Row>
              </>
            ) : (
              <div className="mt-5 d-flex align-items-center justify-content-center">
                No records found
              </div>
            )}
          </Container>
        </div>
        <div className="mediumContainer">
          {websites.length ? (
            <>
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
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default WebsitesList;
