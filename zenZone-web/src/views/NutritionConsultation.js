import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";
import NutritionForm from "../components/nutrition/NutritionForm";

const NutritionConsultation = () => {
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
                      platform offers guided meditations, breathing exercises,
                      and wellness tips tailored to help you manage stress,
                      anxiety, and improve your overall well-being. Whether
                      you're looking to relieve stress, sleep better, or find
                      clarity, ZenZone is here to guide you towards a balanced
                      and healthier lifestyle. Start your journey today and
                      experience the transformation!
                    </h4>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="pt-5 d-flex justify-content-center">
                <img
                  className="homeImg"
                  src="assets/images/nutrition-bg.png"
                  alt="img"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="pb-5 bg-color">
        <NutritionForm />
      </div>
      <Footer colored={true} />
    </>
  );
};

export default NutritionConsultation;
