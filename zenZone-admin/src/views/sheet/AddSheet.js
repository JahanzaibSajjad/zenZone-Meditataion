import React, { useEffect, useRef, useState } from "react";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { Card, CardHeader, Container, Row, Col, Input, Form } from "reactstrap";
import { useParams } from "react-router-dom";
import { fetchOne, update, add } from "services/sheetService";
import {
  defaultSheet,
  updateToast,
  successToast,
  errorToast,
} from "shared/constants";
import SpinnerLoader from "components/Misc/Spinner";
import toast, { Toaster } from "react-hot-toast";
import ReactQuill from "react-quill";
import { fontClasses } from "shared/constants";
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);

const AddMeditation = () => {
  const { id } = useParams();

  //form values states
  const [sheet, setSheet] = useState(defaultSheet);
  const [title, setTitle] = useState(defaultSheet.title);
  const [desc, setDesc] = useState(defaultSheet.detail);
  const [showSpinner, setSpinner] = useState(true);

  //validation states
  const [showError, setErrorMessage] = useState(false);

  useEffect(() => {
    id ? fetchSheet() : setSpinner(false);
  }, []);

  const fetchSheet = async () => {
    fetchOne(id)
      .then((data) => {
        setSheet(data);
        setDesc(data.detail);
        setTitle(data.title);
        setSpinner(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      if (id && sheet.title === title && sheet.detail === desc) {
        toast.success("Sheet Updated Successfuly", updateToast);
        setSpinner(false);
        return;
      }
      if (!title || !desc) {
        setSpinner(false);
        setErrorMessage(true);
        return;
      }
      if (id) {
        await update(id, { title, detail: fontClasses + desc });
        setSheet({ title, detail: desc });
        toast.success("Sheet Updated Successfuly", updateToast);
      } else {
        await add({ title, detail: fontClasses + desc });
        toast.success("Sheet Added Successfuly", successToast);
        setSheet(defaultSheet);
        setDesc(defaultSheet.detail);
        setTitle(defaultSheet.title);
      }
      setErrorMessage(false);
      setSpinner(false);
    } catch (err) {
      console.log(err);
      setSpinner(false);
      toast.error("Something went wrong", errorToast);
    }
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name={id ? "Edit Sheet" : "Add Sheet"} />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Sheet Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              <div>
                <Form>
                  <Row className="px-5 py-3">
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
