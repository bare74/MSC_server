const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

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

//username and password
const myusername = "gokstad";
const mypassword = "skolen";

let session = [];

// app.get("/", (req, res) => {
//   session = req.session;
//   if (session.userid) {
//     res.send("Welcome User <a href='/logout'>click to logout</a>");
//   } else res.sendFile("index.html", { root: __dirname });
// });

app.post("/user", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    res.cookie("username", req.body.username);
    res.cookie("password", req.body.password);
    session = req.session;
    session.userid = req.body.username;
    console.log(req.body);

    // res.send(`Hei, velkommen inn <a href=\'/logout'>Klikk her for logg av</a>`);
    res.sendFile("userpage.html", {
      root: __dirname,
    });
  } else {
    res.send("Feil brukernavn eller passord");
  }
});

// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

app.get("/userpage", function (req, res) {
  res.sendFile("userpage.html", {
    root: __dirname,
  });
});

app.post("/userpage", function (req, res) {
  //   console.log(`Hei ${req.cookies.username}`);
  //   myusername.replace("dog", "monkey");
  //   console.log(`Hei ${req.cookies.username}`);
  //   res.redirect("/userpage");
  //   req.body.mypassword(req.body.password, (err, user) => {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       user.mypassword(
  //         req.body.oldpassword,
  //         req.body.newpassword,
  //         function (err) {
  //           if (err) {
  //             res.send(err);
  //           } else {
  //             res.send("successfully change password");
  //           }
  //         }
  //       );
  //     }
  //   });
  //   if (req.body.oldpassword == myusername) {
  req.body.oldpassword.replace(req.body.newpassword);
  res.cookie("password", req.body.password);
  session = req.session;
  session.userid = req.body.username;
  console.log("Ny linje", req.body.newpassword);
  //   }
});

app.listen(port, () =>
  console.log(`Server started on port ${port} and http://${hostname}`)
);

// res.send(
//   `h<1>Login <button type="button" onclick="location.href = '/'; ">HOME </button>`
// );
