import React, { useEffect, useState } from "react";
import { Col, Container, FormControl, Pagination, Row } from "react-bootstrap";
import { getPodcasts } from "../../services/APIsService";
import Footer from "../common/Footer";

const PodcastsList = () => {
  const [search, setSearch] = useState("");
  const [podcasts, setPodcasts] = useState([]);
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
    fetchPodcasts({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchPodcasts({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
    });
    setPage(1);
  }, [search]);

  const fetchPodcasts = (body) => {
    getPodcasts(body)
      .then((data) => {
        setPodcasts(data.podcasts);
        setCount(data.count);
      })
      .catch((err) => console.log(err));
  };

  const podcastsRows = () => {
    let podcastArr = [];
    for (let i = 0; i < podcasts.length; i++) {
      podcastArr.push(
        <Col key={i} lg="3" md="6" sm="12">
          <div className="d-flex position-relative justify-content-center">
            <div className="podcastDiv pb-3 my-4">
              <div
                role={"button"}
                onClick={() => window.open(podcasts[i].url, "_blank")}
                className="podcastImg"
                style={{
                  backgroundImage: `url(${podcasts[i].cover})`,
                }}
              >
                <div className="overlayImgMed">
                  <img
                    role={"button"}
                    className="playImgBiochem"
                    alt="play"
                    src="/assets/images/play-white.png"
                  />
                </div>
              </div>
              <h5 className="pt-4 pb-2 text-capitalize text-center headingDark MontserratFont boldText">
                {podcasts[i].title}
              </h5>
            </div>
          </div>
        </Col>
      );
    }
    return podcastArr;
  };

  return (
    <>
      {podcasts.length ? (
        <div className="position-absolute bg-rectangle-opaque"></div>
      ) : (
        ""
      )}
      <div className="position-relative pt-5">
        <h1 className="text-center MontserratFont mainDarkColor boldText">
          Podcasts Links
        </h1>
        <h1 className="mt-3 text-center main-text-color intoText MorganiteFont">
          EDUCATION AND RESOURCES LIBRARY
        </h1>
      </div>
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
      <div>
        <div className="pt-4 mediumContainer">
          {podcasts.length ? (
            <Container fluid>
              <Row className="my-5">{podcastsRows()}</Row>
              {podcasts.length && <hr className="mt-8" />}
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
            </Container>
          ) : (
            <div className="mt-5 d-flex align-items-center justify-content-center">
              No records found
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PodcastsList;
