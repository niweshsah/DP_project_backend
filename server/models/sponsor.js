const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // trim: true
  },
  photo: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

sponsorSchema.pre("save", function (next) {
  this.lastModified = Date.now();
  next();
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
module.exports = Sponsor;
