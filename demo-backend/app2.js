const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors({ origin: 'https://clickandrent-demo.web.app/' }));

app.get('/', (req, res) => {
    res.send('Simple get request');
})

app.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crbyluna@gmail.com',
                pass: ''
            }
        });

        const msg = {
            from: '"LUNA Click and Rent" <crbyluna@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "Sup", // Subject line
            text: "Long time no see", // plain text body
        }
        // send mail with defined transport object
        const info = await transporter.sendMail(msg);

        res.send('Email Sent!', info)
    } catch (err) {
        res.send('Failed ot send email!', err)
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
