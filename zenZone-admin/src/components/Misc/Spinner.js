import React from "react";
import { Spinner } from "reactstrap";

const SpinnerLoader = ({ showSpinner, adminView }) => {
  return (
    <>
      {showSpinner && (
        <div
          className={
            adminView ? "spinner-container-admin" : "spinner-container"
          }
        >
          <div className={adminView ? "spinner-admin" : "spinner"}>
            <Spinner color="white" />
          </div>
        </div>
      )}
    </>
  );
};

export default SpinnerLoader;
