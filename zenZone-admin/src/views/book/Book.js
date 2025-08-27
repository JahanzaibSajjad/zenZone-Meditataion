import React, { useState } from "react";
import { Card, CardHeader, Container, Row, Col } from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { fetchOne } from "services/bookService";
import { useParams } from "react-router-dom";
import SpinnerLoader from "components/Misc/Spinner";

function Book() {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [showSpinner, setSpinner] = useState(true);

  React.useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    setSpinner(true);
    fetchOne(id)
      .then((data) => {
        setBook(data);
        setSpinner(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name="Book" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-7 col-md-12">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Book Detail</h3>
              </CardHeader>
              <hr className="my-0 mx-2" />
              {book && (
                <div>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Title</h3>
                      <p className="mb-0 text-dark">{book.title}</p>
                    </Col>
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary">Book URL</h3>
                      <p className="mb-0 text-dark">{book.url}</p>
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="12">
                      <h3 className="headingColor-secondary">Description</h3>
                      {book.description && (
                        <div
                          className="mb-0"
                          dangerouslySetInnerHTML={{
                            __html: book.description.replace(
                              /(<style[\w\W]+style>)/g,
                              ""
                            ),
                          }}
                        ></div>
                      )}
                    </Col>
                  </Row>
                  <Row className="px-5 py-3">
                    <Col lg="6" md="12">
                      <h3 className="headingColor-secondary mb-3">
                        Attached Book Cover Imgae
                      </h3>
                      <img src={book.cover} className="meditationImageDetail" />
                      <br />
                      <small>{decodeURI(/[^/]*$/.exec(book.cover)[0])}</small>
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

export default Book;
