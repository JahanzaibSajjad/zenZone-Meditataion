import React from "react";
import {
  useLocation,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { isLoggedIn } from "services/authService";
import { sidebarRoutes } from "routes.js";

function Admin() {
  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const location = useLocation();
  const history = useHistory();
  const mainContentRef = React.useRef(null);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    !isLoggedIn() && history.push("/auth/login");
  }, [location]);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < sidebarRoutes.length; i++) {
      if (
        location.pathname.indexOf(
          sidebarRoutes[i].layout + sidebarRoutes[i].path
        ) !== -1
      ) {
        return sidebarRoutes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  const toggleSidenav = (e) => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    setSidenavOpen(!sidenavOpen);
  };
  const getNavbarTheme = () => {
    return location.pathname.indexOf("admin/alternative-dashboard") === -1
      ? "dark"
      : "light";
  };

  return (
    <>
      <Sidebar
        routes={sidebarRoutes.filter(
          (route) =>
            (route.path &&
              route.path !== "/sheet/:id" &&
              route.path !== "/book/:id" &&
              route.path !== "/event/:id" &&
              route.path !== "/podcast/:id" &&
              route.path !== "/meditation/:id" &&
              route.path !== "/change-password" &&
              !route.path.startsWith("/add-meditation") &&
              !route.path.startsWith("/add-book") &&
              !route.path.startsWith("/add-podcast") &&
              !route.path.startsWith("/add-event") &&
              !route.path.startsWith("/add-sheet")) ||
            route.views
        )}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: "/admin/meditations",
          imgSrc: "/bh_logo.png",
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar
          theme={getNavbarTheme()}
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
          brandText={getBrandText(location.pathname)}
        />
        <Switch>
          {getRoutes(sidebarRoutes)}
          <Redirect from="*" to="/admin/meditations" />
        </Switch>
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  );
}

export default Admin;
