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
import { fetchAll, remove } from "services/meditationService";
import * as moment from "moment";
import { useHistory } from "react-router-dom";
import SpinnerLoader from "components/Misc/Spinner";
import DeleteModal from "components/Modals/deleteModal";
import { meditationDeleteMessage } from "shared/constants";
import ReactDatetime from "react-datetime";
import ImageView from "components/Misc/ImageView";
import classnames from "classnames";
import { fontClasses } from "shared/constants";

function MeditationTable() {
  const history = useHistory();
  const [meditations, setMeditations] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSpinner, setSpinner] = useState(true);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [modalImageURL, setImage] = useState(false);
  const [imageModal, showImageModal] = useState(false);

  React.useEffect(() => {
    fetchMeditations({
      skip: 0,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(searchDate && {
        date: moment(searchDate).format("YYYY-MM").toString(),
      }),
    });
  }, []);

  const fetchMeditations = async (body) => {
    setSpinner(true);
    setMeditations([]);
    fetchAll(body)
      .then((data) => {
        setMeditations(data.meditations);
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
    fetchMeditations({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(searchDate && {
        date: moment(searchDate).format("YYYY-MM").toString(),
      }),
    });
    setPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchMeditations({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      search: e.target.value.trim(),
      ...(searchDate && {
        date: moment(searchDate).format("YYYY-MM").toString(),
      }),
    });
  };

  const handleDelete = () => {
    setSpinner(true);
    remove(deleteID)
      .then(() => {
        fetchMeditations({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          ...(search.trim() && {
            search: search.trim(),
          }),
          ...(searchDate && {
            date: moment(searchDate).format("YYYY-MM").toString(),
          }),
        });
        handleDeleteClose();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteClose = () => {
    setDeleteID("");
    showDeleteModal(!deleteModal);
  };

  const onDateChange = (e) => {
    setSearchDate(e);
    fetchMeditations({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(e && {
        date: moment(e).format("YYYY-MM").toString(),
      }),
    });
  };

  const onDateClear = () => {
    if (searchDate !== "") {
      setSearchDate("");
      fetchMeditations({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        ...(search.trim() && {
          search: search.trim(),
        }),
      });
    }
  };

  const onEntriesSelect = (e) => {
    setPageSize(parseInt(e.target.value));
    fetchMeditations({
      skip: (currentPage - 1) * parseInt(e.target.value),
      take: parseInt(e.target.value),
      ...(search.trim() && {
        search: search.trim(),
      }),
      ...(searchDate && {
        date: moment(searchDate).format("YYYY-MM").toString(),
      }),
    });
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name="Meditations" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-content-center justify-content-between">
                  <div>
                    <h3 className="d-inline-block mr-4 searchColor">Search:</h3>
                    <Input
                      className="d-inline-block searchBox"
                      placeholder="Search Title"
                      type="text"
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="search">
                    <ReactDatetime
                      className="d-inline-block"
                      inputProps={{
                        readOnly: true,
                        placeholder: "Search by Month",
                      }}
                      timeFormat={false}
                      dateFormat={"MMMM YYYY"}
                      value={searchDate ? searchDate : ""}
                      onChange={onDateChange}
                      closeOnSelect={true}
                      closeOnClickOutside={true}
                      renderInput={(props) => {
                        return (
                          <input
                            {...props}
                            value={searchDate ? props.value : ""}
                          />
                        );
                      }}
                    />
                    <div role={"button"} onClick={onDateClear}>
                      <i className="fa fa-times clear text-lg"></i>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <div className="table-responsive">
                <Table className="dataTable align-items-center">
                  <thead className="thead-bh icon-color-light">
                    <tr>
                      <th className="pl-4 w-5" scope="col">
                        Sr#
                      </th>
                      <th className="px-0 w-15" scope="col">
                        Title
                      </th>
                      <th className="px-0 w-15" scope="col">
                        Background Image
                      </th>
                      <th className="px-0 w-10" scope="col">
                        Start Date
                      </th>
                      <th className="px-0 w-30" scope="col">
                        Description
                      </th>
                      <th className="px-0 w-20" scope="col">
                        Sound
                      </th>
                      <th className="px-0 w-5" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {meditations.map((meditation, index) => (
                      <tr key={index}>
                        <td className="pl-4">
                          <div className="d-flex justify-content-start align-items-center">
                            {(currentPage - 1) * pageSize + (index + 1)}
                          </div>
                        </td>
                        <td className="default-color overflowStyle pl-0 pr-4">
                          {meditation.title}
                        </td>
                        <td className="px-0">
                          <div>
                            <img
                              className="meditationImageTable"
                              alt="..."
                              src={meditation.image}
                              onClick={() => {
                                setImage(meditation.image);
                                showImageModal(true);
                              }}
                              role={"button"}
                            />
                          </div>
                        </td>
                        <td className="px-0">
                          {moment(meditation.date).format("MM-DD-YYYY")}
                        </td>
                        <td className="overflowStyle pl-0 pr-4">
                          {meditation.description
                            .replace(/(<style[\w\W]+style>)/g, "")
                            .replace(/(<([^>]+)>)/gi, "")
                            .replace(/&.*;/g, "")}
                        </td>
                        <td className="overflowStyle pl-0 pr-4">
                          {meditation.audio
                            ? decodeURI(/[^/]*$/.exec(meditation.audio)[0])
                            : "N/A"}
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
                                  history.push(
                                    `/admin/meditation/${meditation._id}`
                                  );
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-start">
                                  <i className="fa fa-eye mr-3"></i>
                                  <div>View</div>
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  history.push(
                                    `/admin/add-meditation/${meditation._id}`
                                  );
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
                                  setDeleteID(meditation._id);
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
                {!showSpinner && !meditations.length && (
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
                        onChange={onEntriesSelect}
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
      <DeleteModal
        open={deleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        message={meditationDeleteMessage}
        title={"Delete Meditation"}
      />
      <ImageView
        open={imageModal}
        url={modalImageURL}
        handleClose={() => showImageModal(!imageModal)}
      />
    </>
  );
}

export default MeditationTable;
