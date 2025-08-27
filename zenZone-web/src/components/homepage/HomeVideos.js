import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { getHomeVideos } from "../../services/APIsService";
import HomeVideo from "./HomeVideo";

const HomeVideos = () => {
  const intoRef = useRef();
  const featuredRef = useRef();

  const [isHovered, setHover] = useState({ intro: false, featured: false });
  const [videos, setVideos] = useState({ home_1: {}, home_2: {} });

  if (
    isHovered.intro &&
    intoRef.current &&
    intoRef.current.matches(":hover") === false
  ) {
    setHover({ ...isHovered, ...{ intro: false } });
  }

  if (
    isHovered.featured &&
    featuredRef.current &&
    featuredRef.current.matches(":hover") === false
  ) {
    setHover({ ...isHovered, ...{ featured: false } });
  }

  useEffect(() => {
    getHomeVideos().then((data) => setVideos(data));
  }, []);

  return (
    <>
      <Container className="homeVidsContainer">
          <div
            ref={intoRef}
            onMouseEnter={() => setHover({ ...isHovered, ...{ intro: true } })}
            onMouseLeave={() => setHover({ ...isHovered, ...{ intro: false } })}
            className="videoDiv"
          >
            <HomeVideo
              video={{
                ...videos.home_1,
                ...{ number: 1 },
                ...{ title: "INTRODUCTION VIDEO" },
                ...{ heading: "INTODUCTION" },
              }}
              isHovered={isHovered.intro}
            />
          </div>
          <div
            ref={featuredRef}
            onMouseEnter={() =>
              setHover({ ...isHovered, ...{ featured: true } })
            }
            onMouseLeave={() =>
              setHover({ ...isHovered, ...{ featured: false } })
            }
            className="videoDiv"
          >
            <HomeVideo
              video={{
                ...videos.home_2,
                ...{ number: 2 },
                ...{ title: "FEATURED VIDEO" },
                ...{ heading: "FEATURED" },
              }}
              isHovered={isHovered.featured}
            />
          </div>
      </Container>
    </>
  );
};

export default HomeVideos;
