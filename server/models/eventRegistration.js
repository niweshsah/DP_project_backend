const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EventRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // trim: true
  },
  eventCode: {
    type: String,
    required: false,
    unique: true,
    // lowercase: true,
    trim: true,
    // deafult:
  },
  Venue: {
    type: String,
    // required: true,
    // unique: true,
    // trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  linkedIn: {
    type: String,
    required: false,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});


EventRegistrationSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(5);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

EventRegistrationSchema.methods.comparePassword = async function (candidatePassword) {
  // return await bcrypt.compare(candidatePassword, this.password);
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};


const EventRegistration = mongoose.model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistration;
