const express = require("express");
const router = express.Router();

const FoodOptions = require("../models/foodOptions");

router.get('/', async (req, res) => {
    try {
        const foodOptions = await FoodOptions.find();
        res.status(200).json(foodOptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/testing', async (req, res) => {
    try {
        res.status(200).json({ error: "foodOptions route is working" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/last-modified', async (req, res) => {
    try {
        const latestfoodOptions = await FoodOptions.findOne().sort({ lastModified: -1 });
        res.status(200).json({ lastModified: latestfoodOptions?.lastModified });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
  try {
    const foodOptions = new FoodOptions(req.body);
    await foodOptions.save();
    res.status(201).json(foodOptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
