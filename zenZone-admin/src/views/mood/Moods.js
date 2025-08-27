import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Input,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { fetchAll, remove } from "services/moodService";
import AddMood from "./AddMood";
import DeleteModal from "components/Modals/deleteModal";
import { moodDeleteMessage } from "shared/constants";
import SpinnerLoader from "components/Misc/Spinner";
import Select2 from "react-select2-wrapper";
import { fetchAllNonPaged } from "services/sheetService";

function MoodsTable() {
  const [pageSize, setPageSize] = useState(10);
  const [moods, setMoods] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [moodModal, showMoodModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [editMoodObj, setEditMoodObj] = useState(undefined);
  const [search, setSearch] = useState("");
  const [showSpinner, setSpinner] = useState(true);
  const [sheets, setSheets] = useState([]);
  const [sheetSearch, setSheetSearch] = useState("");

  React.useEffect(() => {
    fetchMoods({
      skip: 0,
      take: pageSize,
      ...(search.trim() && { search: search.trim() }),
      ...(sheetSearch && { sheet: sheetSearch }),
    });
    fetchSheets();
  }, []);

  const fetchMoods = async (body) => {
    setSpinner(true);
    setMoods([]);
    fetchAll(body)
      .then((data) => {
        setMoods(data.moods);
        setCount(data.count);
        setSpinner(false);
      })
      .catch((err) => console.log(err));
  };

  const pages = () => {
    let pagesArr = [];
    for (let i = 1; i <= Math.ceil(count / pageSize); i++) {
      pagesArr.push(
        <PaginationItem className={currentPage === i ? "active" : ""}>
          <PaginationLink onClick={(e) => handlePageClick(e, i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pagesArr;
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    fetchMoods({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && { search: search.trim() }),
      ...(sheetSearch && { sheet: sheetSearch }),
    });
    setPage(pageNumber);
  };

  const handleModalClose = () => {
    fetchMoods({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && { search: search.trim() }),
      ...(sheetSearch && { sheet: sheetSearch }),
    });
    showMoodModal(!moodModal);
    setEditMoodObj(undefined);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchMoods({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      search: e.target.value.trim(),
      ...(sheetSearch && { sheet: sheetSearch }),
    });
  };

  const handleDelete = () => {
    setSpinner(true);
    remove(deleteID)
      .then(() => {
        fetchMoods({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          ...(search.trim() && { search: search.trim() }),
          ...(sheetSearch && { sheet: sheetSearch }),
        });
        handleDeleteClose();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteClose = () => {
    setDeleteID("");
    showDeleteModal(!deleteModal);
  };

  const fetchSheets = async () => {
    fetchAllNonPaged()
      .then((data) => {
        setSheets(data);
      })
      .catch((err) => console.log(err));
  };

  const filterMoods = (event) => {
    setSheetSearch(event.params.data.id);
    fetchMoods({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && { search: search.trim() }),
      sheet: event.params.data.id,
    });
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader
        name="Moods"
        updateList={() =>
          fetchMoods({
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
            ...(search.trim() && { search: search.trim() }),
            ...(sheetSearch && { sheet: sheetSearch }),
          })
        }
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-content-center justify-content-between">
                  <div>
                    <h3 className="d-inline-block mr-4 searchColor">Search: </h3>
                    <Input
                      className="d-inline-block searchBox"
                      placeholder="Search Title"
                      type="text"
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="search w-15">
                    <Select2
                      value={sheetSearch}
                      className="form-control"
                      onSelect={filterMoods}
                      defaultValue="1"
                      options={{
                        placeholder: "Filter by Sheet",
                      }}
                      data={
                        sheets
                          ? sheets.map((sheet) => ({
                              text: sheet.title,
                              id: sheet._id,
                            }))
                          : []
                      }
                    />
                    <i
                      role={"button"}
                      onClick={() => {
                        if (sheetSearch !== "") {
                          setSheetSearch("");
                          fetchMoods({
                            skip: (currentPage - 1) * pageSize,
                            take: pageSize,
                            ...(search.trim() && { search: search.trim() }),
                          });
                        }
                      }}
                      className="fa fa-times clear text-lg"
                    ></i>
                  </div>
                </div>
              </CardHeader>
              <div className="table-responsive">
                <Table className="dataTable align-items-center">
                  <thead className="thead-bh icon-color-light">
                    <tr>
                      <th className="px-4 w-5" scope="col">
                        Sr#
                      </th>
                      <th className="px-0 w-45" scope="col">
                        Description
                      </th>
                      <th className="px-0 w-45" scope="col">
                        Sheet
                      </th>
                      <th className="px-0 w-5" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {moods.map((mood, index) => (
                      <tr key={index}>
                        <td className="pl-4">
                          <div className="d-flex justify-content-start align-items-center">
                            {(currentPage - 1) * pageSize + (index + 1)}
                          </div>
                        </td>
                        <td className="default-color overflowStyle pl-0 pr-4">
                          {mood.title}
                        </td>
                        <td className="pl-0 pr-4 overflowStyle">
                          {mood.sheet ? mood.sheet.title : "N/A"}
                        </td>
                        <td className="actionDropdown px-0">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light action-bg"
                              color=""
                              role="button"
                              size="sm"
                            >
                              <i className="fas fa-ellipsis-h icon-color" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditMoodObj(mood);
                                  showMoodModal(true);
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-start">
                                  <i className="fa fa-pencil-alt mr-3"></i>
                                  <div>Edit</div>
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  showDeleteModal(true);
                                  setDeleteID(mood._id);
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-start">
                                  <i className="fa fa-times mr-3"></i>
                                  <div>Delete</div>
                                </div>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                    <tr></tr>
                  </tbody>
                </Table>
                {!showSpinner && !moods.length && (
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    No records found
                  </div>
                )}
              </div>
              <CardFooter className="py-4">
                <nav
                  className="d-flex align-items-center justify-content-between"
                  aria-label="..."
                >
                  <div className="pageEntry">
                    <small>
                      Show
                      <select
                        defaultValue={10}
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value));
                          fetchMoods({
                            skip: (currentPage - 1) * parseInt(e.target.value),
                            take: parseInt(e.target.value),
                            ...(search.trim() && {
                              search: search.trim(),
                            }),
                            ...(sheetSearch && { sheet: sheetSearch }),
                          });
                        }}
                        className="pl-1 pr-3 ml-1"
                      >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                      <i className="fa fa-sort text-xxs"></i>
                      <span className="ml-2">entires</span>
                    </small>
                  </div>
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem
                      className={currentPage === 1 ? "disabled" : ""}
                    >
                      <PaginationLink
                        onClick={(e) => handlePageClick(e, currentPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    {pages().map((page, index) => (
                      <div key={index}>{page}</div>
                    ))}
                    <PaginationItem
                      className={
                        currentPage >= Math.ceil(count / pageSize)
                          ? "disabled"
                          : ""
                      }
                    >
                      <PaginationLink
                        onClick={(e) => handlePageClick(e, currentPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
      <AddMood
        moodModal={moodModal}
        showMoodModal={showMoodModal}
        moodObj={editMoodObj}
        handleModalClose={handleModalClose}
      />
      <DeleteModal
        open={deleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        message={moodDeleteMessage}
        title={"Delete Mood"}
      />
    </>
  );
}

export default MoodsTable;
