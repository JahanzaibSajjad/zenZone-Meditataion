const EventModel = require("../models/Event");
const moment = require("moment");

const getOneEvent = async (condition) => {
  return new Promise((resolve, reject) => {
    EventModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllEvents = async (body) => {
  return new Promise((resolve, reject) => {
    EventModel.find({
      ...(body.search && {
        $or: [
          { title: { $regex: body.search, $options: "i" } },
          { location: { $regex: body.search, $options: "i" } },
        ],
      }),
      ...(body.date && {
        date: {
          $gte: new Date(body.date),
          $lt: moment(new Date(body.date)).add(1, "days").toDate(),
        },
      }),
      ...(!body.date && body.filter && body.filter === "past"
        ? {
            date: {
              $lt: moment().utc().toDate(),
            },
          }
        : body.filter === "upcoming" && {
            date: {
              $gte: moment().utc().toDate(),
            },
          }),
    })
      .sort({ date: "desc" })
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((events) => {
        EventModel.count({
          ...(body.search && {
            $or: [
              { title: { $regex: body.search, $options: "i" } },
              { location: { $regex: body.search, $options: "i" } },
            ],
          }),
          ...(body.date && {
            date: {
              $gte: new Date(body.date),
              $lt: moment(new Date(body.date)).add(1, "days").toDate(),
            },
          }),
          ...(!body.date && body.filter && body.filter === "past"
            ? {
                date: {
                  $lt: moment().utc().toDate(),
                },
              }
            : body.filter === "upcoming" && {
                date: {
                  $gte: moment().utc().toDate(),
                },
              }),
        })
          .then((count) => {
            resolve({ count, events });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllEventsNonPaged = async () => {
  return new Promise((resolve, reject) => {
    EventModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateEvent = async (condition, data) => {
  return new Promise((resolve, reject) => {
    EventModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteEvent = async (condition) => {
  return new Promise((resolve, reject) => {
    EventModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addEvent = async (data) => {
  return new Promise((resolve, reject) => {
    new EventModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneEvent,
  updateEvent,
  deleteEvent,
  addEvent,
  getAllEvents,
  getAllEventsNonPaged,
};
