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

router.get("/testing", async (req, res) => {
  try {
    res.status(200).send({ error: "Group route is working" });
  } catch (error) {
    res.status(500).send({ error: error.message });
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

router.get("/groupList", async (req, res) => {
  try {
    const groups = await Group.find();
    const groupsList = [];
    groups.forEach((group) => {
      groupsList.push({
        Group_number: group.Group_number,
        project_name: group.project_name,
      });
    });

    res.status(200).send(groupsList);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a group by ID
router.get("/:groupNumber", async (req, res) => {
  try {
    const group = await Group.findOne({ groupNumber: req.params.groupNumber });

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }
    res.status(200).send(group);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a group by ID
router.put("/:groupNumber", async (req, res) => {
  try {
    // const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const group = await Group.findOneAndUpdate(
      { groupNumber: req.params.groupNumber },
      req.body,
      { new: true, runValidators: true }
    );

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

router.put("/:Group_number/like-count-increase", async (req, res) => {
  try {
    const group = await Group.findOne({ Group_number: req.params.Group_number });
    // console.log({"GroupNo":req.params.Group_number});


    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }
    // console.log(group.likes);
    console.log({"likeCount1":group.likes});

    group.likes += 1;
    // console.log(group.likes);
    console.log({"likeCount2":group.likes});


    await group.save();
    res.status(200).send(group);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/:Group_number/like-count-decrease", async (req, res) => {
  try {
    const group = await Group.findOne({ Group_number: req.params.Group_number });
    console.log(Group_number);

    if (!group) { 
      return res.status(404).send({ error: "Group not found" });
    }

    group.likes -= 1;
    await group.save();
    res.status(200).send(group);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
