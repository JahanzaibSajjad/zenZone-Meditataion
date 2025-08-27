import { Col, Modal, Row } from "reactstrap";
import React from "react";

const ImageView = ({ open, handleClose, url }) => {
  return (
    <>
      <Modal
        className="modal-dialog-centered"
        isOpen={open}
        toggle={handleClose}
      >
        <Row>
          <Col className="position-relative" lg="12">
            <img className="w-100" src={url} alt="---" />
            <i
              role={"button"}
              onClick={handleClose}
              className="fa fa-times text-white imageViewerClose"
            ></i>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ImageView;
