import React from "react";
import Meditations from "../components/meditation/Meditations";

const PastMeditations = () => {
  return (
    <div className="pb-3 bg-color">
    <h1 className="px-4 pt-5 mx-1 mobileHeading boldText pb-3">Past Meditations</h1>
      <Meditations />
    </div>
  );
};

export default PastMeditations;
