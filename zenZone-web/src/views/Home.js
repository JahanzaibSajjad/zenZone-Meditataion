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
                    At ZenZone, we believe in the power of mindfulness and
                    meditation to promote mental wellness and relaxation. Our
                    platform offers guided meditations, breathing exercises, and
                    wellness tips tailored to help you manage stress, anxiety,
                    and improve your overall well-being. Whether you're looking
                    to relieve stress, sleep better, or find clarity, ZenZone is
                    here to guide you towards a balanced and healthier
                    lifestyle. Start your journey today and experience the
                    transformation!
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
