import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  FormControl,
  Pagination,
  Row,
  Badge,
} from "react-bootstrap";
import { getMeditations } from "../../services/APIsService";
import MeditationModal from "../common/MeditationModal";

/** FEELING → RECOMMENDED TAG (your “opposite” mapping) */
const FEELING_TO_TAG = {
  Anxious: "Calm",
  Stressed: "Calm",
  Tired: "Sleep",
  Unfocused: "Focus",
  Low: "Uplift",
};
const FEELINGS = Object.keys(FEELING_TO_TAG);

/** Fixed mood chips (match admin’s fixed set) */
const FIXED_MOODS = [
  { name: "Calm", emoji: "😌" },
  { name: "Sleep", emoji: "😴" },
  { name: "Focus", emoji: "🎯" },
  { name: "Uplift", emoji: "🌤️" },
  { name: "Anxiety Relief", emoji: "🫶" },
  { name: "Energy", emoji: "⚡" },
  { name: "Gratitude", emoji: "🧡" },
  { name: "Breathwork", emoji: "🫁" },
];

const pageSize = 5;

const Meditations = () => {
  const [meditations, setMeditations] = useState([]);
  const [search, setSearch] = useState("");
  const [med, setMed] = useState({});
  const [showMedModal, setMedModal] = useState(false);

  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);

  const [selectedTag, setSelectedTag] = useState(""); // mood tag like "Calm"
  const [feeling, setFeeling] = useState(""); // feeling like "Anxious"

  // Build request body for server pagination/filter
  const buildQuery = (pageNumber = 1) => {
    const base = { skip: (pageNumber - 1) * pageSize, take: pageSize };
    if (search.trim()) base.search = search.trim();
    if (selectedTag) base.mood = selectedTag; // backend filters by mood string
    return base;
  };

  const fetchMeditations = (body) => {
    getMeditations(body)
      .then((data) => {
        setMeditations(data.meditations || []);
        setCount(data.count || 0);
      })
      .catch((err) => console.log(err));
  };

  // Initial and reactive fetch
  useEffect(() => {
    fetchMeditations(buildQuery(1));
    setPage(1);
  }, [search, selectedTag]);

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    fetchMeditations(buildQuery(pageNumber));
    setPage(pageNumber);
  };

  const clickNext = (e) =>
    currentPage < Math.ceil(count / pageSize) &&
    handlePageClick(e, currentPage + 1);

  const openMedition = (meditation) => {
    setMed(meditation);
    setMedModal(true);
  };

  const pages = () => {
    const pagesArr = [];
    for (let i = 1; i <= Math.ceil(count / pageSize); i++) {
      pagesArr.push(
        <Pagination.Item
          onClick={(e) => handlePageClick(e, i)}
          key={i}
          active={i === currentPage}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pagesArr;
  };

  // “I feel …” sets the recommended mood tag
  const handleFeeling = (f) => {
    const tag = FEELING_TO_TAG[f] || "";
    setFeeling(f);
    setSelectedTag(tag);
  };

  // Reset filters
  const clearFilters = () => {
    setFeeling("");
    setSelectedTag("");
  };

  return (
    <div className="pt-5 small-container">
      <Container>
        {/* Search box */}
        <div className="position-relative">
          <FormControl
            className="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title/ description....."
          />
          <img
            alt="search-icon"
            className="search-icon"
            src="/assets/images/search-icon.png"
          />
        </div>

        {/* Feeling selector */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <span className="paragraphDim">I feel:</span>
          {FEELINGS.map((f) => (
            <Badge
              key={f}
              pill
              bg={feeling === f ? "primary" : "light"}
              text={feeling === f ? "light" : "dark"}
              onClick={() => handleFeeling(f)}
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                border: "1px solid #e6e6f0",
              }}
            >
              {f}
            </Badge>
          ))}
          <span className="paragraphDim ms-2">
            {feeling && (
              <>
                {" "}
                → Recommended: <strong>{FEELING_TO_TAG[feeling]}</strong>
              </>
            )}
          </span>
          {(feeling || selectedTag) && (
            <span
              role="button"
              className="ms-3 paragraphDim"
              onClick={clearFilters}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Clear
            </span>
          )}
        </div>

        {/* Mood chips bar (tags) */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <span className="paragraphDim">Filter by mood:</span>
          {/* “All” chip */}
          <Badge
            pill
            bg={!selectedTag ? "secondary" : "light"}
            text={!selectedTag ? "light" : "dark"}
            onClick={() => setSelectedTag("")}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              border: "1px solid #e6e6f0",
            }}
            title="All"
          >
            All
          </Badge>
          {FIXED_MOODS.map((m) => (
            <Badge
              key={m.name}
              pill
              bg={selectedTag === m.name ? "secondary" : "light"}
              text={selectedTag === m.name ? "light" : "dark"}
              onClick={() =>
                setSelectedTag(selectedTag === m.name ? "" : m.name)
              }
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                border: "1px solid #e6e6f0",
              }}
              title={m.name}
            >
              <span style={{ marginRight: 6 }}>{m.emoji || "🧘"}</span>
              {m.name}
            </Badge>
          ))}
        </div>

        {/* List */}
        <div>
          {meditations.length ? (
            meditations.map((meditation, index) => (
              <div
                role="button"
                onClick={() => openMedition(meditation)}
                className="meditationDiv px-3"
                key={index}
              >
                <Row className="my-5">
                  <Col className="px-lg-0 paddingTopBefore-lg-2" lg="3">
                    <div
                      className="medObjImg d-inline-block"
                      style={{ backgroundImage: `url(${meditation.image})` }}
                    />
                    <div className="vertical-bottom d-lg-none display-lg-inline mx-3">
                      <h1 className="mt-1 text-capitalize MorganiteFont">
                        {meditation.title}
                      </h1>
                    </div>
                  </Col>
                  <Col className="py-4 px-lg-5" lg="9">
                    <h1 className="mt-3 text-capitalize MorganiteFont display-lg-none">
                      {meditation.title}
                    </h1>
                    <div className="paragraphDim MontserratFont meditation-desc mb-0">
                      <span>
                        {meditation.description
                          ?.replace(/(<style[\w\W]+style>)/g, "")
                          ?.replace(/(<([^>]+)>)/gi, "")
                          ?.replace(/&.*;/g, "")
                          ?.slice(
                            0,
                            window.innerWidth > 500
                              ? meditation.description.length
                              : 80
                          )}
                      </span>
                      <span>
                        {window.innerWidth <= 500 &&
                          meditation.description?.length > 80 && (
                            <span>...</span>
                          )}
                      </span>

                      {/* mood tags */}
                      {Array.isArray(meditation.moods) &&
                        meditation.moods.length > 0 && (
                          <div className="mt-2">
                            {meditation.moods.map((t) => (
                              <Badge
                                key={t}
                                bg="light"
                                text="dark"
                                className="me-1"
                                style={{ border: "1px solid #e6e6f0" }}
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <div className="mt-5 d-flex align-items-center justify-content-center">
              No records found
            </div>
          )}

          {/* Pagination */}
          <div className="pt-5 d-flex align-items-center justify-content-end">
            <Pagination size="sm">
              <i
                role="button"
                onClick={(e) =>
                  currentPage > 1 && handlePageClick(e, currentPage - 1)
                }
                className={
                  (currentPage <= 1 ? "paragraphDim" : "") +
                  " fa fa-angle-left pageIcon"
                }
              />
              {pages()}
              <i
                role="button"
                onClick={clickNext}
                className={
                  (currentPage >= Math.ceil(count / pageSize)
                    ? "paragraphDim"
                    : "") + " fa fa-angle-right pageIcon"
                }
              />
            </Pagination>
          </div>
        </div>
      </Container>

      <MeditationModal
        show={showMedModal}
        handleClose={() => setMedModal(false)}
        meditation={med}
      />
    </div>
  );
};

export default Meditations;
