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
});




router.post(
  "/posting",
  // [
  //     body("name").notEmpty().withMessage("Name is required"),
  //     body("designation").notEmpty().withMessage("Designation is required"),
  //     body("organization").notEmpty().withMessage("Organization is required"),
  //     body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  //     body("email").isEmail().withMessage("Invalid email address"),
  // ],

  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    try {
      const {
        name,
        designation,
        organization,
        mobile,
        email,
        about,
        linkedIn,
        location,
        photo,
      } = req.body;


      if (!name || !designation || !organization || !mobile || !email) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (mobile.length !== 10) {
        return res.status(400).json({
          error: "Invalid mobile number, enter 10 digit mobile number",
        });
      }

      if (email.indexOf("@") === -1) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      if (linkedIn && linkedIn.indexOf("linkedin.com") === -1) {
        return res.status(400).json({ error: "Invalid LinkedIn URL" });
      }

      if (about && about.length > 100) {
        return res
          .status(400)
          .json({ error: "About should be less than 100 characters" });
      }

      const businessCard_email = businessCard.findOne({ email });
      if (businessCard_email) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const businessCard_mobile = businessCard.findOne({ mobile });
      if (businessCard_mobile) {
        return res.status(400).json({ error: "Mobile number already exists" });
      }

      const businessCard_linkedIn = businessCard.findOne({ linkedIn });
      if (businessCard_linkedIn) {
        return res.status(400).json({ error: "LinkedIn URL already exists" });
      }

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
});

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
