import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VideoModal from "../common/VideoModal";
import DescriptionModal from "../common/DescriptionModal";
import { get_youtube_thumbnail } from "../../services/utils";

const HomeVideo = ({ isHovered, video }) => {
  const [showIcons, setIcons] = useState("invisible");
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDescModal, setDescModal] = useState(false);
  const sliced = window.innerWidth > 500 ? 300 : 200;

  const playClick = () => {
    setUrl(video.url);
    setShowModal(true);
  };

  return (
    <>
      <Container fluid className="px-0">
        <Row>
          <Col className="px-after-sm" xs="6">
            <div className="videoNumberDiv position-relative">
              <p className="position-absolute videoTitle">{video.title}</p>
              <p className="videoNumber MorganiteFont">0{video.number}</p>
            </div>
          </Col>
          <Col className="d-flex justify-content-end" xs="6">
            <div
              role={"button"}
              onClick={playClick}
              className="position-relative"
            >
              <img
                className="videoImg"
                src={get_youtube_thumbnail(video.url)}
                alt="video-thumbnail"
              />
              <img
                className="position-absolute imgPlayIcon"
                alt="play"
                src="/assets/images/play.png"
              />
            </div>
          </Col>
          <div className={isHovered ? "mt-hover px-5" : "px-5"}>
            <h1 className="MorganiteFont videoTextColor">{video.heading}</h1>
            <div className="mt-4 videoTextColor MontserratFont video-desc">
              <span>
                {video.description &&
                  video.description
                    .replace(/(<style[\w\W]+style>)/g, "")
                    .replace(/(<([^>]+)>)/gi, "")
                    .replace(/&.*;/g, "")
                    .slice(0, sliced)}
              </span>
              <span>
                {video.description && video.description.length > sliced && (
                  <span
                    role={"button"}
                    className="mx-2 mainDarkColor boldText"
                    onClick={() => setDescModal(true)}
                  >
                    read more
                  </span>
                )}
              </span>
            </div>
          </div>
          {isHovered && (
            <div className="my-1 d-flex justify-content-between align-items-center p-0">
              <div className="mx-5">
                <img
                  role={"button"}
                  onClick={playClick}
                  className="pt-4 playImg"
                  alt="play"
                  src="/assets/images/play-w-text.png"
                />
              </div>
              <div className="mx-5">
                <div className={showIcons}>
                  <i role={"button"} className="shareIcon fab fa-twitter"></i>
                  <i
                    role={"button"}
                    className="px-2 shareIcon fab fa-facebook-square"
                  ></i>
                  <i role={"button"} className="shareIcon fab fa-instagram"></i>
                </div>
                <div>
                  <img
                    role={"button"}
                    className="shareImg float-right"
                    alt="play"
                    src="/assets/images/Share.png"
                    onClick={() =>
                      setIcons(
                        showIcons === "invisible" ? "visible" : "invisible"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </Row>
      </Container>
      <VideoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        url={url}
      />
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setDescModal(false)}
        desc={video.description}
        title={video.title.split(" ")[0]}
      />
    </>
  );
};

export default HomeVideo;
