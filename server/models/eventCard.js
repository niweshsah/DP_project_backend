const mongoose = require('mongoose');

const eventCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  }
});

// const dailyEventsSchema = new mongoose.Schema({
//   date: {
//     type: Date, // Use 'YYYY-MM-DD' format for consistency
//     required: true
//   },
//   events: [eventCardSchema]
// });

module.exports = mongoose.model('EventCard', eventCardSchema);

// module.exports = mongoose.model('DailyEvents', dailyEventsSchema);
