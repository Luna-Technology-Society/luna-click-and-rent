const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const https = require('https');
const fs = require('fs');


const app = express();
const port = 80;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello vro!');
})

app.post('/', async (req, res) => {
    const {email} = req.body;
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sven.hackett45@ethereal.email',
            pass: 'UnmU1GqgrKs9zz5vcP'
        }
    });
    
    const msg = {
        from: '"LUNA Click and Rent" <crluna@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Sup", // Subject line
        text: "Long time no see", // plain text body
    }
    // send mail with defined transport object
    const info = await transporter.sendMail(msg);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
    res.send('Email Sent!')
})

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('certificate.pem'),
  }, app);
    

httpsServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});