const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const tagSchema = mongoose.Schema({
  name: { type: String, unique: 1, trim: true },
  color: { type: String },
});

const contentSchema = mongoose.Schema({
  contentId: { type: String, unique: 1, trim: true },
  contentType: { type: String },
  tag: { type: tagSchema },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    maxlength: 50,
    unique: 1,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  accessToken: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
  accessTokenExp: {
    type: Number,
    default: 0,
  },
  accessTokenTimestamp: {
    type: Number,
    default: 0,
  },
  connectedSpotify: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  tags: [tagSchema],
  content: [contentSchema],
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, "secret", function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
const Tag = mongoose.model("Tag", tagSchema);
const Content = mongoose.model("Content", contentSchema);

module.exports = { User, Tag, Content };
