import React from "react";
import EventsList from "../components/events/EventsList";

const UpcomingEvents = () => {
  return (
    <div className="py-5 bg-color">
    <h1 className="px-4 pt-5 mx-1 mobileHeading boldText pb-3">Upcoming Events</h1>
      <EventsList />
    </div>
  );
};

export default UpcomingEvents;
