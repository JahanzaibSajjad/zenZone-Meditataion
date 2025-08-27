import React from "react";
import { Modal } from "react-bootstrap";

const DescriptionModal = ({ desc, show, handleClose, title = "" }) => {
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
          {title && (
            <h1 className="px-5 MontserratFont anchor text-capitalize">
              {title}
            </h1>
          )}
          <div className="px-5 pb-3 d-flex text-justify align-items-center justify-content-center">
            <div
              dangerouslySetInnerHTML={{
                __html: desc ? desc.replace(/(<style[\w\W]+style>)/g, "") : "",
              }}
            ></div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DescriptionModal;
