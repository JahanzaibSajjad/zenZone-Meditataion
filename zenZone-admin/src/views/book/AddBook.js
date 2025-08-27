import React, { useEffect, useState } from "react";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { Card, CardHeader, Container, Row, Col, Input, Form } from "reactstrap";
import { fetchOne, add, update } from "services/bookService";
import {
  defaultBook,
  updateToast,
  successToast,
  errorToast,
} from "shared/constants";
import { uploadFile } from "services/s3Service";
import Dropzone from "dropzone";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import SpinnerLoader from "components/Misc/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { dataURLtoFile } from "services/utilities";
import { isValidURL } from "services/utilities";
import ReactQuill from "react-quill";
import { fontClasses } from "shared/constants";
Dropzone.autoDiscover = false;
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);

const AddBook = () => {
  const { id } = useParams();

  //form values states
  const [meditation, setMeditation] = useState(defaultBook);
  const [title, setTitle] = useState(defaultBook.title);
  const [url, setUrl] = useState(defaultBook.url);
  const [desc, setDesc] = useState(defaultBook.description);
  const [cover, setCover] = useState(defaultBook.cover);
  const [coverName, setCoverName] = useState("");
  const [currentImageFile, setCurrentImageFile] = useState(false);
  const [showSpinner, setSpinner] = useState(true);

  //validation states
  const [showError, setErrorMessage] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const initializeDropzone = () => {
    new Dropzone(document.getElementById("dropzone-single-cover"), {
      url: "#",
      thumbnailWidth: null,
      dictDefaultMessage:
        '<i class="ni ni-cloud-upload-96 icon-color text-xl"></i><p>Click to upload or Drop file here</p>',
      thumbnailHeight: null,
      maxFiles: 1,
      acceptedFiles: "image/*",
      init: function () {
        this.on("addedfile", function (file) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            if (currentImageFile) {
              this.removeFile(currentImageFile);
            }
            const convertedFile = dataURLtoFile(e.target.result, coverName);
            setCover(e.target.result);
            setCoverName(JSON.parse(JSON.stringify(file)).upload.filename);
            setCurrentImageFile(convertedFile);
            setImageChanged(true);
          };
        });
      },
    });
  };

  useEffect(() => {
    initializeDropzone();
    id ? fetchBook() : setSpinner(false);
  }, []);

  const fetchBook = async () => {
    fetchOne(id)
      .then((data) => {
        setMeditation(data);
        setDesc(data.description);
        setTitle(data.title);
        setUrl(data.url);
        setCover(data.cover);
        setCoverName(/[^/]*$/.exec(data.cover)[0]);
        setSpinner(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      if (
        id &&
        meditation.title === title &&
        meditation.url === url &&
        meditation.description === desc &&
        meditation.cover === cover
      ) {
        toast.success("Book Updated Successfuly", updateToast);
        setSpinner(false);
        return;
      }
      if ((imageChanged && !currentImageFile) || (!imageChanged && !cover)) {
        setErrorMessage(true);
        setSpinner(false);
        return;
      }
      if (url && !isValidURL(url)) {
        toast.error("Enter valid URL", errorToast);
        setSpinner(false);
        return;
      }
      let uploadedImage = cover;
      if (imageChanged) {
        uploadedImage = await uploadFile(
          currentImageFile,
          `book-covers/${coverName}`
        );
      }
      if (id) {
        await update(id, {
          title,
          url,
          description: fontClasses + desc,
          cover: uploadedImage,
        });
        setMeditation({
          title,
          url,
          description: desc,
          cover: uploadedImage ? uploadedImage : cover,
        });
      } else {
        await add({
          title,
          url,
          description: fontClasses + desc,
          cover: uploadedImage ? uploadedImage : cover,
        });
      }
      setSpinner(false);
      id
        ? toast.success("Book Updated Successfuly", updateToast)
        : toast.success("Book Added Successfuly", successToast);
      setErrorMessage(false);

      if (!id) {
        setMeditation(defaultBook);
        setDesc(defaultBook.description);
        setTitle(defaultBook.title);
        setUrl(defaultBook.url);
        setCover(defaultBook.cover);
        setCoverName("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", errorToast);
      setSpinner(false);
      setErrorMessage(false);
    }
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name={id ? "Edit Book" : "Add Book"} />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Book Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              <div>
                <Form>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h4 className="headingColor">Title</h4>
                      <Input
                        required
                        className={!title && showError ? "is-invalid" : ""}
                        placeholder="Add Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Col>
                    <Col lg="6" md="12">
                      <h4 className="headingColor">Book URL</h4>
                      <Input
                        placeholder="Add URL"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h4 className="headingColor">Description</h4>
                      <div>
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
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h4 className="headingColor mb-3">
                        {cover ? "Attached Book Cover" : "Attach Book Cover"}
                      </h4>
                      <div className="px-2">
                        {cover && (
                          <Row className="px-4 d-flex align-items-center justify-content-start dashedBorder py-4">
                            <img
                              src={cover}
                              className="meditationImageDetail"
                            />
                            <i
                              onClick={() => {
                                setCover("");
                                setCoverName("");
                                setCurrentImageFile(false);
                              }}
                              role="button"
                              className="ml-2 far fa-times-circle icon-color text-lg"
                            ></i>
                          </Row>
                        )}
                        <div
                          className={classnames(
                            "dropzone dropzone-single mb-3",
                            { "d-none": cover },
                            { "invalid-dropzone": !cover && showError }
                          )}
                          id="dropzone-single-cover"
                        >
                          <div className="fallback">
                            <div className="custom-file">
                              <input
                                className="custom-file-input"
                                id="projectCoverUploads"
                                type="file"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <small>{decodeURI(coverName)}</small>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn addBtn"
                      >
                        {id ? "Update" : "Add Book"}
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
      <Toaster />
    </>
  );
};

export default AddBook;
