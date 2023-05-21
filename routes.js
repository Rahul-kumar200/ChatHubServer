const express = require("express");
let { connectToDb, getDb } = require("./db");

const router = express.Router();

router.post("/api/login", (req, res, next) => {
  const db = req.app.locals.db;
  // checking username and password and sending data according to it
  db.collection("chatsInfo")
    .findOne({ username: req.body.username, password: req.body.password })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/api/signup", (req, res, next) => {
  const db = req.app.locals.db;
  db.collection("chatsInfo")
    .findOne({ username: req.body.username })
    .then((doc) => {
      if (doc === null) {
        db.collection("chatsInfo").insertOne({
          username: req.body.username,
          password: req.body.password,
          rooms: [],
        });
        res.json({ status: "success" });
      }
      // already exist with this username
      else {
        res.json({ status: "failed" });
      }
    });
});

router.post("/api/logout", (req, res, next) => {
  const db = req.app.locals.db;
  const collection = db.collection("chatsInfo");
  const filter = { username: req.body.username };
  const update = { $set: { rooms: req.body.rooms } };

  collection
    .updateOne(filter, update)
    .then((result) => {
      if (result.matchedCount === 1) {
        console.log('updated')
        res.json({ status: "success" });
      } else {
        console.log('failure')
        res.json({ status: "failure", message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res
        .status(500)
        .json({
          status: "failure",
          message: "An error occurred while updating document",
        });
    });
});
module.exports = router;
