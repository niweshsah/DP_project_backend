const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const dailyEventsSchema = require('./eventCard');
const slidingImages = require('./sliding_images');

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
  ],

  mentors:
  [
    {
      name: {
        type: String, // username
      },
      photo:{
        type: String,
        default: "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"
      },
      profession:{
        type: String,
      },
      lastModified:{
        type: Date,
        default: Date.now,
      },
    }
  ],
  sponsors:
  [
    {
      name: {
        type: String, // username
      },
      photo:{
        type: String,
      },
      lastModified:{
        type: Date,
        default: Date.now,
      },
    }
  ],
  slidingImages:
  [
    {
      name: {
        type: String, // username
      },
      photo:{
        type: String,
      },
      lastModified:{
        type: Date,
        default: Date.now,
      },
    }
  ],
  about: {
    title: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    // required: true,
  },
  helpline:[ {
    name: {
      type: String,
      // required: true,
    },
    number: {
    type: Number,
    }
    // required: true,
  }],
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
