const express = require('express');
const router = express.Router();
const Conference = require('../models/conference');

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
router.post('/conferences', async (req, res) => {
  try {
    const conference = new Conference(req.body);
    await conference.save();
    res.status(201).json(conference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all conferences
router.get('/conferences', async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.status(200).json(conferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific conference by ID
router.get('/conferences/:id', async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id);
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json(conference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a conference by ID
router.put('/conferences/:id', async (req, res) => {
  try {
    const conference = await Conference.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json(conference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a conference by ID
router.delete('/conferences/:id', async (req, res) => {
  try {
    const conference = await Conference.findByIdAndDelete(req.params.id);
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    res.status(200).json({ message: 'Conference deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const AttendeeRoute = require('../routes/attendeeRoute');
router.use('/attendees', AttendeeRoute);

const EventRoute = require('../routes/eventRoute');
router.use('/events', EventRoute);


module.exports = router;
