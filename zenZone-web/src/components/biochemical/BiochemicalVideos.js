import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getBiochemVideos } from "../../services/APIsService";
import { get_youtube_thumbnail } from "../../services/utils";
import DescriptionModal from "../common/DescriptionModal";
import VideoModal from "../common/VideoModal";

const BiochemicalVideos = () => {
  const [videos, setVideos] = useState([]);
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [showDescModal, setDescModal] = useState(false);

  useEffect(() => {
    getBiochemVideos()
      .then((data) => setVideos(data))
      .catch((err) => console.log(err));
  }, []);

  const playClick = (url) => {
    if (url) {
      setUrl(url);
      setShowModal(true);
    }
  };

  const showDesc = (title, desc) => {
    setDesc(desc);
    setTitle(title);
    setDescModal(true);
  };

  return (
    <div className="my-5 mx-md-5 art-bg">
      <h2 className="text-center MorganiteFont bioVidHeading pb-5 mb-5">
        BALANCED HEALING FOR HEROES
      </h2>
      <Container fluid>
        <Row>
          <Col lg="3">
            <div className="h-100 position-relative">
              <p className="MorganiteFont overflow-hidden bio-vid-bg-text">
                BIOCHEMICAL BALANCE
              </p>
              <p className="bio-vid-text">The Best of</p>
              <p className="MorganiteFont bio-vid-secondary-text">
                BIOCHEMICAL BALANCE
              </p>
            </div>
          </Col>
          <Col className="biochemScroll zIndex" lg="9">
            {videos.map((video, index) => (
              <div key={index} className="biochemVideoObj bioVideoDiv">
                <div
                  role={"button"}
                  onClick={() => playClick(video.url)}
                  className="biochemImg"
                  style={{
                    backgroundImage: `url(${get_youtube_thumbnail(video.url)})`,
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
                <div>
                  <Row>
                    <Col className="d-flex justify-content-end" xs="3">
                      <p className="videoNumberSmallDark MorganiteFont">
                        {(index < 9 ? "0" : "") + (index + 1)}
                      </p>
                    </Col>
                    <Col className="mt-4 pt-3" xs="9">
                      <h1 className="MorganiteFont text-capitalize videoTextColor">
                        {video.title}
                      </h1>
                      <div className="mt-4 mb-2 MontserratFont normalSpace videoTextColor bio-desc">
                        <span>
                          {video.description
                            .replace(/(<style[\w\W]+style>)/g, "")
                            .replace(/(<([^>]+)>)/gi, "")
                            .replace(/&.*;/g, "")
                            .slice(0, 210)}
                        </span>
                        <span>
                          {video.description &&
                            video.description.length > 210 && (
                              <span
                                role={"button"}
                                className="mx-2 mainDarkColor boldText"
                                onClick={() =>
                                  showDesc(video.title, video.description)
                                }
                              >
                                read more
                              </span>
                            )}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
          </Col>
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
        desc={desc}
        title={title}
      />
    </div>
  );
};

export default BiochemicalVideos;
