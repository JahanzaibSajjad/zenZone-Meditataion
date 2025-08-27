import React, { useState } from "react";
import { Card, CardHeader, Container, Row, Col } from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { fetchOne } from "services/podcastService";
import { useParams } from "react-router-dom";
import SpinnerLoader from "components/Misc/Spinner";

function Podcast() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const [showSpinner, setSpinner] = useState(true);

  React.useEffect(() => {
    fetchPodcast();
  }, []);

  const fetchPodcast = async () => {
    setSpinner(true);
    fetchOne(id)
      .then((data) => {
        setPodcast(data);
        setSpinner(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name="Podcast" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Podcast Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              {podcast && (
                <div>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Title</h3>
                      <p className="mb-0 text-dark">{podcast.title}</p>
                    </Col>
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Podcast URL</h3>
                      <p className="mb-0 text-dark">{podcast.url}</p>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary mb-3">
                        Attached Podcast Imgae
                      </h3>
                      <img
                        src={podcast.cover}
                        className="meditationImageDetail"
                      />
                      <br />
                      <small>
                        {decodeURI(/[^/]*$/.exec(podcast.cover)[0])}
                      </small>
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

export default Podcast;
