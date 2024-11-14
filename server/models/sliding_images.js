const mongoose = require("mongoose");

const slidingImagesSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});


slidingImagesSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

const slidingImages = mongoose.model("slidingImages", slidingImagesSchema);
module.exports = slidingImages;
