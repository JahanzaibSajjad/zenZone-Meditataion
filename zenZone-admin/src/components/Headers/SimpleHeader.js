import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import AddMood from "views/mood/AddMood";
import AddWebsite from "views/website/AddWebsite";

function TimelineHeader({ name, updateList }) {
  const history = useHistory();
  const [showAddBtn, setAddBtn] = useState(false);
  const [moodModal, showMoodModal] = useState(false);
  const [websiteModal, showWebsiteModal] = useState(false);

  useEffect(() => {
    if (
      history.location.pathname === "/admin/meditations" ||
      history.location.pathname === "/admin/moods" ||
      history.location.pathname === "/admin/sheets" ||
      history.location.pathname === "/admin/books" ||
      history.location.pathname === "/admin/events" ||
      history.location.pathname === "/admin/podcasts" ||
      history.location.pathname === "/admin/websites"
    ) {
      setAddBtn(true);
    }
  }, []);

  const handleAddClick = () => {
    if (history.location.pathname === "/admin/meditations") {
      history.push("/admin/add-meditation");
    } else if (history.location.pathname === "/admin/moods") {
      showMoodModal(true);
    } else if (history.location.pathname === "/admin/sheets") {
      history.push("/admin/add-sheet");
    } else if (history.location.pathname === "/admin/events") {
      history.push("/admin/add-event");
    } else if (history.location.pathname === "/admin/books") {
      history.push("/admin/add-book");
    } else if (history.location.pathname === "/admin/podcasts") {
      history.push("/admin/add-podcast");
    } else if (history.location.pathname === "/admin/websites") {
      showWebsiteModal(true);
    }
  };

  const handleModalClose = (value) => {
    updateList();
    showMoodModal(value);
  };

  const handleWebsiteModalClose = (value) => {
    value && updateList();
    showWebsiteModal(false);
  };

  return (
    <>
      <div className="header header-dark bg-info-bh pb-6 content__title content__title--calendar">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h6 className="h1 text-white d-inline-block mb-0 mx-2">
                  {name}
                </h6>
              </Col>
              {showAddBtn && (
                <Col lg="6">
                  <div className="d-flex align-items-center justify-content-end">
                    <button onClick={handleAddClick} className="btn bg-white default-color">
                      Add New
                    </button>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Container>
      </div>
      <AddMood
        moodModal={moodModal}
        showMoodModal={showMoodModal}
        handleModalClose={handleModalClose}
      />
      <AddWebsite
        websiteModal={websiteModal}
        showWebsiteModal={showWebsiteModal}
        handleModalClose={handleWebsiteModalClose}
      />
    </>
  );
}

TimelineHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default TimelineHeader;
