const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");


const ConferenceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    // required: true,
  },
  conferenceCode:
  {
    type: String,
    required: true,
    unique : true,
  },
  password: {
    type: String,
    required: true,
    minlength : 6,  
  },
  endDate: {
    type: Date,
    // required: true,

  },
  location: {
    type: String,
    required: true,
    default: "IIT Mandi",
  },
  events: {
    type: [Schema.Types.ObjectId],  // References to event objects
    ref: 'Event',
    default: [],
  },
  attendees: {
    type: Map,
    of: new Schema({
      attended: {
        type: Boolean,
        default: false,
      },
    }),
  },
});

ConferenceSchema.pre("save", async function (next) {
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

ConferenceSchema.methods.comparePassword = async function (candidatePassword) {
  // return await bcrypt.compare(candidatePassword, this.password);
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model('Conference', ConferenceSchema);
