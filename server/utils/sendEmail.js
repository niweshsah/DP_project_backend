// poqo fznf wprs kmru
// code for my email



const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
// const User = require("../models/user"); // Adjust the path as necessary
require("dotenv").config(); // To use environment variables from the .env file
const express = require("express");
// const router = express.Router();
const router = express.Router({ mergeParams: true });

const User = require("../models/user"); // Adjust the path as necessary
const Conference = require("../models/conference"); // Adjust the path as necessary

// Set up nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sahniwesh@gmail.com", // Replace with your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Replace with your app-specific password from .env
  },
});






// Function to generate and send a QR code email
async function sendQRCodeEmail(user) {
  try {
    // Generate QR code as a buffer (assuming `user.secretQRSTring` contains the unique secret for the QR code)
    // const qrCodeBuffer = await QRCode.toBuffer(user.username || user.email);
    const conferenceCode = req.params.conferenceCode;


    // Email configuration
    const mailOptions = {
      from: "sahniwesh@gmail.com", // Sender address
      to: user.email, // Receiver's email
      subject: "Your QR Code for the Conference",
      html: `
        <p>Hi ${user.name},</p>
        <p>We humbly invite you to our conference. Your eventCode is ${conferenceCode}.</p>
        <p>Best regards,<br/>GatherHub Team</p>
      `,
      // attachments: [
      //   {
      //     filename: "QRCode.png",
      //     content: qrCodeBuffer,
      //     contentType: "image/png",
      //   },
      // ],
    };

    
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`QR code email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
}

// Function to send QR codes to all attendees in `attendeesFalse`
async function sendQRCodesToAllUsers(conference) {
  try {
    // Fetch the conference document by ID
    // const conferenceCode = req.params.conferenceCode;

    // const conference = await Conference.findOne({ conferenceCode });

    const attendeesFalseList = conference.attendeesFalse;

    // Loop through each user in attendeesFalse and send an email
    for (const user of attendeesFalseList) {
      await sendQRCodeEmail(user);
    }
  } catch (error) {
    console.error("Error fetching attendees or sending emails:", error);
  }
}

// Send email to all attendees of the conference
router.get("/sendEmails", async (req, res) => {
  try {
    const conferenceCode = req.params.conferenceCode;
    // console.log(conferenceId);
    const conference = await Conference.findOne({ conferenceCode });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    sendQRCodesToAllUsers(conference);
    res.status(200).json({ message: "Emails sent to all attendees" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Error sending emails" });
  } 
}
);


// Export the functions to be used elsewhere
module.exports = { sendQRCodeEmail, sendQRCodesToAllUsers };
module.exports = router;