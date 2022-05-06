const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');

const nodemailer = require("nodemailer");

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
 });

 const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: 'receiver@gmail.com', // List of recipients
    subject: 'Node Mailer', // Subject line
    text: 'Hello People!, Welcome to Bacancy!', // Plain text body
};

// build multiple CRUD interfaces:
app.post('/', (req, res) => {
    transport.sendMail(mailOptions, function(err, info) {
        if (err) {
            res.send(err.message);
        } else {
            res.send("Email sent to: " + req.body.email);
        }
     });
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);

