const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const hbs = require('nodemailer-express-handlebars')

// database demo
const database = {
    "0": {
        "deviceName": "Door 1",
        "entryKey": 1610
    }
}

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors({ origin: 'https://clickandrent-demo.web.app' }));

const getLinkForUser = () => {
    const HOST_ADDRESS = "https://clickandrent-demo.web.app/app/access/"
    const URI = encodeURIComponent(JSON.stringify(database["0"]));
    return HOST_ADDRESS + URI;
}

const sendMail = async (sendTo) => {
    // Transporter with the required configuration for Outlook
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

    const hanglebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialDir: path.resolve('./'),
            defaultLayout: false
        }, 
        viewPath: path.resolve('./'),
        extName: ".handlebars"
    }

    transporter.use('compile', hbs(hanglebarOptions))

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: process.env.MAIL_USERNAME, // sender address (who sends)
        to: sendTo, // list of receivers (who receives)
        subject: 'Your door access key is here!', // Subject line
        // html: html,
        template: 'email',
        context: {
            link: getLinkForUser()
        },
        attachments: [
            {   // stream as an attachment
                filename: 'fb-logo.png',
                content: fs.createReadStream('./images/fb-logo.png'),
                cid: "fb-logo"
            },
            {
                filename: 'twtr-logo.png',
                content: fs.createReadStream('./images/twtr-logo.png'),
                cid: "twtr-logo"
            },
            // unused cr-logo
            // {
            //     filename: 'cr-logo.png',
            //     content: fs.createReadStream('./images/cr-logo.png'),
            //     cid: "cr-logo"
            // }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent to "' + sendTo + '"' + info.response);
    });

}

app.get('/', (req, res) => {
    res.send('Simple get request');
})

app.post('/', async (req, res) => {
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