const express = require('express');
const router = express.Router();
const Conference = require('../models/conference');
const Mentor = require('../models/mentor');
// const EventCardRoute = require('../routes/eventCardRoute');


// get all conferences
router.get('/', async (req, res) => {
    try {
        const conferences = await Conference.find();
        res.status(200).json(conferences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Create a new conference
router.post('/', async (req, res) => {
  try {
    const conference = new Conference(req.body);
    await conference.save();
    res.status(201).json(conference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Get a specific conference by conferenceId
router.get('/:conferenceId', async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.conferenceId);
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json(conference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Update a conference by conferenceId
router.put('/:conferenceId', async (req, res) => {
  try {
    const conference = await Conference.findByIdAndUpdate(req.params.conferenceId, req.body, { new: true, runValconferenceIdators: true });
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json(conference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a conference by conferenceId
router.delete('/:conferenceId', async (req, res) => {
  try {
    const conference = await Conference.findByIdAndDelete(req.params.conferenceId);
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json({ message: 'Conference deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});













router.post("/createNewConference", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data
    passwordLength = data.password.length;

    if (passwordLength < 6) {
      return res.status(400).json({ error: "Password length should be greater than 6" });
    }
    // Create a new Person document using the Mongoose model
    const newConference = new Conference(data);

    // Save the new person to the database
    const response = await newConference.save();


    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error in craeting account" });
  }
});




router.post("/checkConferenceCode", async (req, res) => {
  try {
    const { conferenceCode } = req.body;

    // Find the user by conferenceCode
    const conference = await Conference.findOne({ conferenceCode: conferenceCode });

    // If user does not exist or password does not match, return error
    if (conference) {
      return res.status(401).json({ error: "conferenceCode is already taken", conference:conference });
    }
    return res.status(200).json({ message: "conferenceCode is available" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract conferenceCode and password from request body
    const { conferenceCode, password } = req.body;

    // const payload = {
    //   password: response.password,
    //   conferenceCode: response.conferenceCode,
    // };

    // // console.log(JSON.stringify(payload));
    // const token = generateToken(payload);

    // Find the user by conferenceCode
    const conference = await Conference.findOne({ conferenceCode: conferenceCode });

    // If user does not exist or password does not match, return error
    if (!conference) {
      return res.status(401).json({ error: "Invalid conferenceCode" });
    }
    if (!(await conference.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // console.log({ conference: conference });

    // // generate Token
    // const payload = {
    //   name: conference.name,
    //   email: conference.email,
    //   conferenceCode: conference.conferenceCode,
    //   linkedIn: conference.linkedIn,
    // };
    
    
    // const token = generateToken(payload);

    // // resturn token as response
    // res.json({ token : token });
    return res.status(200).json(conferenceCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/:conferenceCode/checkConferenceCode", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode: conferenceCode });
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }
    res.status(200).json({ message: "Conference found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);





















const AttendeeRoute = require('../routes/attendeeRoute');
router.use('/:conferenceId/attendees', AttendeeRoute);

const EventRoute = require('../routes/eventRoute');
router.use('/:conferenceId/events', EventRoute);

const MentorRoute = require('../routes/mentorRoute');
router.use('/:conferenceId/mentors', MentorRoute);

const SponsorRoute = require('../routes/sponsorRoute');
router.use('/:conferenceId/sponsors', SponsorRoute);


const SlidingImagesRoute = require('../routes/slidingImagesRoute');
router.use('/:conferenceId/SlidingImages', SlidingImagesRoute);


const EventCardRoute = require('../routes/eventCardRoute');
router.use('/:conferenceCode/eventCard', EventCardRoute);


// const EmailRouter = require("../utils/sendEmail");
// router.use("/emailsending", EmailRouter);


module.exports = router;
