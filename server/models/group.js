const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  Group_number: {
    type: Number,
    required: true,
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
  // date: String
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
