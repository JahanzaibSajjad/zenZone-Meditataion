import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const AppsSection = ({ colored = true }) => {
  return (
    <div className={colored ? "bg-shine" : ""}>
      <div className="appSection">
        <Container fluid>
          <Row className="appSectionInner">
            <Col className="d-flex align-items-center" lg="6" md="12">
              <div className="d-flex justify-content-center">
                <img
                  className="appImg"
                  src="assets/images/app-section.png"
                  alt="img"
                />
              </div>
            </Col>
            <Col className="d-flex align-items-center" lg="6" md="12">
              <div>
                <div className="mx-md-5 my-5">
                  <p className="intoText text-center-medium MorganiteFont">
                    BALANCED HEALING
                    <br />
                    FOR{" "}
                    <span className="mainDarkColor MorganiteFont">HEROES</span>
                  </p>
                  <div className="py-2 px-3 leftBar">
                    <h4 className="mb-0 line-height SansProFont paragraphDim text-lg">
                      Lorem Ipsum is simply dummy text of the printing
                    </h4>
                    <div className="mt-3">
                      <button className="btn appBtn my-2 mx-2">
                        <img
                          className="appBtnIcon"
                          src="/assets/images/google-play.png"
                          alt="google-play"
                        />
                      </button>
                      <button className="mx-2 my-2 btn appBtn">
                        <img
                          className="appBtnIcon"
                          src="/assets/images/ios-store.png"
                          alt="ios-store"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AppsSection;
