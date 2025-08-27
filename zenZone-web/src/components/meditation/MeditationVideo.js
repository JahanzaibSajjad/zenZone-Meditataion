import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getHomeVideos } from "../../services/APIsService";
import { get_youtube_thumbnail } from "../../services/utils";
import DescriptionModal from "../common/DescriptionModal";
import VideoModal from "../common/VideoModal";

const MeditationVideo = () => {
  const [showIcons, setIcons] = useState("invisible");
  const [showDescModal, setDescModal] = useState(false);
  const [videos, setVideos] = useState({
    meditation: { description: "", url: "" },
  });
  const [showModal, setShowModal] = useState(false);

  const playClick = () => {
    setShowModal(true);
  };

  // useEffect(() => {
  //   getHomeVideos().then((data) => setVideos(data));
  // }, []);
  useEffect(() => {
    getHomeVideos().then((data) => {
      setVideos({
        meditation: data[0] || { description: "", url: "" },
      });
    });
  }, []);
  return (
    <>
      <div className="px-md-5 mx-md-5">
        <Container fluid>
          <Row className="mx-md-5">
            <Col className="zIndex" lg="3" sm="12">
              <div className="py-5"></div>
              <h1 className="mainDarkColor MontserratFont boldText no-wrap">
                Introduction Video
              </h1>
              <p className="MorganiteFont main-text-color intoText">
                MEDITATION
              </p>
            </Col>
            <Col lg="9" sm="12">
              <div
                style={{
                  backgroundImage: `url(${get_youtube_thumbnail(
                    videos.meditation.url,
                    "high"
                  )})`,
                }}
                className="medVideo"
              >
                <div className="overlayImgMed position-relative">
                  <div className="absolutePlayImg">
                    <img
                      role={"button"}
                      onClick={playClick}
                      className="playImg"
                      alt="play"
                      src="/assets/images/play-white.png"
                    />
                  </div>
                  <div className={showIcons + " absoluteShareIcons"}>
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
                      className="absoluteshareImg float-right"
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
            <div className={"pt-lg-0 pt-5"}>
              <h1 className="MorganiteFont headingText videoTextColor">
                INTODUCTION
              </h1>
              <div className="mt-3 MontserratFont videoTextColor desc">
                <span>
                  {videos?.meditation?.description
                    .replace(/(<style[\w\W]+style>)/g, "")
                    .replace(/(<([^>]+)>)/gi, "")
                    .replace(/&.*;/g, "")
                    .slice(0, window.innerWidth > 500 ? 500 : 200)}
                </span>
                <span>
                  {((window.innerWidth < 500 &&
                    videos?.meditation?.description.length > 200) ||
                    (window.innerWidth > 500 &&
                      videos?.meditation?.description.length > 500)) && (
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
          </Row>
        </Container>
      </div>
      <VideoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        url={videos.meditation.url}
      />
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setDescModal(false)}
        desc={videos?.meditation?.description}
        title={"Meditation Introduction"}
      />
    </>
  );
};

export default MeditationVideo;
