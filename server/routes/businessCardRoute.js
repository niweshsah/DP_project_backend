const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const BusinessCard = require("../models/businessCard");

router.get("/getInfo/:id", async (req, res) => {
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




router.post(
    "/posting",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("designation").notEmpty().withMessage("Designation is required"),
        body("organization").notEmpty().withMessage("Organization is required"),
        body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
        body("email").isEmail().withMessage("Invalid email address"),
    ],
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const businessCard = new BusinessCard(req.body);
            await businessCard.save();
            res.status(201).json(businessCard);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

router.get("/", async (req, res) => {
    try {
        const businessCards = await BusinessCard.find();
        res.status(200).json(businessCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }
);

// router.get("/test", async (req, res) => {
//     try {
//         res.status(200).json({ message: "BusinessCard test route" });
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
//     }
// );


module.exports = router;