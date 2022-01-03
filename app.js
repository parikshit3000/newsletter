require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded( {extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log('Server started at port 3000');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    // console.log(fname, lname, email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/"+ process.env.LID;
    const options = {
        method: "POST",
        auth: "parikshit:" + process.env.APIKEY
    };

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
            // var hello = JSON.parse(data);
            // var hell = hello.errors;
            // console.log(hell);
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});