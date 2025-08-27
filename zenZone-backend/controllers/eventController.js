const eventService = require("../services/eventService");

const getOneEvent = async (req, res) => {
  eventService
    .getOneEvent({
      _id: req.params.id,
    })
    .then((event) => res.status(200).send(event ? event : "Event not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllEvents = async (req, res) => {
  eventService
    .getAllEvents(req.body)
    .then((events) => res.status(200).send(events))
    .catch((err) => res.status(500).send(err));
};

const getAllEventsNonPaged = async (req, res) => {
  eventService
    .getAllEventsNonPaged()
    .then((events) => res.status(200).send(events))
    .catch((err) => res.status(500).send(err));
};

const updateEvent = async (req, res) => {
  eventService
    .updateEvent(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(500).send(err));
};

const deleteEvent = async (req, res) => {
  eventService
    .deleteEvent({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Event is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addEvent = async (req, res) => {
  eventService
    .addEvent(req.body)
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneEvent,
  updateEvent,
  deleteEvent,
  addEvent,
  getAllEvents,
  getAllEventsNonPaged,
};
