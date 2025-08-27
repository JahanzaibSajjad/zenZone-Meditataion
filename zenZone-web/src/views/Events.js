import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";
import EventsList from "../components/events/EventsList";

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-shine">
        <TopNav />
        <div className="appSection pb-6">
          <Row className="appSectionInner nutritionFlex">
            <Col
              className="d-flex align-items-center justify-content-md-center justify-content-lg-end"
              lg="6"
              md="12"
            >
              <div>
                <div className="mx-md-5 my-5">
                  <p className="intoText text-center-medium MorganiteFont">
                    EVENTS AND{" "}
                    <span className="mainDarkColor MorganiteFont">
                      MEETINGS
                    </span>
                  </p>
                  <div className="py-2 px-3 leftBar">
                    <h4 className="mb-0 line-height SansProFont paragraphDim text-lg">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting
                      <br />
                      industry. Lorem Ipsum has been the industry's standard
                      dummy
                      <br />
                      text ever since the 1500s, when an unknown printer took a
                      galley
                      <br />
                      of type and scrambled it to make a type specimen book.
                    </h4>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="pt-5 d-flex justify-content-center">
                <img
                  className="homeImg"
                  src="assets/images/events-bg.png"
                  alt="img"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="py-5 bg-color">
        <EventsList />
      </div>
      <Footer colored={true} />
    </>
  );
};

export default Events;
