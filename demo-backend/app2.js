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
        console.log("creating transporter...")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crbyluna@gmail.com',
                pass: ''
            }
        });

        console.log("creating email...")
        const msg = {
            from: '"LUNA Click and Rent" <crbyluna@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "Sup", // Subject line
            text: "Long time no see", // plain text body
        }

        console.log("sending email...")
        const info = await transporter.sendMail(msg);
        console.log("Email sent!")
        res.status(200).send({message: "Email sent!"});
    } catch (err) {
        res.status(400).send({message: "Email failed to send", error: err});
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
