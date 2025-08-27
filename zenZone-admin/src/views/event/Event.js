import React, { useState } from "react";
import { Card, CardHeader, Container, Row, Col } from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { fetchOne } from "services/eventService";
import { useParams } from "react-router-dom";
import * as moment from "moment";

function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  React.useEffect(() => {
    fetchMeditation();
  }, []);

  const fetchMeditation = async () => {
    fetchOne(id)
      .then((data) => setEvent(data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <SimpleHeader name="Meeting & Event" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Event Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              {event && (
                <div>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Title</h3>
                      <p className="mb-0 text-dark">{event.title}</p>
                    </Col>
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Date & Time</h3>
                      <p className="mb-0 text-dark">
                        {event.date
                          ? moment(event.date).format("MM-DD-YYYY, hh:mm A")
                          : ""}
                      </p>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h3 className="headingColor-secondary">Location</h3>
                      <p className="mb-0 text-dark">{event.location}</p>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h3 className="headingColor-secondary">Agenda/Detail</h3>
                      {event.detail && (
                        <div
                          className="mb-0"
                          dangerouslySetInnerHTML={{
                            __html: event.detail.replace(
                              /(<style[\w\W]+style>)/g,
                              ""
                            ),
                          }}
                        ></div>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default Event;
