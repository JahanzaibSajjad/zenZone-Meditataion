import React from "react";
import { Col, Modal, Row } from "react-bootstrap";

const BookModal = ({ book, show, handleClose }) => {
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
              <div className="padding-left-2 d-inline-block">
                <img alt="med-img" className="medModalImg" src={book.cover} />
              </div>
              <div className="d-lg-none bookName display-lg-inline mx-3">
                <h1 className="MontserratFont text-capitalize">
                  {book && book.title}
                </h1>
              </div>
            </Col>
            <Col lg="8" md="12">
              <div className="pt-5 pxBefore-lg-5 padding-right-5">
                <h2 className="display-lg-none MontserratFont text-capitalize">
                  {book && book.title}
                </h2>
                {book.url && (
                  <a
                    className="break-word anchor"
                    rel="noreferrer"
                    target={"_blank"}
                    href={book.url}
                  >
                    {book.url}
                  </a>
                )}
                {book.description && (
                  <div
                    className="mt-2 break-word"
                    dangerouslySetInnerHTML={{
                      __html: book.description,
                    }}
                  ></div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default BookModal;
