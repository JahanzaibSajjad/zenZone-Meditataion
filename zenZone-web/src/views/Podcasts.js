import React from "react";
import TopNav from "../components/common/Navbar";
import PodcastsList from "../components/podcasts/PodcastsList";

const Podcasts = () => {
  return (
    <div className="bg-shine bg-shine-large">
      <TopNav />
      <div className="pt-5">
        <div className="position-relative">
          <PodcastsList />
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
