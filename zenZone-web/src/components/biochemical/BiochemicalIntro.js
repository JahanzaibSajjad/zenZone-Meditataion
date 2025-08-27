import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getHomeVideos } from "../../services/APIsService";
import { get_youtube_thumbnail } from "../../services/utils";
import DescriptionModal from "../common/DescriptionModal";
import VideoModal from "../common/VideoModal";

const BiochemicalIntro = () => {
  const [showIcons, setIcons] = useState("invisible");
  const [videos, setVideos] = useState({
    biochemical: { description: "", url: "" },
  });
  const [showModal, setShowModal] = useState(false);
  const [showDescModal, setDescModal] = useState(false);

  const playClick = () => {
    setShowModal(true);
  };

  // useEffect(() => {
  //   getHomeVideos().then((data) => setVideos(data));
  // }, []);
  useEffect(() => {
    getHomeVideos().then((data) => {
      setVideos({
        biochemical: data[1] || { description: "", url: "" },
      });
    });
  }, []);

  return (
    <>
      <div className="position-absolute bg-rectangle"></div>
      <Container className="my-5 position-relative">
        <Row className="">
          <Col lg="12">
            <h1 className="mainDarkColor MontserratFont text-center boldText no-wrap">
              Introduction Video
            </h1>
            <p className="MorganiteFont text-center main-text-color intoText">
              BIOCHEMICAL BALANCE
            </p>
          </Col>
          <Col lg="12">
            <div
              style={{
                backgroundImage: `url(${get_youtube_thumbnail(
                  videos.biochemical.url,
                  "high"
                )})`,
              }}
              className="biochemicalVideo"
            >
              <div className="overlayImgMed position-relative">
                <div className="absolutePlayImgBio">
                  <img
                    role={"button"}
                    onClick={playClick}
                    className="playImg"
                    alt="play"
                    src="/assets/images/play-white.png"
                  />
                </div>
                <div className={showIcons + " absoluteShareIconsBio"}>
                  <i
                    role={"button"}
                    className="shareIcon text-white fab fa-twitter"
                  ></i>
                  <i
                    role={"button"}
                    className="px-2 mx-1 shareIcon text-white fab fa-facebook-square"
                  ></i>
                  <i
                    role={"button"}
                    className="shareIcon text-white fab fa-instagram"
                  ></i>
                </div>
                <div>
                  <img
                    role={"button"}
                    className="absoluteshareImgBio float-right"
                    alt="play"
                    src="/assets/images/Share-white.png"
                    onClick={() =>
                      setIcons(
                        showIcons === "invisible" ? "visible" : "invisible"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="mx-md-5 px-5">
        <h5 className="MontserratFont px-md-5">
          <span>
            {videos?.biochemical?.description
              .replace(/(<style[\w\W]+style>)/g, "")
              .replace(/(<([^>]+)>)/gi, "")
              .replace(/&.*;/g, "")
              .slice(0, window.innerWidth > 500 ? 500 : 200)}
          </span>
          <span>
            {((window.innerWidth < 500 &&
              videos?.biochemical?.description.length > 200) ||
              (window.innerWidth > 500 &&
                videos?.biochemical?.description.length > 500)) && (
              <span
                role={"button"}
                className="mx-2 mainDarkColor boldText"
                onClick={() => setDescModal(true)}
              >
                read more
              </span>
            )}
          </span>
        </h5>
      </div>
      <VideoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        url={videos.biochemical.url}
      />
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setDescModal(false)}
        desc={videos?.biochemical?.description}
        title={"Biochemical Introduction"}
      />
    </>
  );
};

export default BiochemicalIntro;
