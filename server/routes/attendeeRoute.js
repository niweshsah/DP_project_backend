const express = require("express");
const router = express.Router();
const Attendee = require("../models/attendee"); // Import the Attendee model
const Conference = require("../models/conference"); // Import the Conference model
// const multer = require('multer');
const upload = require("../models/attendee").upload; // Import the multer setup from the Attendee model

// Create a new attendee
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, designation, mobile, email, about, secretQRSTring } =
      req.body;

    const photo = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      : null;

    const attendee = new Attendee({
      name,
      designation,
      mobile,
      email,
      about,
      secretQRSTring,
      photo,
    });

    await attendee.save();
    res.status(201).json(attendee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// register attendee for a conference
router.post("/:attendeeId/registerForConference", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    const conferenceId = req.params.conferenceId;
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    if (attendee.conferenceAttendance.has(conferenceId)) {
      return res
        .status(400)
        .json({ error: "Attendee is already registered for the conference" });
    }

    conference.attendees.set(attendee.id, { attended: false });

    attendee.conferenceAttendance.set(conferenceId, { attended: false });

    await attendee.save();
    res.status(200).json(attendee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// mark their attendance at a conference
router.post("/:attendeeId/markConferenceAttendance", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    const conferenceId = req.params.conferenceId;
    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    if (!attendee.conferenceAttendance.has(conferenceId)) {
      // attendee.conferenceAttendance.set(conferenceId, { attended: true });
      return res
        .status(404)
        .json({ error: "Attendee is not registered for the conference" });
    }

    // if attendee is registered for conference
    if (attendee.conferenceAttendance.get(conferenceId).attended) {
      return res
        .status(400)
        .json({ error: "Attendee has already attended the conference" });
    } else {
      attendee.conferenceAttendance.get(conferenceId).attended = true;
      conference.attendees.get(attendee.id).attended = true;
    }

    await attendee.save();
    res.status(200).json(attendee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all attendees
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific attendee by ID
router.get("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an attendee by ID
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const attendee = await Attendee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.status(200).json(attendee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an attendee by ID
router.delete("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.status(200).json({ message: "Attendee deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
