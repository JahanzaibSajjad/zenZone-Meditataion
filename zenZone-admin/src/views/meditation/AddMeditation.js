// zenZone-admin/src/views/meditation/AddMeditation.js
import React, { useEffect, useState } from "react";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { Card, CardHeader, Container, Row, Col, Input, Form } from "reactstrap";
import { fetchOne, add, update } from "services/meditationService";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import * as moment from "moment";
import {
  customIcons,
  defaultMeditation,
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
import { dataURLtoFile, isCorrectImageRatio } from "services/utilities";
Dropzone.autoDiscover = false;
import ReactDatetime from "react-datetime";
import ReactQuill from "react-quill";
import { fontClasses } from "shared/constants";
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);

const FIXED_MOODS = [
  "Calm",
  "Sleep",
  "Focus",
  "Uplift",
  "Anxiety Relief",
  "Energy",
  "Gratitude",
  "Breathwork",
];

const AddMeditation = () => {
  const { id } = useParams();

  // form states
  const [meditation, setMeditation] = useState(defaultMeditation);
  const [title, setTitle] = useState(defaultMeditation.title);
  const [date, setDate] = useState(defaultMeditation.date);
  const [desc, setDesc] = useState(defaultMeditation.description);
  const [image, setImage] = useState(defaultMeditation.image);
  const [audio, setAudio] = useState(defaultMeditation.audio);
  const [audioName, setAudioName] = useState("");
  const [imageName, setImageName] = useState("");
  const [currentImageFile, setCurrentImageFile] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState(false);
  const [showSpinner, setSpinner] = useState(true);

  const [selectedMoods, setSelectedMoods] = useState([]);

  const [showError, setErrorMessage] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [audioChanged, setAudioChanged] = useState(false);

  // const initializeDropzone = () => {
  //   const img = new Dropzone(document.getElementById("dropzone-single-image"), {
  //     url: "#",
  //     thumbnailWidth: null,
  //     dictDefaultMessage:
  //       '<i class="ni ni-cloud-upload-96 icon-color text-xl"></i><p>Click to upload or Drop file here</p>',
  //     thumbnailHeight: null,
  //     maxFiles: 1,
  //     acceptedFiles: "image/*",
  //     init: function () {
  //       this.on("addedfile", function (file) {
  //         let reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = function (e) {
  //           if (currentImageFile) {
  //             this.removeFile(currentImageFile);
  //           }
  //           const convertedFile = dataURLtoFile(e.target.result, imageName);
  //           isCorrectImageRatio(
  //             convertedFile,
  //             () => {
  //               setImage(e.target.result);
  //               setImageName(JSON.parse(JSON.stringify(file)).upload.filename);
  //               setCurrentImageFile(convertedFile);
  //               setImageChanged(true);
  //             },
  //             () => {
  //               img.removeAllFiles();
  //               toast.error(
  //                 "Image Aspect Ratio not suitable for Mobile Devices",
  //                 errorToast
  //               );
  //             }
  //           );
  //         };
  //       });
  //     },
  //   });

  //   new Dropzone(document.getElementById("dropzone-single-audio"), {
  //     url: "#",
  //     thumbnailWidth: null,
  //     dictDefaultMessage:
  //       '<i class="ni ni-cloud-upload-96 icon-color text-xl"></i><p>Click to upload or Drop file here</p>',
  //     thumbnailHeight: null,
  //     maxFiles: 1,
  //     acceptedFiles: "audio/*",
  //     init: function () {
  //       this.on("addedfile", function (file) {
  //         setAudioChanged(true);
  //         if (currentAudioFile) {
  //           this.removeFile(currentAudioFile);
  //         }
  //         setAudioName(JSON.parse(JSON.stringify(file)).upload.filename);
  //         let reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = function (e) {
  //           setAudio(e.target.result);
  //           const convertedFile = dataURLtoFile(e.target.result, audioName);
  //           setCurrentAudioFile(convertedFile);
  //         };
  //       });
  //     },
  //   });
  // };
  const initializeDropzone = () => {
    const img = new Dropzone(document.getElementById("dropzone-single-image"), {
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
            const convertedFile = dataURLtoFile(e.target.result, imageName);

            // REMOVE aspect ratio check
            // Comment out or remove this aspect ratio validation entirely.
            setImage(e.target.result);
            setImageName(JSON.parse(JSON.stringify(file)).upload.filename);
            setCurrentImageFile(convertedFile);
            setImageChanged(true);

            // No need to check aspect ratio anymore
            // No "image aspect ratio" validation
          };
        });
      },
    });

    new Dropzone(document.getElementById("dropzone-single-audio"), {
      url: "#",
      thumbnailWidth: null,
      dictDefaultMessage:
        '<i class="ni ni-cloud-upload-96 icon-color text-xl"></i><p>Click to upload or Drop file here</p>',
      thumbnailHeight: null,
      maxFiles: 1,
      acceptedFiles: "audio/*",
      init: function () {
        this.on("addedfile", function (file) {
          setAudioChanged(true);
          if (currentAudioFile) {
            this.removeFile(currentAudioFile);
          }
          setAudioName(JSON.parse(JSON.stringify(file)).upload.filename);
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            setAudio(e.target.result);
            const convertedFile = dataURLtoFile(e.target.result, audioName);
            setCurrentAudioFile(convertedFile);
          };
        });
      },
    });
  };

  useEffect(() => {
    initializeDropzone();
    if (id) {
      fetchMeditation().finally(() => setSpinner(false));
    } else {
      setSpinner(false);
    }
  }, []);

  const fetchMeditation = async () => {
    return fetchOne(id)
      .then((data) => {
        setMeditation(data);
        setDesc(data.description);
        setTitle(data.title);
        setDate(data.date);
        setImage(data.image);
        setAudio(data.audio);
        setAudioName(/[^/]*$/.exec(data.audio || "")?.[0] || "");
        setImageName(/[^/]*$/.exec(data.image || "")?.[0] || "");

        setSelectedMoods(data.moods || []);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const nothingChanged =
        id &&
        meditation.title === title &&
        meditation.date === date &&
        meditation.description === desc &&
        meditation.audio === audio &&
        meditation.image === image &&
        JSON.stringify((meditation.moods || []).slice().sort()) ===
          JSON.stringify(selectedMoods.slice().sort());

      if (nothingChanged) {
        toast.success("Meditation Updated Successfully", updateToast);
        setSpinner(false);
        return;
      }

      if (
        !date ||
        !desc ||
        (imageChanged && !currentImageFile) ||
        (!imageChanged && !image)
      ) {
        setErrorMessage(true);
        setSpinner(false);
        return;
      }

      let uploadedImage = image;
      let uploadedAudio = audio;
      let result;

      if (imageChanged) {
        uploadedImage = await uploadFile(
          currentImageFile,
          `images/${imageName}`
        );
      }
      if (audioChanged) {
        uploadedAudio = await uploadFile(
          currentAudioFile,
          `audios/${audioName}`
        );
      }

      const payload = {
        title,
        date: moment(date).format("YYYY-MM-DD"),
        description: fontClasses + desc,
        image: uploadedImage || image,
        audio: uploadedAudio || audio,
        moods: selectedMoods, // Send mood titles as strings
      };

      if (id) {
        result = await update(id, payload);
      } else {
        result = await add(payload);
      }

      setSpinner(false);
      if (!result?.created) {
        toast.error("Meditation already exists on specified Date", errorToast);
      } else {
        id
          ? toast.success("Meditation Updated Successfully", updateToast)
          : toast.success("Meditation Added Successfully", successToast);
        setErrorMessage(false);
      }

      if (!id && result?.created) {
        // Reset form only if creating a new meditation
        setMeditation(defaultMeditation);
        setDesc(defaultMeditation.description);
        setTitle(defaultMeditation.title);
        setDate(defaultMeditation.date);
        setImage(defaultMeditation.image);
        setAudio(defaultMeditation.audio);
        setAudioName("");
        setImageName("");
        setSelectedMoods([]);
      } else if (id && result?.created) {
        setMeditation({
          title,
          date: moment(date).format("YYYY-MM-DD"),
          description: desc,
          image: payload.image,
          audio: payload.audio,
          moods: selectedMoods, // Keep the moods as strings
        });
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
      <SimpleHeader name={id ? "Edit Meditation" : "Add Meditation"} />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Meditation Detail</h3>
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
                      <h4 className="headingColor">Date</h4>
                      <div
                        className={classnames(
                          { "datePicker-invalid": !date && showError },
                          { "highlight-today": !date }
                        )}
                      >
                        <ReactDatetime
                          inputProps={{
                            readOnly: true,
                            placeholder: "Add Date",
                          }}
                          timeFormat={false}
                          dateFormat={"MM-DD-YYYY"}
                          value={date ? moment(date).format("MM-DD-YYYY") : ""}
                          onChange={(e) => setDate(e)}
                          closeOnSelect={true}
                          closeOnClickOutside={true}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="px-5 py-3">
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
                              [{ list: "ordered" }, { list: "bullet" }],
                            ],
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* ✅ Fixed Moods multi-select */}
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h4 className="headingColor">Tag Moods</h4>
                      <Input
                        type="select"
                        multiple
                        value={selectedMoods}
                        onChange={(e) => {
                          const values = Array.from(e.target.options)
                            .filter((o) => o.selected)
                            .map((o) => o.value);
                          setSelectedMoods(values);
                        }}
                      >
                        {FIXED_MOODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </Input>
                      <small className="text-muted">
                        Hold Ctrl/Cmd to select multiple moods.
                      </small>
                    </Col>
                  </Row>

                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h4 className="headingColor mb-3">
                        {audio ? "Attached Sound" : "Attach Sound"}
                      </h4>
                      <div className="px-2">
                        {audio && (
                          <Row className="dashedBorder py-4">
                            <Col lg="8" md="12">
                              <AudioPlayer
                                customIcons={customIcons}
                                showJumpControls={false}
                                src={audio}
                              />
                            </Col>
                            <Col
                              lg="4"
                              md="12"
                              className="d-flex align-items-center justify-content-start"
                            >
                              <i
                                onClick={() => {
                                  setAudio("");
                                  setAudioName("");
                                  setCurrentAudioFile(false);
                                }}
                                role="button"
                                className="far fa-times-circle icon-color text-lg"
                              ></i>
                            </Col>
                          </Row>
                        )}
                        <div
                          className={classnames(
                            "dropzone dropzone-single mb-3",
                            { "d-none": audio }
                          )}
                          id="dropzone-single-audio"
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
                      <small>{decodeURI(audioName || "")}</small>
                    </Col>

                    <Col lg="6" md="12">
                      <h4 className="headingColor mb-3">
                        {image
                          ? "Attached Background Image"
                          : "Attach Background Image"}
                      </h4>
                      <div className="px-2">
                        {image && (
                          <Row className="dashedBorder py-4">
                            <Col lg="8" md="12">
                              <img
                                src={image}
                                className="meditationImageDetail"
                                alt="meditation"
                              />
                            </Col>
                            <Col
                              lg="4"
                              md="12"
                              className="d-flex align-items-center justify-content-start"
                            >
                              <i
                                onClick={() => {
                                  setImage("");
                                  setImageName("");
                                  setCurrentImageFile(false);
                                }}
                                role="button"
                                className="far fa-times-circle icon-color text-lg"
                              ></i>
                            </Col>
                          </Row>
                        )}
                        <div
                          className={classnames(
                            "dropzone dropzone-single mb-3",
                            { "d-none": image },
                            { "invalid-dropzone": !image && showError }
                          )}
                          id="dropzone-single-image"
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
                      <small>{decodeURI(imageName || "")}</small>
                    </Col>
                  </Row>

                  <Row className="px-5 py-3">
                    <Col>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn addBtn"
                      >
                        {id ? "Update" : "Add New"}
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

export default AddMeditation;
