var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors')

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function(req, res){
    if(!req.body.email || !req.body.email.toString().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
       res.status(400);
       res.json({message: "Bad Request"});
    } else {
       res.send("Email sent to " + req.body.email);
    }
 });

 app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000. http://localhost:3000')
  })
