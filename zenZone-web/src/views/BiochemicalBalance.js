import React, { useEffect } from "react";
import BiochemicalIntro from "../components/biochemical/BiochemicalIntro";
import BiochemicalVideos from "../components/biochemical/BiochemicalVideos";
import Footer from "../components/common/Footer";
import TopNav from "../components/common/Navbar";

const BiochemicalBalance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-shine bg-shine-biochem">
        <TopNav />
        <div className="py-5">
          <BiochemicalIntro />
        </div>
      </div>
      <div className="bg-shine-biochem-vid py-5">
        <BiochemicalVideos />
      </div>
      <Footer colored />
    </>
  );
};

export default BiochemicalBalance;
