const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const config = require("../config/key");

var verifyAdmin = [auth, admin];

router.get("/get_users", verifyAdmin, (req, res) => {
  var users = [];
  User.find({}, (err, user) => {
    if (!err)
      user.map((u) => {
        users.push({ username: u.username, email: u.email });
      });

    return res.status(200).json({
      success: true,
      data: users,
    });
  });
});

router.post("/delete_user", verifyAdmin, (req, res) => {
  User.findOneAndDelete({email: req.body.user.email}, (err, user) => {
    if (err)
    return res.json({
      success: false,
      error: err,
    });

    return res.status(200).json({
      success: true
    });
  });
});

module.exports = router;
