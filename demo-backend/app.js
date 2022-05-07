var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.EMAIL_USERNAME,
   process.env.EMAIL_PASSWORD)

let transport = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
     user: process.env.EMAIL_USERNAME,
     pass: process.env.EMAIL_PASSWORD
   }
});

app.post('/', function (req, res) {
   if (!req.body.email || !req.body.email.toString().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      res.status(400);
      res.json({ message: "Bad Request" });
   } else {

      const mailOptions = {
         from: process.env.EMAIL_USERNAME, // Sender address
         to: req.body.email, // List of recipients
         subject: 'Node Mailer', // Subject line
         text: 'Hello People!, Welcome to Bacancy!', // Plain text body
      };

      try {
         transport.sendMail(mailOptions, (err, info) => {
            if (err) {
               console.log(err);
               res.send("ERROR: " + err);
            } else {
               console.log(err);
               res.send("Email sent to " + req.body.email + ". " + info);
            }
         });
      } catch (err) {
         console.log(err);
         res.send("ERROR: " + err);
      }

      
   }
});

app.listen(3000, function () {
   console.log('CORS-enabled web server listening on port 3000. http://localhost:3000')
})
