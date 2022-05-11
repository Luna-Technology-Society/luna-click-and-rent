const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors({ origin: 'https://clickandrent-demo.web.app/' }));

const sendMail = (sendTo) => {
    // Create the transporter with the required configuration for Outlook
    // change the user and pass !
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: process.env.MAIL_USERNAME, // sender address (who sends)
        to: sendTo, // list of receivers (who receives)
        subject: 'Hello ', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });

}

app.get('/', (req, res) => {
    res.send('Simple get request');
})

app.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        sendMail(email);
        res.status(200).send({ message: "Email sent!" });
    } catch (err) {
        res.status(400).send({ message: "Email failed to send", error: err });
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
