const express = require("express");
const router = express.Router();

const SlidingImages = require("../models/slidingImages");

router.get("/", async (req, res) => {
  try {
    const slidingImages = await SlidingImages.find();
    res.status(200).json(slidingImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/testing", async (req, res) => {
  try {
    res.status(200).json({ error: "slidingImages route is working" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/last-modified", async (req, res) => {
  try {
    const latestslidingImages = await SlidingImages.findOne().sort({
      lastModified: -1,
    });
    res.status(200).json({ lastModified: latestslidingImages?.lastModified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const slidingImages = new SlidingImages(req.body);
    await slidingImages.save();
    res.status(201).json(slidingImages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;