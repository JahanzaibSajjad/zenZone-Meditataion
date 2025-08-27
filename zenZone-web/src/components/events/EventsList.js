import React, { useEffect, useState } from "react";
import { Col, Container, FormControl, Pagination, Row } from "react-bootstrap";
import { getEvents } from "../../services/APIsService";
import * as moment from "moment";
import DescriptionModal from "../common/DescriptionModal";
import ReactDatetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import OutsideClickHandler from "react-outside-click-handler";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const pageSize = 5;
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [showDescModal, setDescModal] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const pages = () => {
    let pagesArr = [];
    for (let i = 1; i <= Math.ceil(count / pageSize); i++) {
      pagesArr.push(
        <Pagination.Item
          onClick={(e) => i !== currentPage && handlePageClick(e, i)}
          key={i}
          active={i === currentPage}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pagesArr;
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    fetchEvents({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(searchDate && { date: moment(searchDate).format("YYYY-MM-DD") }),
    });
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchEvents({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(searchDate && { date: moment(searchDate).format("YYYY-MM-DD") }),
    });
    setPage(1);
  }, [search, searchDate]);

  const fetchEvents = (body) => {
    getEvents(body)
      .then((data) => {
        setEvents(data.events);
        setCount(data.count);
      })
      .catch((err) => console.log(err));
  };

  const showDesc = (title, desc) => {
    setDesc(desc);
    setTitle(title);
    setDescModal(true);
  };

  const onDateChange = (e) => {
    setSearchDate(e);
    setCalendarOpen(false);
    fetchEvents({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(e && { date: moment(e).format("YYYY-MM-DD") }),
    });
  };

  const clearClick = (e) => {
    if (searchDate !== "") {
      setSearchDate("");
      fetchEvents({
        skip: 0,
        take: pageSize,
        ...(search.trim() && {
          search: search.trim(),
        }),
      });
      setPage(1);
    }
  };

  return (
    <div className="mt-5 small-container">
      <Container>
        <Row>
          <Col xs="6" sm="6" md="7" lg="9">
            <div className="position-relative">
              <FormControl
                className="search-input"
                type={"text"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title/ location....."
              />
              <img
                alt="search-icon"
                className="search-icon"
                src="/assets/images/search-icon.png"
              />
            </div>
          </Col>
          <Col xs="6" sm="6" md="5" lg="3">
            <div className="position-relative">
              <OutsideClickHandler
                onOutsideClick={() => {
                  isCalendarOpen && setCalendarOpen(false);
                }}
              >
                <ReactDatetime
                  className="calendar-input"
                  inputProps={{
                    readOnly: true,
                    onClick: () => setCalendarOpen(!isCalendarOpen),
                    placeholder: 'Select Date'
                  }}
                  timeFormat={false}
                  dateFormat={"MM-DD-YYYY"}
                  value={searchDate}
                  onChange={onDateChange}
                  closeOnSelect={true}
                  closeOnClickOutside={true}
                  open={isCalendarOpen}
                  renderInput={(props) => {
                    return (
                      <input {...props} value={searchDate ? props.value : ""} />
                    );
                  }}
                />
                <img
                  role={"button"}
                  alt="calendar-icon"
                  className="calendar-icon"
                  src="/assets/images/calendar.svg"
                  onClick={() => setCalendarOpen(!isCalendarOpen)}
                />
              </OutsideClickHandler>
              <div role={"button"} onClick={clearClick}>
                <i className="fa fa-times clear text-lg"></i>
              </div>
            </div>
          </Col>
        </Row>
        <div>
          {events.length ? (
            events.map((event, index) => (
              <div className="meditationDiv mx-3" key={index}>
                <Row className="my-5">
                  <Col className="px-lg-0" lg="3">
                    <div className="eventDivOuter d-inline-block">
                      <div className="eventDiv main-bg d-flex align-items-center justify-content-center">
                        <div>
                          <h1 className="text-center mb-0 MorganiteFont anchor eventDate">
                            {moment(event.date).utc().date().toString()}
                          </h1>
                          <h4 className="text-center mb-3 boldText eventDay text-white MontserratFont">
                            {moment(event.date).utc().format("MMMM") +
                              ", " +
                              moment(event.date).utc().format("YYYY")}
                          </h4>
                          <h6 className="text-center boldText eventTime MontserratFont">
                            {moment(event.date).utc().format("hh:mm A")}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="d-lg-none eventName display-lg-inline mx-3">
                      <h1 className="anchor text-capitalize MorganiteFont">
                        {event.title}
                      </h1>
                    </div>
                  </Col>
                  <Col className="py-4 px-lg-5" lg="9">
                    <h1 className="mt-3 MorganiteFont text-capitalize display-lg-none">
                      {event.title}
                    </h1>
                    <h6 className="anchor pl-before-lg pr-before-lg text-uppercase MontserratFont">
                      {event.location}
                    </h6>
                    {event.detail && (
                      <small className="anchor pl-before-lg pr-before-lg MontserratFont meditation-desc mb-0">
                        <span>
                          {event.detail
                            .replace(/(<style[\w\W]+style>)/g, "")
                            .replace(/(<([^>]+)>)/gi, "")
                            .replace(/&.*;/g, "")
                            .slice(0, window.innerWidth < 575 ? 80 : 250)}
                        </span>
                        <span>
                          {((window.innerWidth < 575 &&
                            event.detail.length > 80) ||
                            (window.innerWidth > 575 &&
                              event.detail.length > 250)) && (
                            <span
                              role={"button"}
                              className="mx-2 mainDarkColor boldText"
                              onClick={() =>
                                showDesc(event.title, event.detail)
                              }
                            >
                              read more
                            </span>
                          )}
                        </span>
                      </small>
                    )}
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <div className="mt-5 d-flex align-items-center justify-content-center">
              No records found
            </div>
          )}
          <div className="pt-5 d-flex align-items-center justify-content-end">
            <Pagination size="sm">
              <i
                role={"button"}
                onClick={(e) =>
                  currentPage > 1 && handlePageClick(e, currentPage - 1)
                }
                className={
                  (currentPage <= 1 ? "paragraphDim" : "") +
                  " fa fa-angle-left pageIcon"
                }
              ></i>
              {pages()}
              <i
                role={"button"}
                onClick={(e) =>
                  currentPage < Math.ceil(count / pageSize) &&
                  handlePageClick(e, currentPage + 1)
                }
                className={
                  (currentPage >= Math.ceil(count / pageSize)
                    ? "paragraphDim"
                    : "") + " fa fa-angle-right pageIcon"
                }
              ></i>
            </Pagination>
          </div>
        </div>
      </Container>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setDescModal(false)}
        desc={desc}
        title={title}
      />
    </div>
  );
};

export default EventsList;
