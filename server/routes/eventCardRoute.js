const express = require("express");
const router = express.Router({ mergeParams: true });
// To merge the params from the parent route

const EventCard = require("../models/eventCard");

const Conference = require("../models/conference");

router.get("/test", async (req, res) => {
  try {
    // const events = await EventCard.find();
    res.status(200).json({ test: req.params.conferenceCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addNewEvent", async (req, res) => {
  try {
    //   const
    const { date, title, time, venue, eventCode, attendeesTrueForEvent } =
      req.body;
    const conferenceCode = req.params.conferenceCode;
    const conference = await Conference.findOne({ conferenceCode });
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    if (conference.events.has(date)) {
      conference.events
        .get(date)
        .push({ title, time, venue, eventCode, attendeesTrueForEvent });
    } else {
      conference.events.set(date, [
        { title, time, venue, eventCode, attendeesTrueForEvent },
      ]);
    }
    //   attendee.foodCouponUsed.set(conferenceId, {}); // give food coupon on registration and set the value of the key to an empty object as default values are already set in the model

    //   attendee.conferenceAttendance.set(conferenceId, { attended: false });

    await conference.save();

    //   await attendee.save();

    return res.status(200).json(conference);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to delete events from a conference on a specific date
router.delete("/:date", async (req, res) => {
  const { conferenceCode, date } = req.params; // Access conferenceCode and date from URL params
  const eventTitlesToDelete = req.body.eventTitles; // Expects an array of event titles to delete

  if (!Array.isArray(eventTitlesToDelete)) {
    return res
      .status(400)
      .json({ message: "eventTitles should be an array of event titles." });
  }

  try {
    // Find the conference by conferenceCode
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ message: "Conference not found." });
    }

    // Check if events exist for the given date
    if (!conference.events[date]) {
      return res
        .status(404)
        .json({ message: `No events found for the date ${date}.` });
    }

    // Filter out the events that need to be deleted
    conference.events[date] = conference.events[date].filter(
      (event) => !eventTitlesToDelete.includes(event.title)
    );

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      message: "Events deleted successfully.",
      updatedEvents: conference.events[date],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
});

router.get("/events", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.events);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// Add food item to a conference
router.post("/food", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name, description, startTime, expiryTime } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    // If startTime and expiryTime are provided, validate them
    if (startTime && expiryTime) {
      if (new Date(expiryTime) <= new Date(startTime)) {
        return res.status(400).json({
          success: false,
          message: "Expiry time must be after start time",
        });
      }
    }

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.food.push({
      name,
      description,
      startTime: startTime ? new Date(startTime) : undefined,
      expiryTime: expiryTime ? new Date(expiryTime) : undefined,
    });

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Food item added successfully",
      data: conference.food[conference.food.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding food item",
      error: error.message,
    });
  }
});

// Delete food item from a conference
router.delete("/food/:foodName", async (req, res) => {
  try {
    const { conferenceCode, foodName } = req.params;

    // Find the conference
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Find the food item index
    const foodIndex = conference.food.findIndex(
      (item) => item.name === foodName
    );

    if (foodIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Remove the food item
    conference.food.splice(foodIndex, 1);
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting food item",
      error: error.message,
    });
  }
});

// Get all food items for a conference
router.get("/food", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.food);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching food items",
      error: error.message,
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------

// GET route to fetch attendeesFalse
router.get("/attendees-false", async (req, res) => {
  try {
    const { conferenceCode } = req.params;

    // Find the conference by its conferenceCode
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }payload

    const attendeesFalse = conference.attendeesFalse || [];
    const count = attendeesFalse.length;

    // Return the attendeesFalse list and count
    return res.status(200).json({ count: count, attendees: attendeesFalse });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/total-attendees", async (req, res) => {
  try {
    const { conferenceCode } = req.params;

    // Find the conference by its conferenceCode
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    const TotalAttendee = conference.totalAttendee || [];
    const count = TotalAttendee.length;

    // Return the attendeesFalse list and count
    return res.status(200).json({ count: count, attendees: TotalAttendee });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});



router.get("/attendees-true", async (req, res) => {
  try {
    const { conferenceCode } = req.params;

    // Find the conference bypayload its conferenceCode
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    const attendeesTrue = conference.attendeesTrue || [];
    const count = attendeesTrue.length;

    // Return the attendeesFalse list and count
    return res.status(200).json({ count: count, attendees: attendeesTrue });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});


router.post("/deleteAttendee", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { username } = req.body;

    // Find the conference by its code
    const conference = await Conference.findOne({ conferenceCode });
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    // Find the attendee in `attendeesFalse`
    const attendeeFalseIndex = conference.attendeesFalse.findIndex(
      (user) => user.username === username
    );

    const attendeesTrueIndex = conference.attendeesTrue.findIndex(
      (user) => user.username === username
    );

    const totalAttendeeIndex = conference.totalAttendee.findIndex(
      (user) => user.username === username
    );


    if (
      attendeeFalseIndex === -1 &&
      attendeesTrueIndex === -1 &&
      totalAttendeeIndex === -1
    ) {
      return res.status(404).json({ error: "User not found" });
    }

    if (attendeeFalseIndex !== -1) {
      conference.attendeesFalse.splice(attendeeFalseIndex, 1);
    }
    if (attendeesTrueIndex !== -1) {
      conference.attendeesTrue.splice(attendeesTrueIndex, 1);
    }
    if (totalAttendeeIndex !== -1) {
      conference.totalAttendee.splice(totalAttendeeIndex, 1);
    }

    // Save the updated conference document
    await conference.save();

    res.status(200).json({ message: "Attendee deleted successfully" });
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});



router.post("/addNewAttendee", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { username, name, email } = req.body;

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.attendeesFalse.push({
      username,
      name,
      email,
    });

    // conference.totalAttendee.push({
    //   username,
    //   name,
    //   email,
    // });

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Attendee Added Successfully",
      data: conference.attendeesFalse[conference.attendeesFalse.length - 1],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding attendee",
      error: error.message,
    });
  }
});



router.post("/sendInvitation", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { attendees } = req.body; // Expect an array of attendees

    // Validate request body
    if (!Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of attendees",
      });
    }

    // Find the conference
    const conference = await Conference.findOne({ conferenceCode });
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Validate each attendee and collect validation errors
    const validationErrors = [];
    const validAttendees = [];

    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];

      // Check if all required fields are present
      if (!attendee.username || !attendee.name || !attendee.email) {
        validationErrors.push({
          index: i,
          attendee,
          error: "Missing required fields",
        });
        continue;
      }

      // Check if already registered in attendeesFalse
      const isInFalse = conference.attendeesFalse.some(
        (existing) =>
          existing.username === attendee.username ||
          existing.email === attendee.email
      );

      const isinTotal = conference.totalAttendee.some(
        (existing) =>
          existing.username === attendee.username ||
          existing.email === attendee.email
      );

      // Check if already registered in attendeesTrue
      const isInTrue = conference.attendeesTrue.some(
        (existing) =>
          existing.username === attendee.username ||
          existing.email === attendee.email
      );


      if (isInFalse || isInTrue || isinTotal) {
      // if (isInFalse || isInTrue) {
        validationErrors.push({
          index: i,
          attendee,
          error: "Already registered",
        });
        continue;
      }


      // If all validations pass, add to valid attendees
      validAttendees.push({
        username: attendee.username,
        name: attendee.name,
        email: attendee.email,
      });
    }


    // Add valid attendees to conference
    if (validAttendees.length > 0) {
      conference.totalAttendee.push(...validAttendees);
      // conference.totalAttendee.push(...validAttendees);
      await conference.save();
    }


    // Prepare response
    const response = {
      success: true,
      message: "Bulk registration processed",
      summary: {
        total: attendees.length,
        successful: validAttendees.length,
        failed: validationErrors.length,
      },
      validAttendees,
      errors: validationErrors,
    };

    // If all failed, return 400 status
    if (validAttendees.length === 0) {
      return res.status(400).json({
        ...response,
        success: false,
        message: "No valid attendees to register",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in bulk registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});


router.post("/acceptedInvitation", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name, designation, organization, mobile, email, about, linkedIn, location } = req.body;

    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    conference.business_card.push({ name, designation, organization, mobile, email, about, linkedIn, location });

    await conference.save();

    res.status(200).json({ message: "Business card added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ------------------------------------------------------------------------------------

router.post("/registerAttendees", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { attendees } = req.body; // Expect an array of attendees

    // Validate request body
    if (!Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of attendees",
      });
    }

    // Find the conference
    const conference = await Conference.findOne({ conferenceCode });
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Validate each attendee and collect validation errors
    const validationErrors = [];
    const validAttendees = [];

    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];

      // Check if all required fields are present
      if (!attendee.username || !attendee.name || !attendee.email) {
        validationErrors.push({
          index: i,
          attendee,
          error: "Missing required fields",
        });
        continue;
      }

      // Check if already registered in attendeesFalse
      const isInFalse = conference.attendeesFalse.some(
        (existing) =>
          existing.username === attendee.username ||
          existing.email === attendee.email
      );

      // Check if already registered in attendeesTrue
      const isInTrue = conference.attendeesTrue.some(
        (existing) =>
          existing.username === attendee.username ||
          existing.email === attendee.email
      );

      if (isInFalse || isInTrue) {
        validationErrors.push({
          index: i,
          attendee,
          error: "Already registered",
        });
        continue;
      }

      // If all validations pass, add to valid attendees
      validAttendees.push({
        username: attendee.username,
        name: attendee.name,
        email: attendee.email,
      });
    }

    // Add valid attendees to conference
    if (validAttendees.length > 0) {
      conference.attendeesFalse.push(...validAttendees);
      // conference.totalAttendee.push(...validAttendees);
      await conference.save();
    }

    // Prepare response
    const response = {
      success: true,
      message: "Bulk registration processed",
      summary: {
        total: attendees.length,
        successful: validAttendees.length,
        failed: validationErrors.length,
      },
      validAttendees,
      errors: validationErrors,
    };

    // If all failed, return 400 status
    if (validAttendees.length === 0) {
      return res.status(400).json({
        ...response,
        success: false,
        message: "No valid attendees to register",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in bulk registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Route t  fo move a user from `attendeesFalse` to `attendeesTrue`
router.put("/move-attendee", async (req, res) => {
  const { conferenceCode } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Find the conference by ID and the user in attendeesFalse
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    // Find the attendee in `attendeesFalse`
    const attendeeIndex = conference.attendeesFalse.findIndex(
      (attendee) => attendee.username === username
    );

    if (attendeeIndex === -1) {
      return res
        .status(404)
        .json({ error: "User not found in attendeesFalse" });
    }

    // Remove attendee from `attendeesFalse` and push to `attendeesTrue`
    const [attendee] = conference.attendeesFalse.splice(attendeeIndex, 1);
    conference.attendeesTrue.push(attendee);

    // Save the updated conference document
    await conference.save();

    res.status(200).json({
      message: "Attendee moved successfully",
      attendee,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

// -------------------------------------------------------------------------------

router.post("/addNewMentor", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name, photo, profession, lastModfied } = req.body;

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.mentors.push({
      name,
      photo,
      profession,
      lastModfied,
    });

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Mentor Added Successfully",
      data: conference.mentors[conference.mentors.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding mentor",
      error: error.message,
    });
  }
});

router.get("/mentors", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // res.status(200).json({conferenceMentors: conference.mentors});
    res.status(200).json(conference.mentors);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching mentors",
      error: error.message,
    });
  }
});

router.post("/deleteMentor", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name } = req.body;
    // console.log("imageIndex");

    // Find the conference by its code
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Find the image index in the slidingImages array by name
    const imageIndex = conference.mentors.findIndex((img) => img.name === name);

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "mentor not found",
      });
    }

    // console.log(imageIndex);
    // Remove the image from the array
    conference.mentors.splice(imageIndex, 1);

    // Save the updated conference document
    await conference.save();

    res.status(200).json({
      success: true,
      message: "mentor deleted successfully",
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error deleting image",
    //   error: error.message,
    // });
    res.status(500).json({ error: error.message });
  }
});

router.post("/addNewSponsors", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name, photo, lastModfied } = req.body;

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.sponsors.push({
      name,
      photo,
      lastModfied,
    });

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      success: true,
      message: "sponsor Added Successfully",
      data: conference.sponsors[conference.sponsors.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding sponsors",
      error: error.message,
    });
  }
});

router.get("/sponsors", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.sponsors);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sponsors",
      error: error.message,
    });
  }
});

router.post("/deleteSponsor", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name } = req.body;
    // console.log("imageIndex");

    // Find the conference by its code
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Find the image index in the slidingImages array by name
    const imageIndex = conference.sponsors.findIndex(
      (img) => img.name === name
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "sponsor not found",
      });
    }

    // console.log(imageIndex);
    // Remove the image from the array
    conference.sponsors.splice(imageIndex, 1);

    // Save the updated conference document
    await conference.save();

    res.status(200).json({
      success: true,
      message: "sponsor deleted successfully",
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error deleting image",
    //   error: error.message,
    // });
    res.status(500).json({ error: error.message });
  }
});

router.post("/addNewImages", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name, photo, lastModfied } = req.body;

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.slidingImages.push({
      name,
      photo,
      lastModfied,
    });

    // Save the updated conference
    await conference.save();

    res.status(200).json({
      success: true,
      message: "images Added Successfully",
      data: conference.slidingImages[conference.slidingImages.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding images",
      error: error.message,
    });
  }
});

router.get("/images", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.slidingImages);
    // res.status(200).json({ eventimages : conference.slidingImages['photo'] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message,
    });
  }
});

router.post("/deleteImage", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { name } = req.body;
    console.log("imageIndex");

    // Find the conference by its code
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Find the image index in the slidingImages array by name
    const imageIndex = conference.slidingImages.findIndex(
      (img) => img.name === name
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // console.log(imageIndex);
    // Remove the image from the array
    conference.slidingImages.splice(imageIndex, 1);

    // Save the updated conference document
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error deleting image",
    //   error: error.message,
    // });
    res.status(500).json({ error: error.message });
  }
});

router.post("/addAbout", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const { title, description } = req.body;

    // Find the conference and push the new food item
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({
        message: "Conference not found",
      });
    }

    // Add new food item to the array
    conference.about = {
      title,
      description,
    };

    // Save the updated conference
    await conference.save();

    res.status(200).json(conference.about);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding about",
      error: error.message,
    });
  }
});

router.get("/about", async (req, res) => {
  try {
    const { conferenceCode } = req.params;
    const conference = await Conference.findOne({
      conferenceCode,
    });

    if (!conference) {
      return res.status(404).json({
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.about);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching about",
      error: error.message,
    });
  }
});

// Get all helplines for a specific conference
router.get("/helplines", async (req, res) => {
  try {
    const conference = await Conference.findOne({
      conferenceCode: req.params.conferenceCode,
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json(conference.helpline);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching helplines",
      error: error.message,
    });
  }
});

// Add a new helpline to a conference
router.post("/addNewHelpline", async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Both name and phone are required",
      });
    }

    const conference = await Conference.findOne({
      conferenceCode: req.params.conferenceCode,
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Add new helpline
    conference.helpline.push({ name, phone });
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Helpline added successfully",
      helpline: conference.helpline[conference.helpline.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding helpline",
      error: error.message,
    });
  }
});

// Delete a helpline from a conference
router.delete("/helpline/:name", async (req, res) => {
  try {
    const conference = await Conference.findOne({
      conferenceCode: req.params.conferenceCode,
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    // Find and remove the helpline by name
    const helplineIndex = conference.helpline.findIndex(
      (h) => h.name === req.params.name
    );

    if (helplineIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Helpline not found",
      });
    }

    conference.helpline.splice(helplineIndex, 1);
    await conference.save();

    res.status(200).json({
      success: true,
      message: "Helpline deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting helpline",
      error: error.message,
    });
  }
});

const EmailRouter = require("../utils/sendEmail");
router.use("/email", EmailRouter);

module.exports = router;
