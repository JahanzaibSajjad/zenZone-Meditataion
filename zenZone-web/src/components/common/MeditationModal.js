import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { customIcons } from "../../shared/constants";

const MeditationModal = ({ meditation, show, handleClose }) => {
  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <div className="bg-modal">
          <div className="m-3 d-flex align-items-center justify-content-end">
            <i
              role={"button"}
              onClick={handleClose}
              className="fa fa-times"
            ></i>
          </div>
          <Row className="mb-4">
            <Col lg="4" md="12">
              <div className="padding-left-2 d-flex align-items-center">
                <img
                  alt="med-img"
                  className="medModalImg"
                  src={meditation.image}
                />
                <div className="vertical-bottom d-lg-none display-lg-inline mx-3">
                  <h1 className="mt-1 mb-0 MontserratFont text-capitalize">
                    {meditation && meditation.title}
                  </h1>
                </div>
              </div>
            </Col>
            <Col lg="8" md="12">
              <div className="pt-3 pxBefore-lg-5 padding-right-5">
                <h2 className="display-lg-none MontserratFont text-capitalize">
                  {meditation && meditation.title}
                </h2>
                {meditation.description && (
                  <div
                    className="break-word"
                    dangerouslySetInnerHTML={{
                      __html: meditation.description,
                    }}
                  ></div>
                )}
                <div className="mt-3">
                  {meditation.audio && (
                    <AudioPlayer
                      autoPlay={false}
                      customIcons={customIcons}
                      showJumpControls={false}
                      src={meditation.audio}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default MeditationModal;
