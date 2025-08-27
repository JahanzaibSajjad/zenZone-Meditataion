import React from "react";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";

const VideoModal = ({ url, show, handleClose, isAudio = false }) => {
  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <div className="d-flex align-items-center justify-content-center">
          <ReactPlayer
            height={isAudio ? "100px" : "400px"}
            controls
            url={url}
          />
        </div>
      </Modal>
    </>
  );
};

export default VideoModal;
