import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ZenBot from "../../zenBot";

const TopNav = () => {
  const history = useHistory();
  const [active, setActive] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setActive(history.location.pathname);
    return history.listen((location, action) => {
      setActive(location.pathname);
    });
  }, [history]);

  return (
    <>
      <Navbar className="py-4" expanded={expanded} collapseOnSelect expand="lg">
        <Link to={"/"}>
          <Navbar.Brand>
            <img
              className="mt-2 imgLogo"
              src="assets/images/bh_logo.svg"
              alt="logo"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/" ? "active" : ""}
              to={"/"}
            >
              Home
            </Link>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/meditation" ? "active" : ""}
              to="/meditation"
            >
              Meditation
            </Link>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/biochemical-balance" ? "active" : ""}
              to="/biochemical-balance"
            >
              Biochemical Balance
            </Link>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/nutrition-consultation" ? "active" : ""}
              to="/nutrition-consultation"
            >
              Nutrition Consultation
            </Link>
            <NavDropdown
              className={
                active === "/books" ||
                active === "/podcasts" ||
                active === "/websites"
                  ? "active"
                  : ""
              }
              title="Library"
              id="basic-nav-dropdown"
            >
              <div className={active === "/books" ? "active-dropdown" : ""}>
                <NavDropdown.Item
                  onClick={() => setExpanded(false)}
                  href="/books"
                >
                  Recommended Books
                </NavDropdown.Item>
              </div>
              <div className={active === "/podcasts" ? "active-dropdown" : ""}>
                <NavDropdown.Item
                  onClick={() => setExpanded(false)}
                  href="/podcasts"
                >
                  Podcasts Links
                </NavDropdown.Item>
              </div>
              <div className={active === "/websites" ? "active-dropdown" : ""}>
                <NavDropdown.Item
                  onClick={() => setExpanded(false)}
                  href="/websites"
                >
                  Third-party Websites
                </NavDropdown.Item>
              </div>
            </NavDropdown>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/events" ? "active" : ""}
              to="/events"
            >
              Events
            </Link>
            <Link
              onClick={() => setExpanded(false)}
              className={active === "/donate" ? "active" : ""}
              to="/donate"
            >
              Donate
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default TopNav;
