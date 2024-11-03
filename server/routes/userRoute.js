const express = require("express");
const router = express.Router({ mergeParams: true }); // Important to merge params from the parent route
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../utils/jwt");
// const Conference = require('../models/conference');

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data

    // Create a new Person document using the Mongoose model
    const newUser = new User(data);

    // Save the new person to the database
    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });

    // If user does not exist or password does not match, return error
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // generate Token
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    // resturn token as response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const tokenData = req.jwtToken;
    console.log("User Data: ", tokenData);

    const userId = tokenData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/userTesting", async (req, res) => {
    try {
        // const users = await User.find();
        res.status(200).json( {error: "testing"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

const conferenceRoutes = require("./conferenceRoute"); // Import the conference route
router.use("/conference", conferenceRoutes); // use the conferenceRoutes
// Add jwt middleware to the route

module.exports = router; // Export the router
