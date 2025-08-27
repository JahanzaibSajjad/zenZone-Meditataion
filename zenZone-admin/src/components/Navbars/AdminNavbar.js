import classnames from "classnames";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Navbar,
} from "reactstrap";
import { logout } from "services/authService";

function AdminNavbar({ theme }) {
  const history = useHistory();
  const [showBack, setBack] = useState(false);
  const handleLogout = (e) => {
    e.preventDefault();
    logout()
      .then(() => {
        history.push("/auth/login");
      })
      .catch((err) => {
        console.log(err);
        history.push("/auth/login");
      });
  };

  useEffect(() => {
    displayBackButton(history.location);
    return history.listen((location, action) => {
      displayBackButton(location);
    });
  }, []);

  const displayBackButton = (location) => {
    if (
      location.pathname.startsWith("/admin/sheet/") ||
      location.pathname.startsWith("/admin/meditation/") ||
      location.pathname.startsWith("/admin/add-meditation") ||
      location.pathname.startsWith("/admin/add-sheet") ||
      location.pathname.startsWith("/admin/book/") ||
      location.pathname.startsWith("/admin/add-book") ||
      location.pathname.startsWith("/admin/event/") ||
      location.pathname.startsWith("/admin/add-event") ||
      location.pathname.startsWith("/admin/podcast/") ||
      location.pathname.startsWith("/admin/add-podcast")
    ) {
      setBack(true);
    } else {
      setBack(false);
    }
  };

  return (
    <>
      <Navbar
        className={classnames(
          "navbar-top navbar-expand-end",
          { "navbar-dark bg-info-bh": theme === "dark" },
          { "navbar-light bg-secondary": theme === "light" },
          { "navbar-expand-space": showBack === true }
        )}
      >
        {showBack && (
          <div
            role="button"
            className="mx-5 text-white"
            onClick={() => {
              if (
                history.location.pathname.startsWith("/admin/meditation/") ||
                history.location.pathname.startsWith("/admin/add-meditation")
              ) {
                history.push("/admin/meditations");
              } else if (
                history.location.pathname.startsWith("/admin/sheet/") ||
                history.location.pathname.startsWith("/admin/add-sheet")
              ) {
                history.push("/admin/sheets");
              } else if (
                history.location.pathname.startsWith("/admin/book/") ||
                history.location.pathname.startsWith("/admin/add-book")
              ) {
                history.push("/admin/books");
              } else if (
                history.location.pathname.startsWith("/admin/podcast/") ||
                history.location.pathname.startsWith("/admin/add-podcast")
              ) {
                history.push("/admin/podcasts");
              } else if (
                history.location.pathname.startsWith("/admin/event/") ||
                history.location.pathname.startsWith("/admin/add-event")
              ) {
                history.push("/admin/events");
              }
            }}
          >
            <i className="fa fa-arrow-left mr-3"></i>Back
          </div>
        )}
        <div className="mx-5">
          <UncontrolledDropdown nav>
            <DropdownToggle
              role="button"
              className="nav-link pr-0"
              color=""
              tag="a"
            >
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle bg-white">
                  <i className="fa fa-user icon-color-light text-lg"></i>
                </span>
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm text-white font-weight-bold">
                    Admin
                    <i className="ml-2 fa fa-chevron-down"></i>
                  </span>
                </Media>
              </Media>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={(e) => history.push("/admin/change-password")}
              >
                <i className="fa fa-lock" />
                <span>Change Password</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={(e) => handleLogout(e)}>
                <i className="fa fa-sign-out-alt mirror" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Navbar>
    </>
  );
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: "dark",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default AdminNavbar;
