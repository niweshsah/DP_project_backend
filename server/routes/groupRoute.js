const express = require("express");
const Group = require("../models/group"); // Adjust the path as necessary
const router = express.Router();

// Create a new group
router.post("/", async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).send(group);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).send(groups);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a group by ID
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }
    res.status(200).send(group);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a group by ID
router.put("/:id", async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }
    res.status(200).send(group);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a group by ID
router.delete("/:id", async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }
    res.status(200).send({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
