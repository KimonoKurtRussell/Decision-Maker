"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// knex/db communicating functions
const userData = require("./public/scripts/createUserData")(knex);
const pollData = require("./public/scripts/createPollData")(knex);
const findPoll = require("./public/scripts/findPoll")(knex);
const deletePoll = require("./public/scripts/deletePoll")(knex);
const queryOptions = require("./public/scripts/queryOptions")(knex);
// const findPollConf = require("./public/scripts/findPollConf")(knex);



app.get("/", (req, res) => {
  res.render("index");
});
app.get("/poll", (req, res) => {
  res.render("poll");
});





// GET Results page - data query for question, options and score
app.get("/admin/polls/:id", (req, res) => {
  const pollURL = `polls/${req.params.id}`;
  queryOptions.findPollData(pollURL, (err, rows) => {
    if (err) {
      console.log("error finding poll data");
      res.status(500).send()
    }
    console.log(rows);
      var pollResults = {
      pollQuestion: rows[0]["poll_question"],
      options: rows.map(function(e) {
        return e["choice_description"];
      }),
      scores: rows.map(function(e) {
        return e["score"];
      })
    }
    console.log(pollResults);
  })
  res.render("results", {pollResults});
});

// GET specific poll page - db query for question, options
app.get("/polls/:id", (req, res) => {
  const pollURL = `polls/${req.params.id}`;
  console.log(pollURL);
  findPoll.findPollDis(pollURL, (err, rows) => {
    if (err) {
      console.log("error finding poll data");
      res.status(500).send()

    }
    // console.log(rows);
    // console.log(rows[0]["poll_question"]);
    const pollData = {
      pollQuestion: rows[0]["poll_question"],
      options: rows.map(function(e) {
        return e["choice_description"];
      })
    }
    console.log(pollData);

    res.render("polls_show", {pollData});

    // res.render("polls_show", {pollQ});
  });
});

// //GET - userPolls - all polls associated with one poll
// app.get("admin/polls/all", (req, res) => {
//   res.render("userpolls");
// });

// //GET - confirmation page - displaying the two urls to share with friends - db query for urls
// app.get("polls/thankyou/:id", req, res) => {
//   const pollURL = `polls/${req.params.id}`;
// findPollConf.findPollUrls(pollURL, (err, rows) => {
//     if (err) {
//       console.log("error finding poll data");
//       res.status(500).send()
//     }
//     console.log(`successfully found: ${rows}`)
//   res.render("thankyou", {rows})
// }
// });




//DELETE (POST) delete poll page
// app.post("/polls/:id/delete", (req, res) => {
//   var pollURL = `polls/${req.params.id}`;
//   deletePoll.delPoll(pollURL) => {
//     console.log("successfully deleted");
//   }
//   res.redirect("/polls");
// });

// //LOGIN (POST) -----> redirect to user polls
// app.post("/login", (req, res) => {
//   var emailInput = req.body.email;
//   for (userIDs in users) {
//     if (users[userIDs]["email"] == emailInput && bcrypt.compareSync(req.body.password, users[userIDs]["password"])) {
//       req.session.user_ID = userIDs;
//       return res.redirect("/urls");
//     }
//   }
//   return res.send('<p>Invalid email or password. <a href="/login">Try again</a></p>');
// });

// POST create poll
// app.post("/polls", (req, res) => {
//       var pollDesc = req.body.description; //now being handled by Ajax
//       var pollQuestion = req.body.question; //now being handled by Ajax
//       var pollId = generateRandomString();
//       var userName = req.body.name; //now being handled by Ajax
//       var userEmail = req.body.email; //now being handled by Ajax
//       var pollURL = `polls/${pollId}` //send to database?
//       var adminURL = `admin/polls/${pollId}` //send to database?

//         if (!userEmail) {
//           res.send('You must enter an email to create a poll')
//         } else {
//           //how are we treating existing emails...create a function to check if it exists?
//           //function to send data to database (user table)
//           userData.addUser(userEmail, userName, (err, rows) => {
//               if (err) {
//                 console.log("error adding user data");
//               }
//               console.log(`testing if user add successful: ${rows}`)
//             }
//             //function to send data to database (poll table)
//             // pollData.addPoll(pollTitle, pollDesc, pollURL, adminURL, (err, rows) => {
//             //     if (err) {
//             //       console.log("error adding poll data");
//             //     }
//             //     console.log(`testing if poll data add successful: ${rows}`)
//             //   }
//             //tweak to send just URLs?
//               pollData.addPoll(pollURL, adminURL, (err, rows) => {
//                 if (err) {
//                   console.log("error adding poll data");
//                 }
//                 console.log(`testing if poll data add successful: ${rows}`)
//               }
//               res.redirect(`/polls/${PollId}`);
//             })
//             //send email to user... should this be done on server or ajax
//     })


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
