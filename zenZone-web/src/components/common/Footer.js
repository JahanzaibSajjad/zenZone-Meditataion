import React, { useEffect, useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import * as moment from "moment";

const Footer = ({ colored = true }) => {
  const history = useHistory();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(history.location.pathname);
    return history.listen((location, action) => {
      setActive(location.pathname);
    });
  }, [history]);

  return (
    <>
      <div
        className={
          active === "/books" ||
          active === "/podcasts" ||
          active === "/websites"
            ? ""
            : colored
            ? "bg-color"
            : ""
        }
      >
        <div className="footer-inner">
          <div className="d-flex align-items-center justify-content-center">
            <img
              className="mb-4 logo-footer"
              alt="logo"
              src="/assets/images/bh_logo.svg"
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <Nav className="footerNav">
              <Link to={"/"}>Home</Link>
              <Link to="/meditation">Meditation</Link>
              <Link to="/biochemical-balance">Biochemical Balance</Link>
              <Link to="/nutrition-consultation">Nutrition Consultation</Link>
              <Link to="/books">Library</Link>
              <Link to="/events">Events</Link>
              <Link to="/donate">Donate</Link>
            </Nav>
          </div>
          <div className="d-flex align-items-center justify-content-center my-2">
            <Row>
              <Col xs="4">
                <i
                  onClick={() => window.open("https://twitter.com", "_blank")}
                  role={"button"}
                  className="shareIcon fab fa-twitter"
                ></i>
              </Col>
              <Col xs="4">
                <i
                  onClick={() => window.open("https://facebook.com", "_blank")}
                  role={"button"}
                  className="shareIcon fab fa-facebook-square"
                ></i>
              </Col>
              <Col xs="4">
                <i
                  onClick={() => window.open("https://instagram.com", "_blank")}
                  role={"button"}
                  className="shareIcon fab fa-instagram"
                ></i>
              </Col>
            </Row>
          </div>
          <div className="d-flex align-items-center justify-content-center mainDarkbg">
            <h5 className="MontserratFont boldText eventTime mb-0 py-3">
              &copy; {moment().year()}. All Rights Reserved
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
