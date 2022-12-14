const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

var data = fs.readFileSync("data.json");
var myObject = JSON.parse(data);

const app = express();
const port = process.env.PORT || 8080;
const hostname = "localhost:8080";

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "something_secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(express.json());

let session = [];

app.post("/user", (req, res) => {
  if (
    req.body.username == myObject[0].username &&
    req.body.password == myObject[0].password
  ) {
    res.cookie("username", req.body.username);
    res.cookie("password", req.body.password);
    session = req.session;

    res.sendFile("userpage.html", {
      root: __dirname,
    });
  } else {
    res.send("Feil brukernavn eller passord");
  }
});

app.get("/userpage", function (req, res) {
  res.sendFile("userpage.html", {
    root: __dirname,
  });
});

// edit password
app.post("/userpage", function (req, res) {
  if (myObject[0].password == req.body.oldpassword) {
    req.body.oldpassword.replace(req.body.newpassword);
    res.cookie("password", req.body.newpassword);
    session = req.session;

    const path = "./data.json";
    const data = [{ id: 1, username: "John", password: req.body.newpassword }];
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      console.log("data update sucsess");
      res.send("Gratulere passord er oppdatert!");
    } catch (error) {
      console.log("error writing data");
    }
  } else {
    res.send("Feil passord");
  }
});

app.listen(port, () =>
  console.log(`Server started on port ${port} and http://${hostname}`)
);
