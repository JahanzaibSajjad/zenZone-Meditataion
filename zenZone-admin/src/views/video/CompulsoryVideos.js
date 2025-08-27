import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Card, CardHeader, Col, Form, Input, Row } from "reactstrap";
import { isValidURL } from "services/utilities";
import { updateCompulsoryVideo } from "services/videoService";
import { fetchCompulsoryVideo } from "services/videoService";
import { fontClasses } from "shared/constants";
import { errorToast } from "shared/constants";
import { updateToast } from "shared/constants";
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);

const CompulsoryVideos = ({ setSpinner, toast }) => {
  const [h1Url, setH1Url] = useState("");
  const [h2Url, setH2Url] = useState("");
  const [medUrl, setMedUrl] = useState("");
  const [bioUrl, setBioUrl] = useState("");

  const [h1Desc, setH1Desc] = useState("");
  const [h2Desc, setH2Desc] = useState("");
  const [medDesc, setMedDesc] = useState("");
  const [bioDesc, setBioDesc] = useState("");

  const [showError, setErrorMessage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    fetchCompulsoryVideo().then((data) => {
      setH1Url(data.home_1.url);
      setH2Url(data.home_2.url);
      setMedUrl(data.meditation.url);
      setBioUrl(data.biochemical.url);
      setH1Desc(data.home_1.description);
      setH2Desc(data.home_2.description);
      setMedDesc(data.meditation.description);
      setBioDesc(data.biochemical.description);
      setSpinner(false);
    });
  };

  const handleSubmit = (type, url, description) => {
    if (!isValidURL(url)) {
      toast.error("Enter valid URL", errorToast);
      setSpinner(false);
      return;
    }
    if (!url || !description) {
      setErrorMessage(true);
      return;
    }
    setSpinner(true);
    updateCompulsoryVideo({
      [`${type}`]: { url, description: fontClasses + description },
    })
      .then(() => {
        setSpinner(false);
        setErrorMessage(false);
        toast.success("Updated Successfully!", updateToast);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong", errorToast);
        setSpinner(false);
        setErrorMessage(false);
      });
  };

  return (
    <>
      <Row className="mb-3">
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="border-0">
              <h3 className="d-inline-block mr-4">
                Home Screen Introduction Video
              </h3>
            </CardHeader>
            <hr className="my-0 mx-2" />
            <div>
              <Form>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">URL</h4>
                    <Input
                      className={!h1Url && showError ? "is-invalid url" : "url"}
                      placeholder="Add URL"
                      type="url"
                      value={h1Url}
                      onChange={(e) => setH1Url(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">Description</h4>
                    <div className={!h1Desc && showError ? "is-invalid" : ""}>
                      <ReactQuill
                        value={h1Desc}
                        onChange={(value) => setH1Desc(value)}
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
              </Form>
              <Row className="px-5 py-3">
                <Col>
                  <button
                    onClick={() => handleSubmit("home_1", h1Url, h1Desc)}
                    className="btn addBtn px-4 py-1"
                  >
                    Update
                  </button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="border-0">
              <h3 className="d-inline-block mr-4">
                Home Screen Featured Video
              </h3>
            </CardHeader>
            <hr className="my-0 mx-2" />
            <div>
              <Form>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">URL</h4>
                    <Input
                      className={!h2Url && showError ? "is-invalid url" : "url"}
                      placeholder="Add URL"
                      type="url"
                      value={h2Url}
                      onChange={(e) => setH2Url(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">Description</h4>
                    <div className={!h2Desc && showError ? "is-invalid" : ""}>
                      <ReactQuill
                        value={h2Desc}
                        onChange={(value) => setH2Desc(value)}
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
              </Form>
              <Row className="px-5 py-3">
                <Col>
                  <button
                    onClick={() => handleSubmit("home_2", h2Url, h2Desc)}
                    className="btn addBtn px-4 py-1"
                  >
                    Update
                  </button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="border-0">
              <h3 className="d-inline-block mr-4">Meditation Screen Video</h3>
            </CardHeader>
            <hr className="my-0 mx-2" />
            <div>
              <Form>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">URL</h4>
                    <Input
                      className={
                        !medUrl && showError ? "is-invalid url" : "url"
                      }
                      placeholder="Add URL"
                      type="url"
                      value={medUrl}
                      onChange={(e) => setMedUrl(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">Description</h4>
                    <div className={!medDesc && showError ? "is-invalid" : ""}>
                      <ReactQuill
                        value={medDesc}
                        onChange={(value) => setMedDesc(value)}
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
              </Form>
              <Row className="px-5 py-3">
                <Col>
                  <button
                    onClick={() => handleSubmit("meditation", medUrl, medDesc)}
                    className="btn addBtn px-4 py-1"
                  >
                    Update
                  </button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="border-0">
              <h3 className="d-inline-block mr-4">Biochemical Screen Video</h3>
            </CardHeader>
            <hr className="my-0 mx-2" />
            <div>
              <Form>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">URL</h4>
                    <Input
                      className={
                        !bioUrl && showError ? "is-invalid url" : "url"
                      }
                      placeholder="Add URL"
                      type="url"
                      value={bioUrl}
                      onChange={(e) => setBioUrl(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="px-5 py-3">
                  <Col lg="12">
                    <h4 className="headingColor">Description</h4>
                    <div className={!bioDesc && showError ? "is-invalid" : ""}>
                      <ReactQuill
                        value={bioDesc}
                        onChange={(value) => setBioDesc(value)}
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
              </Form>
              <Row className="px-5 py-3">
                <Col>
                  <button
                    onClick={() => handleSubmit("biochemical", bioUrl, bioDesc)}
                    className="btn addBtn px-4 py-1"
                  >
                    Update
                  </button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CompulsoryVideos;
