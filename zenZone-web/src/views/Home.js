import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import AppsSection from "../components/common/AppsSection";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";
import HomeVideos from "../components/homepage/HomeVideos";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-color pb-5">
        <TopNav />
        <Row className="bg-path">
          <Col lg="6" md="12">
            <div className="d-flex justify-content-center">
              <img
                className="homeImg"
                src="assets/images/home-hero.png"
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
              <div className="mx-5">
                <p className="intoText text-center-medium MorganiteFont">
                  BALANCED HEALING
                  <br />
                  FOR{" "}
                  <span className="mainDarkColor MorganiteFont">HEROES</span>
                </p>
                <div className="py-2 px-3 leftBar">
                  <h4 className="mb-0 line-height SansProFont paragraphDim text-lg">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting
                    <br />
                    industry. Lorem Ipsum has been the industry's standard dummy
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
        </Row>
      </div>
      <div className="bg-shine-home-vid">
        <HomeVideos />
      </div>
      <AppsSection />
      <Footer />
    </>
  );
};

export default Home;
