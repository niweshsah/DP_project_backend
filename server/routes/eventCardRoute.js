const express = require("express");
const router = express.Router();

const EventCard = require("../models/eventCard");

router.get('/', async (req, res) => {
    try {
        const eventCard = await EventCard.find();
        res.status(200).json(eventCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/testing', async (req, res) => {
    try {
        res.status(200).json({ error: "eventCard route is working" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/date', async (req, res) => {
    try {
        const givenDate = req.query.date;

        if (!givenDate) {
            return res.status(400).json({ error: "Date parameter is required" });
        }

        // Convert givenDate to start and end of the day for accurate filtering
        const startOfDay = new Date(givenDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(givenDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find events within the specified date range
        const events = await EventCard.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        res.status(200).json({'ans': events, 'givenDate': givenDate, 'startOfDay': startOfDay, 'endOfDay': endOfDay});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/last-modified', async (req, res) => {
    try {
        const latesteventCard = await EventCard.findOne().sort({ lastModified: -1 });
        res.status(200).json({ lastModified: latesteventCard?.lastModified });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
  try {
    const eventCard = new EventCard(req.body);
    await eventCard.save();
    res.status(201).json(eventCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
