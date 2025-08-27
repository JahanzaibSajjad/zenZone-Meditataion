import React, { useEffect, useState } from "react";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { Card, CardHeader, Container, Row, Col, Input, Form } from "reactstrap";
import { useParams } from "react-router-dom";
import { fetchOne, update, add } from "services/eventService";
import {
  defaultEvent,
  updateToast,
  successToast,
  errorToast,
} from "shared/constants";
import SpinnerLoader from "components/Misc/Spinner";
import toast, { Toaster } from "react-hot-toast";
import * as moment from "moment";
import ReactDatetime from "react-datetime";
import ReactQuill from "react-quill";
import { fontClasses } from "shared/constants";
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ["serif", "san-serif", "monospace"];
ReactQuill.Quill.register(Font, true);
import classnames from "classnames";

const AddEvent = () => {
  const { id } = useParams();

  //form values states
  const [event, setEvent] = useState(defaultEvent);
  const [title, setTitle] = useState(defaultEvent.title);
  const [desc, setDesc] = useState(defaultEvent.detail);
  const [date, setDate] = useState(defaultEvent.date);
  const [location, setLoc] = useState(defaultEvent.location);
  const [showSpinner, setSpinner] = useState(true);

  //validation states
  const [showError, setErrorMessage] = useState(false);

  useEffect(() => {
    id ? fetchEvent() : setSpinner(false);
  }, []);

  const fetchEvent = async () => {
    fetchOne(id)
      .then((data) => {
        setEvent(data);
        setDesc(data.detail);
        setTitle(data.title);
        setLoc(data.location);
        setDate(data.date);
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
        event.title === title &&
        event.detail === desc &&
        event.date === date &&
        event.location === location
      ) {
        toast.success("Event Updated Successfuly", updateToast);
        setSpinner(false);
        return;
      }
      if (!title || !desc || !date) {
        setSpinner(false);
        setErrorMessage(true);
        return;
      }
      if (id) {
        await update(id, { title, detail: fontClasses + desc, date, location });
        setEvent({ title, detail: desc, date, location });
        toast.success("Event Updated Successfuly", updateToast);
      } else {
        await add({ title, detail: fontClasses + desc, date, location });
        toast.success("Event Added Successfuly", successToast);
        setEvent(defaultEvent);
        setDesc(defaultEvent.detail);
        setTitle(defaultEvent.title);
        setLoc(defaultEvent.location);
        setDate(defaultEvent.date);
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
      <SimpleHeader
        name={id ? "Edit Meeting & Event" : "Add Meeting & Event"}
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Event Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              <div>
                <Form>
                  <Row className="px-5 py-3">
                    <Col md="12" lg="6">
                      <h4 className="headingColor">Title</h4>
                      <Input
                        className={!title && showError ? "is-invalid" : ""}
                        placeholder="Add Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Col>
                    <Col md="12" lg="6">
                      <h4 className="headingColor">Date & Time</h4>
                      <div
                        className={classnames(
                          {
                            "datePicker-invalid": !date && showError,
                          },
                          { "highlight-today": !date }
                        )}
                      >
                        <ReactDatetime
                          inputProps={{
                            readOnly: true,
                            placeholder: "Add Date & Time",
                          }}
                          timeFormat={"hh:mm A"}
                          dateFormat={"MM-DD-YYYY"}
                          value={
                            date
                              ? moment(date).format("MM-DD-YYYY hh:mm A")
                              : ""
                          }
                          onChange={(e) => setDate(e)}
                          closeOnSelect={true}
                          closeOnClickOutside={true}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h4 className="headingColor">Location</h4>
                      <Input
                        className={!location && showError ? "is-invalid" : ""}
                        placeholder="Add Location"
                        type="text"
                        value={location}
                        onChange={(e) => setLoc(e.target.value)}
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

export default AddEvent;
