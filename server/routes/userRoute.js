const express = require('express');
const router = express.Router({ mergeParams: true }); // Important to merge params from the parent route
// const Conference = require('../models/conference');


const conferenceRoutes = require('./conferenceRoute'); // Import the conference route
router.use('/conference', conferenceRoutes); // use the conferenceRoutes



module.exports = router; // Export the router