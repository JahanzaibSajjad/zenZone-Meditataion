import React from "react";
import { useParams } from "react-router-dom";

const Sheet = () => {
  const { name } = useParams();
  const src = `/${name}.pdf`;
  return (
    <>
      <iframe src={src} width="100%" height="800px" title="sheet"></iframe>
    </>
  );
};

export default Sheet;
