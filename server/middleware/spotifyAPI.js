var SpotifyWebApi = require("spotify-web-api-node");
const config = require("../config/key");
const { User } = require("../models/User");

var credentials = {
  clientId: config.clientID,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectURL,
};

var spotifyApi = new SpotifyWebApi(credentials);

let exchangeCode = (req, res, next) => {
  let id = req.body.userID;
  let code = req.body.code;

  User.findOne({ _id: id }, (err, user) => {
    if (!user)
      return res.json({
        success: false,
        message: "User not found",
      });
    spotifyApi.authorizationCodeGrant(code).then(
      function (data) {
        User.findOneAndUpdate(
          { _id: id },
          {
            accessToken: data.body["access_token"],
            refreshToken: data.body["refresh_token"],
            connectedSpotify: true,
            accessTokenExp: data.body["expires_in"],
            accessTokenTimestamp: Math.floor(new Date().getTime() / 1000),
          },
          (err, doc) => {
            if (err) return res.json({ success: false, err });
          }
        );
        req.connectedSpotify = true;
        next();
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  });
};

let getTokens = (req, res, next) => {
  let id = req.user._id;

  User.findOne({ _id: id }, (err, user) => {
    if (!user)
      return res.json({
        success: false,
        message: "User not found",
      });

    req.accessToken = user.accessToken;
    req.refreshToken = user.refreshToken;

    next();
  });
};

let refreshTokens = (req, res, next) => {
  let currentTimestamp = Math.floor(new Date().getTime() / 1000);
  if (
    req.user.accessTokenExp + req.user.accessTokenTimestamp <=
    currentTimestamp - 60
  ) {
    spotifyApi.setRefreshToken(req.refreshToken);
    spotifyApi.refreshAccessToken().then(
      function (data) {
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            accessToken: data.body["access_token"],
            accessTokenExp: data.body["expires_in"],
            accessTokenTimestamp: Math.floor(new Date().getTime() / 1000),
          },
          (err, doc) => {
            if (err)
              return res.json({
                success: false,
                message: "User not found",
                error: err,
              });
          }
        );
        req.refreshed = true;
        next();
      },
      function (err) {
        req.refreshed = false;
        console.log("Could not refresh access token", err);
        return res.json({
          success: false,
          message: "Could not refresh access token",
          error: err,
        });
      }
    );
  } else next();
};

module.exports = { exchangeCode, getTokens, refreshTokens, spotifyApi };
