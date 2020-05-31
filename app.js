//jshint esversion: 6

//require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); // static content

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and listen on port 3000.");
});

app.get("/", function(req, res) {
  //res.send("Welcome!");
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // data object
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/" + process.env.MY_ID;

  const options = {
    method: "POST",
    auth: process.env.AUTH_KEY,
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      //res.send("Successfully subscribed!");
      res.sendFile(__dirname + "/success.html");
    } else {
      //res.send("There was an error with signing up, please try again!");
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));

      // const mailchimpData = JSON.parse(data);

      // if (mailchimpData.errors.length != 0) {
      //   console.log("==> Error found...");
      // } else {
      //   console.log("==> No error...");
      // }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});
