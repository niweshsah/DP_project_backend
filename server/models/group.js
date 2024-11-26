const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({

  Group_number: {
    type: Number,
    required: true,
  },


  likes: {
    type: Number,
    default: 0,
  },


  Description: String,


  Faculty: [
    {
      type: String,
    },
  ],

  

  image: [
    {
      type: String,
    },
  ],


  members: [
    {
      name: {
        type: String,
      },
      roll_no: {
        type: String,
      },
      contribution: {
        type: String,
      },
    },
  ],


});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
