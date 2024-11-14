const express = require("express");
const router = express.Router();

const Sponsor = require("../models/sponsor");

router.get('/', async (req, res) => {
    try {
        const sponsor = await Sponsor.find();
        res.status(200).json(sponsor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/testing', async (req, res) => {
    try {
        res.status(200).json({ error: "sponsor route is working" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/last-modified', async (req, res) => {
    try {
        const latestsponsor = await Sponsor.findOne().sort({ lastModified: -1 });
        res.status(200).json({ lastModified: latestsponsor?.lastModified });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
  try {
    const sponsor = new Sponsor(req.body);
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
