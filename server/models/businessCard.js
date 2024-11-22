const mongoose = require("mongoose");

const BusinessCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    linkedIn: {
        type: String,
    },
    location: {
        type: String,
    },
    photo: {
        type: String,
    },
    });

const BusinessCard = mongoose.model("BusinessCard", BusinessCardSchema);

module.exports = BusinessCard;

