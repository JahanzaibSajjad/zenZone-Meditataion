import { Button, Col, Form, Input, Modal, Row } from "reactstrap";
import React, { useState } from "react";
import {
  defaultWebsite,
  updateToast,
  successToast,
  errorToast,
} from "shared/constants";
import { add, update } from "services/websiteService";
import SpinnerLoader from "components/Misc/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { isValidURL } from "services/utilities";

const AddWebsite = ({ websiteModal, handleModalClose, websiteObj }) => {
  //form values states
  const [title, setTitle] = useState(defaultWebsite.title);
  const [url, setUrl] = useState(defaultWebsite.url);
  const [iseditingVariableSet, editingVariableSet] = useState(false);
  const [showSpinner, setSpinner] = useState(false);

  //validation states
  const [showError, setErrorMessage] = useState(false);

  if ((!title || !url) && websiteObj !== undefined && !iseditingVariableSet) {
    setTitle(websiteObj.title);
    setUrl(websiteObj.url);
    editingVariableSet(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      if (
        websiteObj !== undefined &&
        websiteObj.title === title &&
        websiteObj.url === url
      ) {
        toast.success("Website Updated Successfuly", updateToast);
        setSpinner(false);
        handleClose(false);
        return;
      }
      if (!title || !url) {
        setSpinner(false);
        setErrorMessage(true);
        return;
      }
      if (!isValidURL(url)) {
        toast.error("Enter valid URL", errorToast);
        setSpinner(false);
        return;
      }
      if (websiteObj !== undefined) {
        await update(websiteObj._id, { title, url });
        toast.success("Website Updated Successfuly", updateToast);
      } else {
        await add({ title, url });
        toast.success("Website Added Successfuly", successToast);
      }
      setErrorMessage(false);
      setSpinner(false);
      handleClose(true);
    } catch (err) {
      console.log(err);
      setSpinner(false);
      toast.error("Something went wrong", errorToast);
    }
  };

  const handleClose = (ifReload = false) => {
    setTitle("");
    setUrl("");
    editingVariableSet(false);
    handleModalClose(ifReload);
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <Modal
        className="modal-dialog-centered"
        isOpen={websiteModal}
        toggle={() => handleClose(false)}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            {websiteObj ? "Edit Website" : "Add Website"}
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => handleClose(false)}
          >
            <span aria-hidden={true}>
              <img src="/close.svg" alt="close" />
            </span>
          </button>
        </div>
        <Form>
          <div className="modal-body">
            <Row className="px-3 pb-4">
              <Col lg="12">
                <h4 className="headingColor">Title</h4>
                <Input
                  className={!title && showError ? "is-invalid" : ""}
                  placeholder="Add Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="px-3">
              <Col lg="12">
                <h4 className="headingColor">URL</h4>
                <Input
                  className={!url && showError ? "is-invalid" : ""}
                  placeholder="Add URL"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          <div className="modal-footer d-flex justify-content-center align-items-center">
            <Button
              onClick={handleSubmit}
              className="px-4 addBtn"
              type="submit"
            >
              {websiteObj ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal>
      <Toaster />
    </>
  );
};

export default AddWebsite;
