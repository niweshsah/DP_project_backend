const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // trim: true
  },
  photo: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});


mentorSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
