const express = require("express");
const router = express.Router();

const Mentor = require("../models/mentor");

router.get('/', async (req, res) => {
    try {
        const mentor = await Mentor.find();
        res.status(200).json(mentor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/testing', async (req, res) => {
    try {
        res.status(200).json({ error: "mentor route is working" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/last-modified', async (req, res) => {
    try {
        const latestMentor = await Mentor.findOne().sort({ lastModified: -1 });
        res.status(200).json({ lastModified: latestMentor?.lastModified });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
