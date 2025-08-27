import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";

const Donate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-shine">
        <TopNav />
        <div className="appSection pb-6">
          <Row className="appSectionInner">
            <Col className="d-flex align-items-center" lg="6" md="12">
              <div className="pt-5 d-flex justify-content-center">
                <img
                  className="homeImg"
                  src="assets/images/donate-bg.png"
                  alt="img"
                />
              </div>
            </Col>
            <Col
              className="d-flex align-items-center justify-content-md-center justify-content-lg-start"
              lg="6"
              md="12"
            >
              <div>
                <div className="mx-md-5 my-5">
                  <p className="intoText text-center-medium MorganiteFont">
                    TAX DEDUCTION
                    <br />
                    <span className="main-text-color MorganiteFont">
                      TAX CONTRIBUTION
                    </span>
                  </p>
                  <div className="py-2 px-3 leftBar">
                    <h5 className="mb-0 MontserratFont paragraphDim">
                      Lorem Ipsum is simply dummy text of the printing and
                      <br />
                      industry. Lorem Ipsum has been the industry's standard
                      dummy
                      <br />
                      text ever since the 1500s, when an unknown printer took a
                      galley
                      <br />
                      of type and scrambled it to make a type specimen book.
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer colored />
    </>
  );
};

export default Donate;
