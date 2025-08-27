import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Recaptcha from "react-recaptcha";
import { sendEmail } from "../../services/APIsService";
import toast, { Toaster } from "react-hot-toast";
import { errorToast, successToast } from "../../shared/constants";

const NutritionForm = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isVerified, setVerified] = useState(false);

  let recaptchaRef;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("Required fields must not be empty!", errorToast);
      return;
    }
    sendEmail({ name, number, email, msg });
    setName("");
    setNumber("");
    setEmail("");
    setMsg("");
    setVerified(false);
    recaptchaRef.reset();
    toast.success("Recorded Successfully!", successToast);
  };

  return (
    <>
      <div className="bg-form">
        <h2 className="text-center MontserratFont mainDarkColor boldText">
          Free Recovery Nutrition Consultation
        </h2>
        <h1 className="text-center main-text-color intoText MorganiteFont">
          DETAILS
        </h1>
        <Form>
          <Container>
            <Row className="mx-md-5 px-md-5 mx-sm-3 px-sm-3">
              <Col className="py-2" lg="6" md="12">
                <label className="MontserratFont">
                  Full Name <span className="required">*</span>
                </label>
                <Form.Control
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
              </Col>
              <Col className="py-2" lg="6" md="12">
                <label className="MontserratFont">Phone Number</label>
                <Form.Control
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  type="text"
                />
              </Col>
              <Col className="py-2" lg="12">
                <label className="MontserratFont">
                  Email Address <span className="required">*</span>
                </label>
                <Form.Control
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </Col>
              <Col className="py-2" lg="12">
                <label className="MontserratFont">
                  Tell us about your situation{" "}
                  <span className="required">*</span>
                </label>
                <Form.Control
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type your message here..."
                  as="textarea"
                  rows={"4"}
                />
              </Col>
              <Col className="py-2" lg="12">
                <p>
                  <span className="required">*</span> Fields required
                </p>
              </Col>
              <Col>
                <Recaptcha
                  ref={(e) => {
                    recaptchaRef = e;
                  }}
                  sitekey={process.env.REACT_APP_RECAPCHA_KEY}
                  render="explicit"
                  verifyCallback={(response) => response && setVerified(true)}
                />
              </Col>
              <Col className="d-flex justify-content-center py-2" lg="12">
                <button
                  type="submit"
                  className="btn px-5 py-3 MontserratFont submitBtn MontserratFont"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
      <Toaster />
    </>
  );
};

export default NutritionForm;
