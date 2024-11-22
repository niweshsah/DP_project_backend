const express = require("express");
const router = express.Router({ mergeParams: true });

const BusinessCard = require("../models/businessCard");

router.get("/:id", async (req, res) => {
    try {
        const businessCard = await BusinessCard.findById(req.params.id);
        if (!businessCard) {
        return res.status(404).json({ error: "BusinessCard not found" });
        }
        res.status(200).json(businessCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }
);


router.post("/", async (req, res) => {
    try {
        const businessCard = new BusinessCard(req.body);
        await businessCard.save();
        res.status(201).json(businessCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }
);

module.exports = router;