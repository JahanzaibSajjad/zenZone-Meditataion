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
import { fetchAll, remove } from "services/videoService";
import SpinnerLoader from "components/Misc/Spinner";
import DeleteModal from "components/Modals/deleteModal";
import { videoDeleteMessage } from "shared/constants";
import CompulsoryVideos from "./CompulsoryVideos";
import toast, { Toaster } from "react-hot-toast";
import AddVideo from "./AddVideo";
import { fontClasses } from "shared/constants";

function Videos() {
  const [pageSize, setPageSize] = useState(10);
  const [videos, setVideos] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSpinner, setSpinner] = useState(true);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");

  const [editVideoObj, setEditVideoObj] = useState(undefined);
  const [videoModal, showVideoModal] = useState(false);

  React.useEffect(() => {
    fetchVideos({ skip: 0, take: pageSize });
  }, []);

  const fetchVideos = async (body) => {
    setSpinner(true);
    setVideos([]);
    fetchAll(body)
      .then((data) => {
        setVideos(data.videos);
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
    fetchVideos({ skip: (pageNumber - 1) * pageSize, take: pageSize });
    setPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchVideos({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...(e.target.value.trim() && { search: e.target.value.trim() }),
    });
  };

  const handleDelete = () => {
    setSpinner(true);
    remove(deleteID)
      .then(() => {
        fetchVideos({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
        });
        handleDeleteClose();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteClose = () => {
    setDeleteID("");
    showDeleteModal(!deleteModal);
  };

  const handleModalClose = (reload = false) => {
    reload &&
      fetchVideos({ skip: (currentPage - 1) * pageSize, take: pageSize });
    showVideoModal(!videoModal);
    setEditVideoObj(undefined);
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader name="Videos" />
      <Container className="mt--6" fluid>
        <CompulsoryVideos setSpinner={setSpinner} toast={toast} />
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h3>Biochemical Screen Videos List</h3>
                  <button
                    onClick={() => showVideoModal(true)}
                    className="btn addBtn"
                  >
                    Add New
                  </button>
                </div>
                <hr className="mt-3 mb-4" />
                <div>
                  <h3 className="text-gray d-inline-block mr-4 searchColor">
                    Search:
                  </h3>
                  <Input
                    className="d-inline-block searchBox"
                    placeholder="Search Title"
                    type="text"
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
              </CardHeader>
              <div
                style={{
                  height: (pageSize + 1.5) * 48.5 + "px",
                }}
                className="table-responsive"
              >
                <Table className="dataTable align-items-center">
                  <thead className="thead-bh icon-color-light">
                    <tr>
                      <th className="pl-4 w-5" scope="col">
                        Sr#
                      </th>
                      <th className="pl-4 w-10" scope="col">
                        Title
                      </th>
                      <th className="px-0 w-40" scope="col">
                        Description
                      </th>
                      <th className="px-0 w-40" scope="col">
                        Video URL
                      </th>
                      <th className="px-0 w-5" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {videos.map((video, index) => (
                      <tr key={index}>
                        <td className="pl-4">
                          <div className="d-flex justify-content-start align-items-center">
                            {(currentPage - 1) * pageSize + (index + 1)}
                          </div>
                        </td>
                        <td className="overflowStyle pl-0 pr-4">
                          {video.title}
                        </td>
                        <td className="overflowStyle pl-0 pr-4">
                          {video.description
                            .replace(/(<style[\w\W]+style>)/g, "")
                            .replace(/(<([^>]+)>)/gi, "")
                            .replace(/&.*;/g, "")}
                        </td>
                        <td className="overflowStyle pl-0 pr-4">{video.url}</td>
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
                                  setEditVideoObj(video);
                                  showVideoModal(true);
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
                                  setDeleteID(video._id);
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
                {!showSpinner && !videos.length && (
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
                          fetchVideos({
                            skip: (currentPage - 1) * parseInt(e.target.value),
                            take: parseInt(e.target.value),
                            ...(search.trim() && {
                              search: search.trim(),
                            }),
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
      <DeleteModal
        open={deleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        message={videoDeleteMessage}
        title={"Delete Biochemical Screen Video"}
      />
      <AddVideo
        videoModal={videoModal}
        showVideoModal={showVideoModal}
        videoObj={editVideoObj}
        handleModalClose={handleModalClose}
      />
      <Toaster />
    </>
  );
}

export default Videos;
