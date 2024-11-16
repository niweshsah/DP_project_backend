const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const dailyEventsSchema = require('./eventCard');

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
  type: Map,
  of: [
    {
      title: String,
      time: String,
      venue: String,
      // date: String
    }
  ],
  default: {}
},
  // attendees: {
  //   type: Map,
  //   of: new Schema({
  //     attended: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   }),
  // },

  
  attendeesFalse:[
    {
      username: {
        type: String, // username
      },
      name:{
        type: String,
      },
      email:{
        type: String,
      },
    }
  ],

  attendeesTrue:[
    {
      username: {
        type: String, // username
      },
      name:{
        type: String,
      },
      email:{
        type: String,
      },
    }
  ],

  food: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      startTime: {
        type: Date,
        // required: true,
      },
      expiryTime: {
        type: Date,
        // required: true,
      },
    },
  ]
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
