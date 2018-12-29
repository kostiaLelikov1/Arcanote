const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

router.post("/login", function(req, res) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err === false || !user) {
      return res.sendStatus(400);
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(JSON.stringify(user), "Super-secret");
      return res.json({ token });
    });
  })(req, res);
});

module.exports = router;
