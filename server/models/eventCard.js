const mongoose = require("mongoose");

const eventCardchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  lastModified: { // Optional field to store the last modification date
    type: Date,
    default: Date.now,
  }
});

EventCard = mongoose.model("EventCard", eventCardchema);
module.exports = EventCard;
