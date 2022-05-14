const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { promisify } = require('util');
const fs = require('fs');
const handlebars = require('handlebars');

dotenv.config({ path: '.env' });

const readFile = promisify(fs.readFile);

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors({ origin: 'https://clickandrent-demo.web.app' }));

const sendMail = (sendTo) => {
    let html = await readFile('email.html', 'utf8');
    let template = handlebars.compile(html);
    let data = {
        code: "4353"
    };
    let htmlToSend = template(data);

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
        html: htmlToSend
          // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent to "' + sendTo + '"' + info.response);
    });

}

app.get('/', (req, res) => {
    res.send('Simple get request');
})

app.post('/', async(req, res) => {
    try {
        const dt = new Date();
        console.log("Attempting to sent mail to \"" + req.body.email + "\" at " + dt.toUTCString() + " (" + dt.getTime() + ")");
        if (req.body.email && req.body.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            sendMail(req.body.email);
            res.status(200).send({ message: "Email sent!" });
        } else {
            res.status(400).send({ message: "Incorrect destination address error", error: "The input is not a valid email address" });
        }
    } catch (err) {
        res.status(400).send({ message: "Transporter error", error: err });
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));