import { Button, Col, Form, Input, Modal, Row } from "reactstrap";
import React, { useState } from "react";
import {
  defaultVideo,
  updateToast,
  successToast,
  errorToast,
} from "shared/constants";
import { add, update } from "services/videoService";
import SpinnerLoader from "components/Misc/Spinner";
import toast, { Toaster } from "react-hot-toast";
import classNames from "classnames";
import { isValidURL } from "services/utilities";
import ReactQuill from "react-quill";
import { fontClasses } from "shared/constants";
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);

const AddVideo = ({ videoModal, handleModalClose, videoObj }) => {
  //form values states
  const [title, setTitle] = useState(defaultVideo.title);
  const [url, setUrl] = useState(defaultVideo.url);
  const [desc, setDesc] = useState(defaultVideo.description);
  const [iseditingVariableSet, editingVariableSet] = useState(false);
  const [showSpinner, setSpinner] = useState(false);

  //validation states
  const [showError, setErrorMessage] = useState(false);

  if ((!url || !desc) && videoObj !== undefined && !iseditingVariableSet) {
    setUrl(videoObj.url);
    setDesc(videoObj.description);
    setTitle(videoObj.title);
    editingVariableSet(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      if (
        videoObj !== undefined &&
        videoObj.url === url &&
        videoObj.description === desc &&
        videoObj.title === title
      ) {
        toast.success("Video Updated Successfuly", updateToast);
        setSpinner(false);
        handleClose(false);
        return;
      }
      if (!desc) {
        setSpinner(false);
        setErrorMessage(true);
        return;
      }
      if (!isValidURL(url)) {
        toast.error("Enter valid URL", errorToast);
        setSpinner(false);
        return;
      }
      if (videoObj !== undefined) {
        await update(videoObj._id, {
          url,
          title,
          description: fontClasses + desc,
        });
        toast.success("Video Updated Successfuly", updateToast);
      } else {
        await add({ url, title, description: fontClasses + desc });
        toast.success("Video Added Successfuly", successToast);
      }
      setErrorMessage(false);
      setSpinner(false);
      handleClose(true);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", errorToast);
      setSpinner(false);
    }
  };

  const handleClose = (reload) => {
    setUrl("");
    setDesc("");
    setTitle("");
    editingVariableSet(false);
    handleModalClose(reload);
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <Modal
        size="lg"
        className="modal-dialog-centered"
        isOpen={videoModal}
        toggle={() => handleClose(false)}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            {videoObj
              ? "Edit Biochemical Screen Video"
              : "Add Biochemical Screen Video"}
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
              <Col lg="6">
                <h4 className="headingColor">Title</h4>
                <Input
                  required
                  className={classNames({
                    "is-invalid": !title && showError,
                  })}
                  placeholder="Add Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <h4 className="headingColor">URL</h4>
                <Input
                  required
                  className={classNames(
                    {
                      "is-invalid url": !url && showError,
                    },
                    { url: url }
                  )}
                  placeholder="Add URL"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="px-3">
              <Col lg="12">
                <h4 className="headingColor">Description</h4>
                <div className={!desc && showError ? "is-invalid" : ""}>
                  <ReactQuill
                    value={desc}
                    onChange={(value) => setDesc(value)}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [
                          { header: [1, 2, 3, 4, 5, 6, false] },
                          { font: Font.whitelist },
                        ],
                        [{ color: [] }, { background: [] }],
                        ["bold", "italic"],
                        ["link", "blockquote", "code"],
                        [
                          {
                            list: "ordered",
                          },
                          {
                            list: "bullet",
                          },
                        ],
                      ],
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="modal-footer pt-0 d-flex justify-content-start align-items-center">
            <Button
              onClick={handleSubmit}
              className="addBtn ml-3 px-5 py-2"
              type="submit"
            >
              {videoObj ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal>
      <Toaster />
    </>
  );
};

export default AddVideo;
