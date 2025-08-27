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
import { fetchAll, remove } from "services/websiteService";
import SpinnerLoader from "components/Misc/Spinner";
import DeleteModal from "components/Modals/deleteModal";
import { websiteDeleteMessage } from "shared/constants";
import AddWebsite from "./AddWebsite";

function Websites() {
  const [pageSize, setPageSize] = useState(10);
  const [websites, setWebsites] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSpinner, setSpinner] = useState(true);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");

  const [editWebsiteObj, setEditWebsiteObj] = useState(undefined);
  const [websiteModal, showWebsiteModal] = useState(false);

  React.useEffect(() => {
    fetchWebsites({ skip: 0, take: pageSize });
  }, []);

  const fetchWebsites = async (body) => {
    setSpinner(true);
    setWebsites([]);
    fetchAll(body)
      .then((data) => {
        setWebsites(data.websites);
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
    fetchWebsites({ skip: (pageNumber - 1) * pageSize, take: pageSize });
    setPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchWebsites({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...(e.target.value.trim() && { search: e.target.value.trim() }),
    });
  };

  const handleDelete = () => {
    setSpinner(true);
    remove(deleteID)
      .then(() => {
        fetchWebsites({
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
      fetchWebsites({ skip: (currentPage - 1) * pageSize, take: pageSize });
    showWebsiteModal(!websiteModal);
    setEditWebsiteObj(undefined);
  };

  return (
    <>
      <SpinnerLoader showSpinner={showSpinner} />
      <SimpleHeader
        name="Websites"
        updateList={() =>
          fetchWebsites({ skip: (currentPage - 1) * pageSize, take: pageSize })
        }
      />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <h3 className="d-inline-block mr-4 searchColor">Search: </h3>
                <Input
                  className="d-inline-block searchBox"
                  placeholder="Search Title"
                  type="text"
                  value={search}
                  onChange={handleSearch}
                />
              </CardHeader>
              <div className="table-responsive">
                <Table className="dataTable align-items-center">
                  <thead className="thead-bh icon-color-light">
                    <tr>
                      <th className="pl-4 w-10" scope="col">
                        Sr#
                      </th>
                      <th className="px-0 w-40" scope="col">
                        Title
                      </th>
                      <th className="px-0 w-45" scope="col">
                        URL
                      </th>
                      <th className="px-0 w-5" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {websites.map((website, index) => (
                      <tr key={index}>
                        <td className="pl-4">
                          <div className="d-flex justify-content-start align-items-center">
                            {(currentPage - 1) * pageSize + (index + 1)}
                          </div>
                        </td>
                        <td className="default-color overflowStyle pl-0 pr-4">
                          {website.title}
                        </td>
                        <td className="overflowStyle pl-0 pr-4">
                          <a
                            role={"button"}
                            className="tableURL"
                            href={website.url}
                            target={"_blank"}
                          >
                            {website.url}
                          </a>
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
                                  setEditWebsiteObj(website);
                                  showWebsiteModal(true);
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
                                  setDeleteID(website._id);
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
                {!showSpinner && !websites.length && (
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
                          fetchWebsites({
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
        message={websiteDeleteMessage}
        title={"Delete Website"}
      />
      <AddWebsite
        websiteModal={websiteModal}
        showWebsiteModal={showWebsiteModal}
        websiteObj={editWebsiteObj}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default Websites;
