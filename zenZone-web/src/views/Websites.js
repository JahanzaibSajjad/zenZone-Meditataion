import React from "react";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";
import WebsitesList from "../components/websites/WebsitesList";

const Websites = () => {
  return (
    <div className="bg-shine bg-shine-large">
      <TopNav />
      <div className="py-5">
        <WebsitesList />
      </div>
      <Footer />
    </div>
  );
};

export default Websites;
